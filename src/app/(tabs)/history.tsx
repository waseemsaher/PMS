import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Searchbar, Card, ActivityIndicator, Chip } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import { useHistoryStore } from '../../stores/HistoryStore';
import dayjs from 'dayjs';

export default function HistoryScreen() {
  const { history, isLoading, searchQuery, setSearchQuery, loadHistory } = useHistoryStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const onRefresh = useCallback(() => {
    loadHistory();
  }, [loadHistory]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text variant="bodyLarge" style={styles.emptyText}>No History Found</Text>
    </View>
  );

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
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <Card style={styles.card} elevation={1}>
              <Card.Content>
                <View style={styles.headerRow}>
                  <Text variant="titleMedium" style={styles.name}>{item.customer_name}</Text>
                  <Text variant="bodySmall" style={styles.date}>
                    {dayjs.unix(item.finish_timestamp).format('DD MMM YYYY, HH:mm')}
                  </Text>
                </View>

                <View style={styles.detailsRow}>
                  <Chip icon="clock-outline" compact style={styles.chip}>{item.actual_duration} mins</Chip>
                  <Chip icon="account-group" compact style={styles.chip}>{item.people_count} pax</Chip>
                  <Chip icon="cash" compact style={[styles.chip, item.payment_status === 'UNPAID' ? styles.unpaidChip : null]}>
                    {item.total_amount} EGP
                  </Chip>
                </View>

                {item.notes ? (
                  <Text variant="bodySmall" style={styles.notes}>Note: {item.notes}</Text>
                ) : null}
              </Card.Content>
            </Card>
          )}
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
});
