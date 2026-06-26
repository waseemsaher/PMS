import React, { useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Searchbar, Card, ActivityIndicator, Chip } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import { useHistoryStore } from '../../stores/HistoryStore';
import dayjs from 'dayjs';

const HistoryCard = React.memo(({ item }: { item: any }) => {
  const aggregatedRentals = useMemo(() => {
    if (!item.rentals_json) return [];
    try {
      const rentals = JSON.parse(item.rentals_json);
      return rentals.reduce((acc: any[], current: any) => {
        const existing = acc.find(r => r.name === current.name);
        if (existing) {
          existing.quantity += current.quantity;
        } else {
          acc.push({ ...current });
        }
        return acc;
      }, []);
    } catch (e) {
      return [];
    }
  }, [item.rentals_json]);

  const dateString = useMemo(() => {
    return dayjs.unix(item.finish_timestamp).format('DD MMM YYYY, HH:mm');
  }, [item.finish_timestamp]);

  return (
    <Card style={styles.card} elevation={1}>
      <Card.Content>
        <View style={styles.headerRow}>
          <Text variant="titleMedium" style={styles.name}>{item.customer_name}</Text>
          <Text variant="bodySmall" style={styles.date}>{dateString}</Text>
        </View>

        <View style={styles.detailsRow}>
          <Chip icon="clock-outline" compact style={styles.chip}>{item.actual_duration} mins</Chip>
          <Chip icon="account-group" compact style={styles.chip}>{item.people_count} pax</Chip>
          <Chip icon="information-outline" compact style={styles.chip}>{item.session_type.replace('_', ' ')}</Chip>
          <Chip icon="cash" compact style={[styles.chip, item.payment_status === 'UNPAID' ? styles.unpaidChip : null]}>
            {item.total_amount} EGP
          </Chip>
        </View>

        <View style={styles.breakdownContainer}>
          <Text style={styles.breakdownText}>⏱️ Hours: {item.hours_amount_paid} EGP</Text>
          <Text style={styles.breakdownText}>🩳 Extras: {item.extras_amount_paid} EGP</Text>
        </View>

        {aggregatedRentals.length > 0 && (
          <View style={styles.rentalsContainer}>
            <Text style={styles.rentalsTitle}>Extras Rented:</Text>
            {aggregatedRentals.map((r: any, i: number) => (
              <Text key={i} style={styles.rentalItem}>
                • {r.quantity}x {r.name}
              </Text>
            ))}
          </View>
        )}

        {item.notes ? (
          <Text variant="bodySmall" style={styles.notes}>Note: {item.notes}</Text>
        ) : null}
      </Card.Content>
    </Card>
  );
});

export default function HistoryScreen() {
  const { history, isLoading, searchQuery, setSearchQuery, loadHistory } = useHistoryStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const onRefresh = useCallback(() => {
    loadHistory();
  }, [loadHistory]);

  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text variant="bodyLarge" style={styles.emptyText}>No History Found</Text>
    </View>
  ), []);

  const renderItem = useCallback(({ item }: { item: any }) => (
    <HistoryCard item={item} />
  ), []);

  const keyExtractor = useCallback((item: any) => item.id.toString(), []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search customer name..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
        />
      </View>

      {isLoading && history.length === 0 ? (
        <ActivityIndicator style={styles.loader} color={COLORS.primary} />
      ) : (
        <FlatList
          data={history}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
          renderItem={renderItem}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
  },
  searchbar: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
  },
  searchInput: {
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
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
  card: {
    marginBottom: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
  date: {
    color: COLORS.textSecondary,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: COLORS.background,
  },
  unpaidChip: {
    backgroundColor: COLORS.danger + '20',
  },
  notes: {
    marginTop: 8,
    fontStyle: 'italic',
    color: COLORS.textSecondary,
  },
  breakdownContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
    backgroundColor: COLORS.background,
    padding: 8,
    borderRadius: 8,
  },
  breakdownText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  rentalsContainer: {
    backgroundColor: COLORS.background,
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  rentalsTitle: {
    fontWeight: 'bold',
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  rentalItem: {
    fontSize: 13,
    color: COLORS.text,
  },
});
