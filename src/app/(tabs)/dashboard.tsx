import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, ActivityIndicator, useTheme, Divider } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import { useDashboardStore } from '../../stores/DashboardStore';

export default function DashboardScreen() {
  const { dashboard, isLoading, loadDashboard } = useDashboardStore();

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const onRefresh = useCallback(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (!dashboard && isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const RevenueCard = ({ title, total, hours, extras, subtitle }: { title: string, total: number, hours: number, extras: number, subtitle: string }) => (
    <Card style={styles.card} elevation={1}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.cardTitle}>{title}</Text>
        <Text variant="headlineLarge" style={styles.cardValue}>{total} EGP</Text>
        
        <View style={styles.breakdownRow}>
          <Text variant="bodyMedium" style={styles.breakdownText}>⏱️ {hours} EGP</Text>
          <Text variant="bodyMedium" style={styles.breakdownText}>🩳 {extras} EGP</Text>
        </View>

        <Text variant="bodySmall" style={styles.cardSubtitle}>{subtitle}</Text>
      </Card.Content>
    </Card>
  );

  const DashboardCustomerCard = ({ title, value, subtitle }: { title: string, value: number, subtitle: string }) => (
    <Card style={styles.card} elevation={1}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.cardTitle}>{title}</Text>
        <Text variant="headlineLarge" style={styles.cardValue}>{value}</Text>
        <Text variant="bodySmall" style={styles.cardSubtitle}>{subtitle}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
    >
      <Text variant="headlineSmall" style={styles.sectionTitle}>Revenue 💰</Text>
      <View style={styles.grid}>
        <RevenueCard 
          title="Today" 
          total={dashboard?.today_revenue ?? 0} 
          hours={dashboard?.today_hours_revenue ?? 0}
          extras={dashboard?.today_extras_revenue ?? 0}
          subtitle="Total daily revenue" 
        />
        <RevenueCard 
          title="This Month" 
          total={dashboard?.month_revenue ?? 0} 
          hours={dashboard?.month_hours_revenue ?? 0}
          extras={dashboard?.month_extras_revenue ?? 0}
          subtitle="Total monthly revenue" 
        />
      </View>
      <RevenueCard 
        title="Lifetime Revenue" 
        total={dashboard?.lifetime_revenue ?? 0} 
        hours={dashboard?.lifetime_hours_revenue ?? 0}
        extras={dashboard?.lifetime_extras_revenue ?? 0}
        subtitle="All time revenue" 
      />

      <Divider style={styles.divider} />

      <Text variant="headlineSmall" style={styles.sectionTitle}>Customers 👥</Text>
      <View style={styles.grid}>
        <DashboardCustomerCard title="Today" value={dashboard?.today_customers ?? 0} subtitle="People served today" />
        <DashboardCustomerCard title="This Month" value={dashboard?.month_customers ?? 0} subtitle="People served this month" />
      </View>
      <DashboardCustomerCard title="Lifetime Customers" value={dashboard?.lifetime_customers ?? 0} subtitle="All time customers" />

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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.primary,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    marginBottom: 12,
    borderRadius: 16,
  },
  cardTitle: {
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  cardValue: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  cardSubtitle: {
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    backgroundColor: COLORS.background,
    padding: 8,
    borderRadius: 8,
  },
  breakdownText: {
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  divider: {
    marginVertical: 24,
  },
});
