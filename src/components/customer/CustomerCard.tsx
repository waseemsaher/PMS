import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Badge, IconButton, useTheme } from 'react-native-paper';
import { COLORS } from '../../constants/colors';

export interface CustomerCardProps {
  id: number;
  customerName: string;
  peopleCount: number;
  sessionType: string;
  paymentStatus: string;
  remainingTime: string; // Temporarily a string, Sprint 5 will introduce actual dynamic timer
  isWarning: boolean;
  isExpired: boolean;
  onEdit: () => void;
  onExtend: () => void;
  onFinish: () => void;
}

export default function CustomerCard({
  customerName,
  peopleCount,
  sessionType,
  paymentStatus,
  remainingTime,
  isWarning,
  isExpired,
  onEdit,
  onExtend,
  onFinish,
}: CustomerCardProps) {
  const theme = useTheme();

  // Determine card background color based on status
  let backgroundColor = COLORS.surface;
  if (isExpired) backgroundColor = COLORS.danger + '20'; // Light red
  else if (isWarning) backgroundColor = COLORS.warning + '30'; // Light yellow

  return (
    <Card style={[styles.card, { backgroundColor }]} elevation={1}>
      <Card.Content>
        <View style={styles.headerRow}>
          <Text variant="titleLarge" style={styles.name}>{customerName}</Text>
          <Badge size={24} style={styles.peopleBadge}>👥 {peopleCount}</Badge>
        </View>

        <View style={styles.detailsRow}>
          <Text variant="bodyMedium">Type: {sessionType}</Text>
          <Text variant="bodyMedium">Payment: {paymentStatus}</Text>
        </View>

        <View style={styles.timerRow}>
          <Text variant="headlineMedium" style={[
            styles.timer,
            isExpired ? { color: COLORS.danger } : isWarning ? { color: '#b45309' } : { color: COLORS.primary }
          ]}>
            ⏱ {remainingTime}
          </Text>
        </View>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <IconButton icon="pencil" mode="contained-tonal" size={20} onPress={onEdit} />
        <IconButton icon="clock-plus-outline" mode="contained-tonal" size={20} onPress={onExtend} />
        <IconButton icon="check-circle" mode="contained" size={20} iconColor="#fff" containerColor={COLORS.success} onPress={onFinish} />
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
  peopleBadge: {
    backgroundColor: COLORS.background,
    color: COLORS.text,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timerRow: {
    alignItems: 'center',
    marginVertical: 8,
  },
  timer: {
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  actions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});
