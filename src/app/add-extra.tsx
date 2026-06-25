import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, Button, ActivityIndicator, IconButton, SegmentedButtons, TextInput, HelperText } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { COLORS } from '../constants/colors';
import { RentalRepository } from '../database/repositories/RentalRepository';
import { SessionService } from '../services/SessionService';
import { RentalItem, PaymentStatus } from '../models/types';
import { useCustomerStore } from '../stores/CustomerStore';

export default function AddExtraScreen() {
  const { id } = useLocalSearchParams();
  const sessionId = parseInt(id as string, 10);
  const { loadActiveSessions } = useCustomerStore();

  const [rentals, setRentals] = useState<RentalItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [cart, setCart] = useState<{ [id: number]: number }>({});
  const [overridePrices, setOverridePrices] = useState<{ [id: number]: string }>({});
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('PAID');
  const [amountPaidStr, setAmountPaidStr] = useState<string>('');

  useEffect(() => {
    async function load() {
      try {
        const available = await RentalRepository.getAvailableRentals();
        setRentals(available);
      } catch (e: any) {
        Alert.alert('Error', e.message);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const updateCart = (id: number, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const calculateTotal = () => {
    let total = 0;
    rentals.forEach(r => {
      const qty = cart[r.id] || 0;
      if (qty > 0) {
        const customPriceStr = overridePrices[r.id];
        const price = customPriceStr ? parseFloat(customPriceStr) : r.default_price;
        total += qty * price;
      }
    });
    return total;
  };

  const totalAmount = calculateTotal();
  const amountPaidInput = parseFloat(amountPaidStr || '0');

  let finalAmountPaid = 0;
  if (paymentStatus === 'PAID') finalAmountPaid = totalAmount;
  else if (paymentStatus === 'PARTIAL') finalAmountPaid = amountPaidInput;
  else if (paymentStatus === 'UNPAID') finalAmountPaid = 0;

  const handleSave = async () => {
    if (totalAmount === 0) {
      Alert.alert('Error', 'Please select at least one item');
      return;
    }

    if (paymentStatus === 'PARTIAL' && (finalAmountPaid <= 0 || finalAmountPaid >= totalAmount)) {
      Alert.alert('Error', 'Invalid partial payment amount');
      return;
    }

    let success = false;
    setIsSubmitting(true);
    try {
      const items = rentals
        .filter(r => (cart[r.id] || 0) > 0)
        .map(r => {
          const customPriceStr = overridePrices[r.id];
          const price = customPriceStr ? parseFloat(customPriceStr) : r.default_price;
          return { id: r.id, quantity: cart[r.id], price };
        });

      await SessionService.addRentalsToSession(sessionId, items, paymentStatus, finalAmountPaid);
      await loadActiveSessions();
      success = true;
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      if (!success) {
        setIsSubmitting(false);
      }
    }

    if (success) {
      router.back();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={rentals}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card style={styles.card} mode="outlined">
            <Card.Title
              title={item.name}
              subtitle={`${item.default_price} EGP`}
              right={(props) => (
                <View style={styles.rightActions}>
                  {(cart[item.id] || 0) > 0 && (
                    <TextInput
                      mode="outlined"
                      label="Rate"
                      value={overridePrices[item.id] !== undefined ? overridePrices[item.id] : item.default_price.toString()}
                      onChangeText={(val) => setOverridePrices(prev => ({ ...prev, [item.id]: val }))}
                      keyboardType="number-pad"
                      style={styles.rateInput}
                      dense
                    />
                  )}
                  <View style={styles.qtyContainer}>
                    <IconButton 
                      icon="minus" 
                      size={20} 
                      onPress={() => updateCart(item.id, -1)} 
                      disabled={(cart[item.id] || 0) === 0} 
                    />
                    <Text style={styles.qtyText}>{cart[item.id] || 0}</Text>
                    <IconButton 
                      icon="plus" 
                      size={20} 
                      onPress={() => updateCart(item.id, 1)} 
                    />
                  </View>
                </View>
              )}
            />
          </Card>
        )}
      />

      <View style={styles.bottomBar}>
        <Text variant="titleMedium" style={styles.totalText}>Total: {totalAmount} EGP</Text>
        
        {totalAmount > 0 && (
          <>
            <SegmentedButtons
              value={paymentStatus}
              onValueChange={(val) => setPaymentStatus(val as PaymentStatus)}
              buttons={[
                { value: 'PAID', label: 'Paid' },
                { value: 'PARTIAL', label: 'Partial' },
                { value: 'UNPAID', label: 'Unpaid' },
              ]}
              style={styles.segmented}
            />

            {paymentStatus === 'PARTIAL' && (
              <View style={styles.partialContainer}>
                <TextInput
                  label="Amount Paid *"
                  value={amountPaidStr}
                  onChangeText={setAmountPaidStr}
                  keyboardType="number-pad"
                  mode="outlined"
                  style={styles.input}
                />
                <Text variant="titleSmall" style={styles.remainingText}>
                  Remaining: {Math.max(0, totalAmount - finalAmountPaid)} EGP
                </Text>
              </View>
            )}

            <Button 
              mode="contained" 
              onPress={handleSave}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.saveButton}
            >
              Save Extras
            </Button>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 12,
    backgroundColor: COLORS.surface,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateInput: {
    width: 60,
    marginRight: 8,
    height: 40,
    fontSize: 14,
    backgroundColor: COLORS.background,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.primary + '20',
  },
  totalText: {
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  segmented: {
    marginBottom: 12,
  },
  partialContainer: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.background,
  },
  remainingText: {
    marginTop: 8,
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  saveButton: {
    marginTop: 8,
  },
});
