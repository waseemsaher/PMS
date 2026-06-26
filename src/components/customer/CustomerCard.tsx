import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip, Button, Divider } from 'react-native-paper';
import { COLORS } from '../../constants/colors';

import { SessionRental } from '../../models/types';
import { useSessionTimer } from '../../hooks/useSessionTimer';

export interface CustomerCardProps {
  id: number;
  customerName: string;
  peopleCount: number;
  sessionType: string;
  paymentStatus: string;
  isOpenSession: boolean;
  warningMinutes: number;
  isWarning: boolean;
  isExpired: boolean;
  startTimestamp: number;
  endTimestamp: number | null;
  rentals?: (SessionRental & { name: string })[];
  onEdit: (id: number) => void;
  onExtend: (id: number, customerName: string, isOpen: boolean) => void;
  onExtras: (id: number) => void;
  onFinish: (id: number, customerName: string) => void;
}

const CustomerCard = ({
  id,
  customerName,
  peopleCount,
  sessionType,
  paymentStatus,
  isOpenSession,
  warningMinutes,
  isWarning,
  isExpired,
  startTimestamp,
  endTimestamp,
  rentals = [],
  onEdit,
  onExtend,
  onExtras,
  onFinish,
}: CustomerCardProps) => {
  const timerDisplay = useSessionTimer(startTimestamp, endTimestamp, isOpenSession, warningMinutes);

  const getCardColor = () => {
    if (isExpired) return COLORS.danger;
    if (isWarning) return COLORS.warning;
    return COLORS.primary;
  };

  const aggregatedRentals = rentals.reduce((acc, current) => {
    const existing = acc.find(item => item.name === current.name);
    if (existing) {
      existing.quantity += current.quantity;
    } else {
      acc.push({ ...current });
    }
    return acc;
  }, [] as typeof rentals);

  // Import dayjs at the top if not already imported? Wait, let's just format it carefully or import dayjs.
  // Actually, I should use `new Date(startTimestamp * 1000)` to format the time instead of importing dayjs to be safe.
  const formatTime = (ts: number) => {
    const d = new Date(ts * 1000);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const startStr = formatTime(startTimestamp);
  const endStr = endTimestamp ? formatTime(endTimestamp) : 'N/A';

  return (
    <Card style={[styles.card, isExpired && styles.cardExpired]} elevation={2}>
      <Card.Content>
        <View style={styles.headerRow}>
          <Text variant="titleLarge" style={styles.name}>{customerName}</Text>
          <View style={[styles.timeBadge, { backgroundColor: getCardColor() }]}>
            <Text style={styles.timeText}>{timerDisplay}</Text>
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

        <Text style={styles.metaText}>
          Started: {startStr} | Ending: {endStr}
        </Text>

        {aggregatedRentals.length > 0 && (
          <View style={styles.rentalsContainer}>
            <Text style={styles.rentalsTitle}>Extras:</Text>
            {aggregatedRentals.map((r, i) => (
              <Text key={i} style={styles.rentalItem}>
                • {r.quantity}x {r.name}
              </Text>
            ))}
          </View>
        )}

        <Divider style={styles.divider} />

        <View style={styles.actionsRow}>
          <Button icon="pencil" mode="text" compact onPress={() => onEdit(id)}>Edit</Button>
          <Button icon="clock-plus" mode="text" compact onPress={() => onExtend(id, customerName, isOpenSession)}>Extend</Button>
          <Button icon="plus-box" mode="text" compact onPress={() => onExtras(id)}>Extras</Button>
          <Button icon="check-circle" mode="contained" buttonColor={COLORS.success} compact onPress={() => onFinish(id, customerName)}>
            Finish
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

export default React.memo(CustomerCard);

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
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
    fontFamily: 'monospace',
  }
});
