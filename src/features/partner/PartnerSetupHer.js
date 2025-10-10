// src/features/partner/PartnerSetupHer.js
/**
 * HER setup screen:
 * - Enter or scan the one-time code
 * - POST /api/partner-connect
 * - On success: persist { pairId, role: 'HER' } via usePartnerState
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { usePartnerState } from '@/features/partner/hooks/usePartnerState';

const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  '';

function apiUrl(path) {
  if (API_BASE) return `${API_BASE}${path}`;
  return path;
}

const CODE_REGEX = /^[A-HJ-NP-Z2-9]{10,12}$/;

export default function PartnerSetupHer({ onBack, onConnected, beforePersistRole }) {
  const { setPairAndRole } = usePartnerState();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [scanMode, setScanMode] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    if (!scanMode) return;
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, [scanMode]);

  const parseScanned = useCallback((raw) => {
    // Accept raw code or URL with ?code= param
    try {
      const m = raw.match(/[A-HJ-NP-Z2-9]{10,12}/);
      if (m) return m[0].toUpperCase();
      const u = new URL(raw);
      const c = u.searchParams.get('code');
      if (c && CODE_REGEX.test(c.toUpperCase())) return c.toUpperCase();
    } catch {
      // not a URL or no code param
    }
    return null;
  }, []);

  const doConnect = useCallback(async () => {
    setLoading(true);
    setErr('');
    Keyboard.dismiss();
    try {
      const body = { code: code.trim().toUpperCase() };
      if (!CODE_REGEX.test(body.code)) {
        setErr('Invalid code format');
        setLoading(false);
        return;
      }

      console.log('[setup-her] POST /partner-connect', body.code);
      const res = await fetch(apiUrl('/api/partner-connect'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });

      const retryAfter = res.headers.get('retry-after');
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 400) {
          setErr('Invalid or expired code. Ask partner to generate a new one.');
        } else if (res.status === 429) {
          setErr(`Too many attempts. Try again in ${retryAfter ?? 'a few'} seconds.`);
        } else {
          setErr(data?.error || 'Failed to connect');
        }
        setLoading(false);
        return;
      }

      const pairId = data?.pairId;
      if (!pairId || typeof pairId !== 'string') {
        setErr('Malformed server response');
        setLoading(false);
        return;
      }

      // Persist HER role before pairId (per spec)
      try {
        await beforePersistRole?.();
      } catch (e) {
        console.warn('[setup-her] beforePersistRole error:', e?.message || e);
      }

      await setPairAndRole(pairId, 'HER');
      console.log('[setup-her] Connected, pairId', pairId);

      onConnected?.();
    } catch (e) {
      console.error('[setup-her] network error:', e?.message || e);
      setErr('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [code, beforePersistRole, setPairAndRole, onConnected]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity style={[styles.btn, styles.secondary]} onPress={onBack}>
            <Text style={styles.btnTextSecondary}>Back</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={[styles.btn, styles.primaryOutline, { marginLeft: 8 }]}
          onPress={async () => {
            const s = await Clipboard.getStringAsync();
            const candidate = (s || '').trim().toUpperCase();
            if (CODE_REGEX.test(candidate)) {
              setCode(candidate);
            } else {
              Alert.alert('Clipboard', 'No valid code found in clipboard.');
            }
          }}
        >
          <Text style={styles.btnTextPrimaryOutline}>Paste</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.primary, { marginLeft: 8 }]}
          onPress={() => setScanMode((v) => !v)}
        >
          <Text style={styles.btnTextPrimary}>{scanMode ? 'Stop Scan' : 'Scan QR'}</Text>
        </TouchableOpacity>
      </View>

      {scanMode ? (
        <View style={styles.scanBox}>
          {hasPermission === null ? (
            <ActivityIndicator />
          ) : hasPermission === false ? (
            <Text style={styles.error}>Camera permission not granted.</Text>
          ) : (
            <BarCodeScanner
              onBarCodeScanned={({ data }) => {
                const c = parseScanned(data);
                if (c) {
                  setCode(c);
                  setScanMode(false);
                }
              }}
              style={{ width: '100%', height: 220 }}
            />
          )}
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.label}>Enter code</Text>
        <TextInput
          value={code}
          onChangeText={(t) => setCode(t.trim().toUpperCase())}
          autoCapitalize="characters"
          autoCorrect={false}
          placeholder="ABCD2EFG34"
          style={styles.input}
          maxLength={12}
        />
        {err ? <Text style={styles.error}>{err}</Text> : null}
        <TouchableOpacity
          disabled={loading}
          onPress={doConnect}
          style={[styles.btn, styles.primary, { marginTop: 8, opacity: loading ? 0.7 : 1 }]}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTextPrimary}>Connect</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  card: { padding: 12, borderRadius: 8, backgroundColor: '#1212120F' },
  scanBox: { marginTop: 8, borderRadius: 8, overflow: 'hidden', backgroundColor: '#00000010' },
  label: { fontSize: 12, opacity: 0.7 },
  input: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    fontSize: 18,
    letterSpacing: 2,
    backgroundColor: '#FFFFFF',
  },
  error: { color: '#ef4444', marginTop: 8 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: '#2563EB' },
  primaryOutline: { borderColor: '#2563EB', borderWidth: 1 },
  secondary: { backgroundColor: '#6b7280' },
  btnTextPrimary: { color: '#fff', fontWeight: '700' },
  btnTextPrimaryOutline: { color: '#2563EB', fontWeight: '700' },
  btnTextSecondary: { color: '#fff', fontWeight: '700' },
});
