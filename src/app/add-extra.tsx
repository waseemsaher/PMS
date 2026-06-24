import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, Button, ActivityIndicator, IconButton } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { COLORS } from '../constants/colors';
import { RentalRepository } from '../database/repositories/RentalRepository';
import { SessionService } from '../services/SessionService';
import { RentalItem } from '../models/types';
import { useCustomerStore } from '../stores/CustomerStore';

export default function AddExtraScreen() {
  const { id } = useLocalSearchParams();
  const sessionId = parseInt(id as string, 10);
  const { loadActiveSessions } = useCustomerStore();

  const [rentals, setRentals] = useState<RentalItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);

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

  const handleAdd = async (rental: RentalItem) => {
    setAddingId(rental.id);
    try {
      await SessionService.addRentalToSession(sessionId, rental.id, 1, rental.default_price);
      await loadActiveSessions();
      Alert.alert('Success', `Added 1 ${rental.name} for ${rental.default_price} EGP`, [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message);
      setAddingId(null);
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
      <Text variant="titleMedium" style={styles.title}>Select an item to add to the session:</Text>
      
      <FlatList
        data={rentals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card} mode="outlined">
            <Card.Title
              title={item.name}
              subtitle={`${item.default_price} EGP`}
              right={(props) => (
                <Button 
                  mode="contained" 
                  onPress={() => handleAdd(item)}
                  loading={addingId === item.id}
                  disabled={addingId !== null}
                  style={styles.addButton}
                >
                  Add
                </Button>
              )}
            />
          </Card>
        )}
      />
      <Button mode="text" onPress={() => router.back()} style={styles.cancelButton}>
        Cancel
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
    color: COLORS.textSecondary,
  },
  card: {
    marginBottom: 12,
    backgroundColor: COLORS.surface,
  },
  addButton: {
    marginRight: 16,
  },
  cancelButton: {
    marginTop: 16,
  },
});
