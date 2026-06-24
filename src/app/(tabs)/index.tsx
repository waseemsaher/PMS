import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, FAB, ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { useCustomerStore } from '../../stores/CustomerStore';
import { useSettingsStore } from '../../stores/SettingsStore';
import CustomerCard from '../../components/customer/CustomerCard';
import { SessionService } from '../../services/SessionService';

export default function HomeScreen() {
  const { activeSessions, isLoading, loadActiveSessions, tickTimers } = useCustomerStore();
  const { settings } = useSettingsStore();

  useEffect(() => {
    loadActiveSessions();
    
    // Timer Engine: Tick every second to update UI
    const interval = setInterval(() => {
      // Use 5 as fallback if settings haven't loaded
      const warningMinutes = settings?.warning_minutes || 5;
      tickTimers(warningMinutes);
    }, 1000);

    return () => clearInterval(interval);
  }, [loadActiveSessions, tickTimers, settings]);

  const handleFinish = (sessionId: number, customerName: string) => {
    Alert.alert(
      'Finish Session?',
      `Are you sure you want to finish ${customerName}'s session?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Finish', 
          onPress: async () => {
            try {
              await SessionService.finishSession(sessionId);
              await loadActiveSessions();
            } catch (err) {
              Alert.alert('Error', 'Could not finish session');
            }
          }
        },
      ]
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text variant="bodyLarge" style={styles.emptyText}>No Active Customers</Text>
      <Text variant="bodyMedium" style={styles.emptySubText}>Press + to add one.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 
        Sprint 7 will introduce Summary Cards here (Active, Expired, Less than 5 Mins) 
        and Search Bar at the top.
      */}

      {isLoading && activeSessions.length === 0 ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={activeSessions}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          renderItem={({ item }) => (
            <CustomerCard
              id={item.id}
              customerName={item.customer_name}
              peopleCount={item.people_count}
              sessionType={item.session_type}
              paymentStatus={item.payment_status}
              remainingTime={item.timerDisplay}
              isWarning={item.isWarning}
              isExpired={item.isExpired}
              onEdit={() => router.push({ pathname: '/edit-customer', params: { id: item.id } })}
              onExtend={() => {
                if (item.is_open_session) {
                  Alert.alert('Open Session', 'Open sessions cannot be extended. They run indefinitely until finished.');
                  return;
                }
                Alert.alert(
                  'Extend Session',
                  `How much time to add for ${item.customer_name}?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: '+ 30 Mins', 
                      onPress: async () => {
                        try {
                          await SessionService.extendSession(item.id, 30);
                          await loadActiveSessions();
                        } catch (e: any) { Alert.alert('Error', e.message); }
                      } 
                    },
                    { 
                      text: '+ 1 Hour', 
                      onPress: async () => {
                        try {
                          await SessionService.extendSession(item.id, 60);
                          await loadActiveSessions();
                        } catch (e: any) { Alert.alert('Error', e.message); }
                      } 
                    },
                  ]
                );
              }}
              onExtras={() => router.push({ pathname: '/add-extra', params: { id: item.id } })}
              onFinish={() => handleFinish(item.id, item.customer_name)}
            />
          )}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        color="#fff"
        onPress={() => router.push('/add-customer')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 80, // FAB clearance
  },
  loader: {
    marginTop: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  emptySubText: {
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
  },
});
