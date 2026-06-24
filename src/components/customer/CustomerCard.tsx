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
  remainingTime: string;
  isWarning: boolean;
  isExpired: boolean;
  onEdit: () => void;
  onExtend: () => void;
  onExtras: () => void;
  onFinish: () => void;
}

export default function CustomerCard({
  id,
  customerName,
  peopleCount,
  sessionType,
  paymentStatus,
  remainingTime,
  isWarning,
  isExpired,
  onEdit,
  onExtend,
  onExtras,
  onFinish,
}: CustomerCardProps) {
  const getCardColor = () => {
    if (isExpired) return COLORS.danger;
    if (isWarning) return COLORS.warning;
    return COLORS.primary;
  };

  return (
    <Card style={styles.card} elevation={2}>
      <Card.Content>
        <View style={styles.headerRow}>
          <Text variant="titleLarge" style={styles.name}>{customerName}</Text>
          <View style={[styles.timeBadge, { backgroundColor: getCardColor() }]}>
            <Text style={styles.timeText}>{remainingTime}</Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <Chip icon="account-group" compact style={styles.chip}>{peopleCount} pax</Chip>
          <Chip icon="clock-outline" compact style={styles.chip}>
            {sessionType.replace('_', ' ')}
          </Chip>
          <Chip icon="cash" compact style={[styles.chip, paymentStatus === 'UNPAID' ? styles.unpaidChip : null]}>
            {paymentStatus}
          </Chip>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.actionsRow}>
          <Button icon="pencil" mode="text" compact onPress={onEdit}>Edit</Button>
          <Button icon="clock-plus" mode="text" compact onPress={onExtend}>Extend</Button>
          <Button icon="plus-box" mode="text" compact onPress={onExtras}>Extras</Button>
          <Button icon="check-circle" mode="contained" buttonColor={COLORS.success} compact onPress={onFinish}>
            Finish
          </Button>
        </View>
      </Card.Content>
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
