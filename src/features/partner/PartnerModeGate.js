// src/features/partner/PartnerModeGate.js
/**
 * Role selection + setup screens.
 * - If already paired → shows connected state + Disconnect
 * - Else → choose HIM/HER → render respective setup screen
 */

import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { usePartnerState } from '@/features/partner/hooks/usePartnerState';
import PartnerSetupHim from '@/features/partner/PartnerSetupHim';
import PartnerSetupHer from '@/features/partner/PartnerSetupHer';

export default function PartnerModeGate({ onReady, children }) {
  const { pairId, role, needsReconnect, disconnect, setRole } = usePartnerState();
  const [screen, setScreen] = useState('select');

  const isPaired = useMemo(() => Boolean(pairId && role), [pairId, role]);

  if (isPaired) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Partner Mode</Text>
        <Text style={styles.subtitle}>Connected</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{role}</Text>
          <Text style={[styles.label, { marginTop: 12 }]}>Pair ID</Text>
          <Text style={styles.valueMono}>{(pairId || '').slice(0, 8)}…</Text>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, styles.secondary]} onPress={disconnect}>
            <Text style={styles.btnTextSecondary}>Disconnect</Text>
          </TouchableOpacity>
          {children ? (
            <View style={{ flex: 1, marginLeft: 8 }}>{children}</View>
          ) : null}
        </View>
      </View>
    );
  }

  // Not paired yet → choose role or show setup screen
  if (screen === 'him') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Partner Mode</Text>
        <Text style={styles.subtitle}>Share a code (HIM)</Text>
        <PartnerSetupHim
          onBack={() => setScreen('select')}
          onDone={() => {
            // HIM never persists pairId here; HER will connect + persist.
          }}
        />
      </View>
    );
  }

  if (screen === 'her') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Partner Mode</Text>
        <Text style={styles.subtitle}>Enter or scan code (HER)</Text>
        <PartnerSetupHer
          onBack={() => setScreen('select')}
          onConnected={() => {
            onReady?.();
          }}
          beforePersistRole={async () => {
            // Persist HER role right before storing pairId
            await setRole('HER');
          }}
        />
      </View>
    );
  }

  // Role selection
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Partner Mode</Text>
      <Text style={styles.subtitle}>Choose your role</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, styles.primary]}
          onPress={() => {
            setRole('HIM');
            setScreen('him');
          }}
        >
          <Text style={styles.btnTextPrimary}>I’ll share a code (HIM)</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, styles.primaryOutline]}
          onPress={() => setScreen('her')}
        >
          <Text style={styles.btnTextPrimaryOutline}>I’ll enter a code (HER)</Text>
        </TouchableOpacity>
      </View>
      {needsReconnect ? (
        <Text style={styles.hint}>No active pairing found. Start a new connection.</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 14, opacity: 0.8 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  card: { padding: 12, borderRadius: 8, backgroundColor: '#1212120F' },
  label: { fontSize: 12, opacity: 0.7 },
  value: { fontSize: 16, fontWeight: '600' },
  valueMono: { fontFamily: 'Courier', fontSize: 14 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: '#2563EB' },
  primaryOutline: { borderColor: '#2563EB', borderWidth: 1 },
  secondary: { backgroundColor: '#ef4444' },
  btnTextPrimary: { color: '#fff', fontWeight: '700' },
  btnTextPrimaryOutline: { color: '#2563EB', fontWeight: '700' },
  btnTextSecondary: { color: '#fff', fontWeight: '700' },
  hint: { marginTop: 12, fontSize: 12, opacity: 0.7 },
});
