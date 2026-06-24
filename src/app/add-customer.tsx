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

// Validation Schema ensuring < 10 seconds error-free data entry
const customerSchema = z.object({
  fullName: z.string().min(1, 'Name is required').max(50, 'Max 50 characters').trim(),
  peopleCount: z.string().regex(/^[1-9][0-9]?$/, 'Must be 1-99'),
  sessionType: z.enum(['HALF_HOUR', 'ONE_HOUR', 'CUSTOM', 'OPEN']),
  customMinutes: z.string().optional(),
  paymentStatus: z.enum(['PAID', 'PARTIAL', 'UNPAID']),
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
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function AddCustomerScreen() {
  const loadActiveSessions = useCustomerStore(state => state.loadActiveSessions);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: '',
      peopleCount: '1',
      sessionType: 'ONE_HOUR',
      customMinutes: '',
      paymentStatus: 'PAID',
      notes: '',
    }
  });

  const sessionType = watch('sessionType');

  const onSubmit = async (data: CustomerFormData) => {
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
        total_amount: 0, // In full implementation, calculate based on settings
        status: 'ACTIVE'
      });

      await loadActiveSessions();
      router.back();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
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
  }
});
