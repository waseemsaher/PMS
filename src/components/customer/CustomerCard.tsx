import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip, Button, Divider } from 'react-native-paper';
import { COLORS } from '../../constants/colors';

import { SessionRental } from '../../models/types';

export interface CustomerCardProps {
  id: number;
  customerName: string;
  peopleCount: number;
  sessionType: string;
  paymentStatus: string;
  remainingTime: string;
  isWarning: boolean;
  isExpired: boolean;
  rentals?: (SessionRental & { name: string })[];
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
  rentals = [],
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
    <Card style={[styles.card, isExpired && styles.cardExpired]} elevation={2}>
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

        {rentals.length > 0 && (
          <View style={styles.rentalsContainer}>
            <Text style={styles.rentalsTitle}>Extras:</Text>
            {rentals.map((r, i) => (
              <Text key={i} style={styles.rentalItem}>
                • {r.quantity}x {r.name}
              </Text>
            ))}
          </View>
        )}

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
  timeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  timeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: COLORS.background,
  },
  unpaidChip: {
    backgroundColor: COLORS.danger + '20',
  },
  divider: {
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  cardExpired: {
    backgroundColor: COLORS.danger + '10',
    borderColor: COLORS.danger,
    borderWidth: 1,
  },
  rentalsContainer: {
    backgroundColor: COLORS.background,
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
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
  }
});
