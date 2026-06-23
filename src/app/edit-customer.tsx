import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, SegmentedButtons, Text, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';

import { COLORS } from '../constants/colors';
import { CustomerRepository } from '../database/repositories/CustomerRepository';
import { SessionRepository } from '../database/repositories/SessionRepository';
import { useCustomerStore } from '../stores/CustomerStore';

const editCustomerSchema = z.object({
  fullName: z.string().min(1, 'Name is required').max(50, 'Max 50 characters').trim(),
  peopleCount: z.string().regex(/^[1-9][0-9]?$/, 'Must be 1-99'),
  paymentStatus: z.enum(['PAID', 'PARTIAL', 'UNPAID']),
  notes: z.string().optional(),
});

type EditCustomerFormData = z.infer<typeof editCustomerSchema>;

export default function EditCustomerScreen() {
  const { id } = useLocalSearchParams();
  const sessionId = parseInt(id as string, 10);
  
  const activeSessions = useCustomerStore(state => state.activeSessions);
  const loadActiveSessions = useCustomerStore(state => state.loadActiveSessions);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const session = activeSessions.find(s => s.id === sessionId);

  const { control, handleSubmit, formState: { errors } } = useForm<EditCustomerFormData>({
    resolver: zodResolver(editCustomerSchema),
    defaultValues: {
      fullName: session?.customer_name || '',
      peopleCount: session?.people_count?.toString() || '1',
      paymentStatus: session?.payment_status || 'UNPAID',
      notes: '', // Notes aren't in ActiveSession by default, but would be fetched via CustomerRepo
    }
  });

  useEffect(() => {
    if (!session) {
      Alert.alert('Error', 'Session not found');
      router.back();
    }
  }, [session]);

  const onSubmit = async (data: EditCustomerFormData) => {
    if (!session) return;
    setIsSubmitting(true);
    try {
      // 1. Update Customer
      await CustomerRepository.updateCustomer(session.customer_id, {
        full_name: data.fullName,
        people_count: parseInt(data.peopleCount, 10),
        notes: data.notes || null,
      });

      // 2. Update Session Payment
      if (session.payment_status !== data.paymentStatus) {
        await SessionRepository.updatePaymentStatus(session.id, data.paymentStatus);
      }

      await loadActiveSessions();
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) return null;

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
        SAVE CHANGES
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
