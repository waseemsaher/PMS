import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, Button, ActivityIndicator, IconButton, SegmentedButtons, TextInput, HelperText } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { COLORS } from '../constants/colors';
import { RentalRepository } from '../database/repositories/RentalRepository';
import { RentalItem, PaymentStatus } from '../models/types';
import { useSessionMutations } from '../hooks/useSessionMutations';

const ExtraRentalCard = React.memo(({ 
  item, 
  quantity, 
  onUpdateCart 
}: { 
  item: RentalItem; 
  quantity: number; 
  onUpdateCart: (id: number, delta: number) => void 
}) => {
  return (
    <Card style={styles.card} mode="outlined">
      <Card.Title
        title={item.name}
        subtitle={`${item.default_price} EGP`}
        right={(props) => (
          <View style={styles.qtyContainer}>
            <IconButton 
              icon="minus" 
              size={20} 
              onPress={() => onUpdateCart(item.id, -1)} 
              disabled={quantity === 0} 
            />
            <Text style={styles.qtyText}>{quantity}</Text>
            <IconButton 
              icon="plus" 
              size={20} 
              onPress={() => onUpdateCart(item.id, 1)} 
            />
          </View>
        )}
      />
    </Card>
  );
});

export default function AddExtraScreen() {
  const { id } = useLocalSearchParams();
  const sessionId = parseInt(id as string, 10);
  const { addExtras } = useSessionMutations();

  const [rentals, setRentals] = useState<RentalItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [cart, setCart] = useState<{ [id: number]: number }>({});
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

  const updateCart = useCallback((itemId: number, delta: number) => {
    setCart(prev => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [itemId]: next };
    });
  }, []);

  const calculateTotal = () => {
    let total = 0;
    rentals.forEach(r => {
      total += (cart[r.id] || 0) * r.default_price;
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
        .map(r => ({ id: r.id, quantity: cart[r.id], price: r.default_price }));

      await addExtras(sessionId, items, paymentStatus, finalAmountPaid);
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

  const renderItem = useCallback(({ item }: { item: RentalItem }) => (
    <ExtraRentalCard 
      item={item} 
      quantity={cart[item.id] || 0} 
      onUpdateCart={updateCart} 
    />
  ), [cart, updateCart]);

  const keyExtractor = useCallback((item: RentalItem) => item.id.toString(), []);

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
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
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
