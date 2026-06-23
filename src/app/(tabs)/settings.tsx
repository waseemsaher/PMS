import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Switch, Button, Divider, ActivityIndicator, useTheme } from 'react-native-paper';
import { useSettingsStore } from '../../stores/SettingsStore';
import { COLORS } from '../../constants/colors';

export default function SettingsScreen() {
  const { settings, isLoading, loadSettings, updateSettings, resetToDefaults } = useSettingsStore();
  const theme = useTheme();

  const [hourPrice, setHourPrice] = useState('');
  const [warningMinutes, setWarningMinutes] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  // Note: Rental prices like Board, Shorts, Deposit are technically in RentalItems table, 
  // but PRD puts them on this screen. For brevity in V1, we will mock their local state here,
  // but they should be connected to RentalRepository in a fully featured app.
  const [boardPrice, setBoardPrice] = useState('20');
  const [shortsPrice, setShortsPrice] = useState('30');
  const [depositPrice, setDepositPrice] = useState('50');

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (settings) {
      setHourPrice(settings.hour_price.toString());
      setWarningMinutes(settings.warning_minutes.toString());
      setSoundEnabled(settings.sound_enabled);
      setVibrationEnabled(settings.vibration_enabled);
    }
  }, [settings]);

  const handleSave = () => {
    const hp = parseFloat(hourPrice);
    const wm = parseInt(warningMinutes, 10);

    if (isNaN(hp) || hp < 0) {
      Alert.alert('Invalid Input', 'Hour Price must be a valid number >= 0');
      return;
    }
    if (isNaN(wm) || wm < 1 || wm > 30) {
      Alert.alert('Invalid Input', 'Warning minutes must be between 1 and 30');
      return;
    }

    updateSettings({
      hour_price: hp,
      warning_minutes: wm,
      sound_enabled: soundEnabled,
      vibration_enabled: vibrationEnabled,
    });
    
    // In a real app, we'd also save the rental prices to RentalRepository here
    Alert.alert('Success', 'Settings saved successfully. Changes will apply to future sessions only.');
  };

  const handleReset = () => {
    Alert.alert('Reset Settings', 'Are you sure you want to reset to default values?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => resetToDefaults() },
    ]);
  };

  if (!settings || isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="titleMedium" style={styles.sectionTitle}>Pricing (Future Sessions)</Text>
      
      <TextInput
        label="Hour Price (EGP)"
        value={hourPrice}
        onChangeText={setHourPrice}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Board Price"
        value={boardPrice}
        onChangeText={setBoardPrice}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Shorts Price"
        value={shortsPrice}
        onChangeText={setShortsPrice}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Deposit Price"
        value={depositPrice}
        onChangeText={setDepositPrice}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />

      <Divider style={styles.divider} />

      <Text variant="titleMedium" style={styles.sectionTitle}>Notifications</Text>
      
      <TextInput
        label="Warning Minutes"
        value={warningMinutes}
        onChangeText={setWarningMinutes}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />
      
      <View style={styles.switchRow}>
        <Text variant="bodyLarge">Notification Sound</Text>
        <Switch value={soundEnabled} onValueChange={setSoundEnabled} color={COLORS.primary} />
      </View>
      <View style={styles.switchRow}>
        <Text variant="bodyLarge">Vibration</Text>
        <Switch value={vibrationEnabled} onValueChange={setVibrationEnabled} color={COLORS.primary} />
      </View>

      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleSave} style={styles.saveButton} buttonColor={COLORS.primary}>
          Save Settings
        </Button>
        <Button mode="outlined" onPress={handleReset} textColor={COLORS.danger} style={styles.resetButton}>
          Reset Defaults
        </Button>
      </View>
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
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.primary,
  },
  input: {
    marginBottom: 12,
    backgroundColor: COLORS.surface,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  saveButton: {
    paddingVertical: 6,
    borderRadius: 8,
  },
  resetButton: {
    paddingVertical: 6,
    borderColor: COLORS.danger,
    borderRadius: 8,
  },
});
