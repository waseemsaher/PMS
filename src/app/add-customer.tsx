import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, SegmentedButtons, Text, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import dayjs from 'dayjs';

import { COLORS } from '../constants/colors';
import { CustomerRepository } from '../database/repositories/CustomerRepository';
import { SessionRepository } from '../database/repositories/SessionRepository';
import { useCustomerStore } from '../stores/CustomerStore';
import { useSettingsStore } from '../stores/SettingsStore';

// Validation Schema ensuring < 10 seconds error-free data entry
const customerSchema = z.object({
  fullName: z.string().min(1, 'Name is required').max(50, 'Max 50 characters').trim(),
  peopleCount: z.string().regex(/^[1-9][0-9]?$/, 'Must be 1-99'),
  sessionType: z.enum(['HALF_HOUR', 'ONE_HOUR', 'CUSTOM', 'OPEN']),
  customMinutes: z.string().optional(),
  paymentStatus: z.enum(['PAID', 'PARTIAL', 'UNPAID']),
  amountPaid: z.string().optional(),
  notes: z.string().optional(),
}).refine(data => {
  if (data.sessionType === 'CUSTOM') {
    const mins = parseInt(data.customMinutes || '0', 10);
    return mins >= 5 && mins <= 720;
  }
  return true;
}, {
  message: 'Custom duration must be between 5 and 720 minutes',
  path: ['customMinutes'],
}).refine(data => {
  if (data.paymentStatus === 'PARTIAL') {
    const amount = parseFloat(data.amountPaid || '0');
    return amount > 0;
  }
  return true;
}, {
  message: 'Amount paid is required for partial payments',
  path: ['amountPaid'],
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function AddCustomerScreen() {
  const loadActiveSessions = useCustomerStore(state => state.loadActiveSessions);
  const { settings } = useSettingsStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: '',
      peopleCount: '1',
      sessionType: 'ONE_HOUR',
      customMinutes: '',
      paymentStatus: 'PAID',
      amountPaid: '',
      notes: '',
    }
  });

  const sessionType = watch('sessionType');
  const paymentStatus = watch('paymentStatus');
  const peopleCountStr = watch('peopleCount');
  const customMinutesStr = watch('customMinutes');
  const amountPaidStr = watch('amountPaid');

  const peopleCount = parseInt(peopleCountStr || '0', 10);
  const customMinutes = parseInt(customMinutesStr || '0', 10);
  const amountPaidInput = parseFloat(amountPaidStr || '0');

  let calculatedTotal = 0;
  if (settings && sessionType !== 'OPEN') {
    if (sessionType === 'HALF_HOUR') {
      calculatedTotal = (settings.half_hour_price || (settings.hour_price / 2)) * peopleCount;
    } else if (sessionType === 'ONE_HOUR') {
      calculatedTotal = settings.hour_price * peopleCount;
    } else if (sessionType === 'CUSTOM') {
      calculatedTotal = (settings.hour_price / 60) * customMinutes * peopleCount;
    }
  }

  let finalAmountPaid = 0;
  if (paymentStatus === 'PAID') finalAmountPaid = calculatedTotal;
  else if (paymentStatus === 'PARTIAL') finalAmountPaid = amountPaidInput;
  else if (paymentStatus === 'UNPAID') finalAmountPaid = 0;

  const remainingAmount = Math.max(0, calculatedTotal - finalAmountPaid);

  const onSubmit = async (data: CustomerFormData) => {
    let success = false;
    setIsSubmitting(true);
    try {
      // 1. Create Customer
      const customerId = await CustomerRepository.createCustomer(
        data.fullName, 
        parseInt(data.peopleCount, 10), 
        data.notes || null
      );

      // 2. Determine duration
      let durationMinutes = null;
      if (data.sessionType === 'HALF_HOUR') durationMinutes = 30;
      else if (data.sessionType === 'ONE_HOUR') durationMinutes = 60;
      else if (data.sessionType === 'CUSTOM') durationMinutes = parseInt(data.customMinutes || '0', 10);

      // 3. Create Session
      const startTimestamp = dayjs().unix();
      let endTimestamp = null;
      if (durationMinutes) {
        endTimestamp = startTimestamp + (durationMinutes * 60);
      }

      await SessionRepository.createSession({
        customer_id: customerId,
        session_type: data.sessionType,
        start_timestamp: startTimestamp,
        end_timestamp: endTimestamp,
        actual_end_timestamp: null,
        duration_minutes: durationMinutes,
        is_open_session: data.sessionType === 'OPEN',
        payment_status: data.paymentStatus,
        total_amount: calculatedTotal,
        hours_amount_paid: finalAmountPaid,
        extras_amount_paid: 0,
        status: 'ACTIVE'
      });

      await loadActiveSessions();
      success = true;
    } catch (error) {
      console.error(error);
    } finally {
      if (!success) {
        setIsSubmitting(false);
      }
    }

    if (success) {
      router.back();
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, value } }) => (
          <View>
            <TextInput
              label="Customer Name *"
              value={value}
              onChangeText={onChange}
              mode="outlined"
              style={styles.input}
              error={!!errors.fullName}
              autoFocus
            />
            {errors.fullName && <HelperText type="error">{errors.fullName.message}</HelperText>}
          </View>
        )}
      />

      <Controller
        control={control}
        name="peopleCount"
        render={({ field: { onChange, value } }) => (
          <View>
            <TextInput
              label="Number of People *"
              value={value}
              onChangeText={onChange}
              keyboardType="number-pad"
              mode="outlined"
              style={styles.input}
              error={!!errors.peopleCount}
            />
            {errors.peopleCount && <HelperText type="error">{errors.peopleCount.message}</HelperText>}
          </View>
        )}
      />

      <Text style={styles.label}>Session Type *</Text>
      <Controller
        control={control}
        name="sessionType"
        render={({ field: { onChange, value } }) => (
          <SegmentedButtons
            value={value}
            onValueChange={onChange}
            buttons={[
              { value: 'HALF_HOUR', label: '30m' },
              { value: 'ONE_HOUR', label: '1h' },
              { value: 'CUSTOM', label: 'Custom' },
              { value: 'OPEN', label: 'Open' },
            ]}
            style={styles.segmented}
          />
        )}
      />

      {sessionType === 'CUSTOM' && (
        <Controller
          control={control}
          name="customMinutes"
          render={({ field: { onChange, value } }) => (
            <View>
              <TextInput
                label="Custom Duration (Minutes) *"
                value={value}
                onChangeText={onChange}
                keyboardType="number-pad"
                mode="outlined"
                style={styles.input}
                error={!!errors.customMinutes}
              />
              {errors.customMinutes && <HelperText type="error">{errors.customMinutes.message}</HelperText>}
            </View>
          )}
        />
      )}

      <Text style={styles.label}>Payment Status</Text>
      <Controller
        control={control}
        name="paymentStatus"
        render={({ field: { onChange, value } }) => (
          <SegmentedButtons
            value={value}
            onValueChange={onChange}
            buttons={[
              { value: 'PAID', label: 'Paid' },
              { value: 'PARTIAL', label: 'Partial' },
              { value: 'UNPAID', label: 'Unpaid' },
            ]}
            style={styles.segmented}
          />
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Notes (Optional)"
            value={value}
            onChangeText={onChange}
            mode="outlined"
            style={styles.input}
            multiline
          />
        )}
      />

      {sessionType !== 'OPEN' && (
        <View style={styles.summaryContainer}>
          <Text variant="titleMedium" style={styles.summaryText}>
            Total Price: {calculatedTotal} EGP
          </Text>

          {paymentStatus === 'PARTIAL' && (
            <Controller
              control={control}
              name="amountPaid"
              render={({ field: { onChange, value } }) => (
                <View style={styles.partialContainer}>
                  <TextInput
                    label="Amount Paid *"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="number-pad"
                    mode="outlined"
                    style={styles.input}
                    error={!!errors.amountPaid}
                  />
                  {errors.amountPaid && <HelperText type="error">{errors.amountPaid.message}</HelperText>}
                  <Text variant="titleSmall" style={styles.remainingText}>
                    Remaining: {remainingAmount} EGP
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      )}

      <Button 
        mode="contained" 
        onPress={handleSubmit(onSubmit)} 
        loading={isSubmitting} 
        disabled={isSubmitting}
        style={styles.submitButton}
      >
        START SESSION
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  input: {
    backgroundColor: COLORS.surface,
    marginBottom: 4,
  },
  label: {
    marginTop: 12,
    marginBottom: 8,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  segmented: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
  summaryContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  summaryText: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  partialContainer: {
    marginTop: 12,
  },
  remainingText: {
    marginTop: 8,
    color: COLORS.danger,
    fontWeight: 'bold',
  }
});
