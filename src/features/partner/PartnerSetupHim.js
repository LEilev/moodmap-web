// src/features/partner/PartnerSetupHim.js
/**
 * HIM setup screen:
 * - Calls /api/partner-sync to generate a one-time code
 * - Shows code + QR + TTL countdown
 * - Does NOT persist pairId here (HER will connect and persist)
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';

const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  '';

function apiUrl(path) {
  if (API_BASE) return `${API_BASE}${path}`;
  return path;
}

export default function PartnerSetupHim({ onBack }) {
  const [code, setCode] = useState('');
  const [expiresInSec, setExpiresInSec] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const timerRef = useRef(null);

  const fetchCode = async () => {
    setLoading(true);
    setErr('');
    try {
      console.log('[setup-him] requesting /partner-sync');
      const res = await fetch(apiUrl('/api/partner-sync'), { method: 'POST' });
      const retryAfter = res.headers.get('retry-after');
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 429) {
          setErr(`Rate limited. Try again in ${retryAfter ?? 'a few'} seconds.`);
        } else {
          setErr(data?.error || 'Failed to generate code');
        }
        setCode('');
        setExpiresInSec(0);
        setRemaining(0);
        return;
      }

      setCode(data.code);
      setExpiresInSec(Number(data.expiresInSec) || 600);
      setRemaining(Number(data.expiresInSec) || 600);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRemaining((s) => (s > 0 ? s - 1 : 0));
      }, 1000);

      console.log('[setup-him] code', data.code, 'ttl', data.expiresInSec);
    } catch (e) {
      console.error('[setup-him] network error:', e?.message || e);
      setErr('Network error while generating code');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCode();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shareText = useMemo(() => `MoodMap Partner Code: ${code}`, [code]);
  const qrValue = useMemo(() => code, [code]);

  const mmss = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={[styles.btn, styles.secondary]}>
            <Text style={styles.btnTextSecondary}>Back</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={fetchCode} style={[styles.btn, styles.primary, { marginLeft: 8 }]}>
          <Text style={styles.btnTextPrimary}>Generate</Text>
        </TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator /> : null}

      {err ? <Text style={styles.error}>{err}</Text> : null}

      {code ? (
        <View style={styles.card}>
          <Text style={styles.label}>Your code</Text>
          <Text selectable style={styles.code}>{code}</Text>
          <Text style={styles.ttl}>Expires in {mmss(remaining)}</Text>

          <View style={{ alignItems: 'center', marginVertical: 12 }}>
            <QRCode value={qrValue} size={180} />
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.btn, styles.primaryOutline]}
              onPress={async () => {
                await Clipboard.setStringAsync(code);
                Alert.alert('Copied', 'Code copied to clipboard.');
              }}
            >
              <Text style={styles.btnTextPrimaryOutline}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.primary, { marginLeft: 8 }]}
              onPress={async () => {
                try {
                  await Share.share({ message: shareText });
                } catch {}
              }}
            >
              <Text style={styles.btnTextPrimary}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  card: { padding: 12, borderRadius: 8, backgroundColor: '#1212120F' },
  label: { fontSize: 12, opacity: 0.7 },
  code: { fontSize: 28, fontWeight: '800', letterSpacing: 2, marginVertical: 8 },
  ttl: { fontSize: 12, opacity: 0.7 },
  error: { color: '#ef4444' },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: '#2563EB' },
  primaryOutline: { borderColor: '#2563EB', borderWidth: 1 },
  secondary: { backgroundColor: '#6b7280' },
  btnTextPrimary: { color: '#fff', fontWeight: '700' },
  btnTextPrimaryOutline: { color: '#2563EB', fontWeight: '700' },
  btnTextSecondary: { color: '#fff', fontWeight: '700' },
});
