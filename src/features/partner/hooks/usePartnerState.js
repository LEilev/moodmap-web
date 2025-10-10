// src/features/partner/hooks/usePartnerState.js
/**
 * Centralized device-side partner state.
 * - Loads/saves pairId + role via secure storage
 * - disconnect() → POST /api/partner-unlink → clear storage regardless of outcome
 * - Computes needsReconnect for UI gating
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  loadPairId,
  savePairId,
  clearPairId,
  loadRole,
  saveRole,
  clearRole,
  clearAllPartner,
} from '@/features/partner/storage/secure';

const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  '';

function apiUrl(path) {
  if (API_BASE) return `${API_BASE}${path}`;
  return path; // same-origin
}

export function usePartnerState() {
  const [pairId, setPairIdState] = useState(null);
  const [role, setRoleState] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  // initial load
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [pid, r] = await Promise.all([loadPairId(), loadRole()]);
        if (!active) return;
        setPairIdState(pid);
        setRoleState(r);
      } catch (e) {
        console.error('[partnerState] load error:', e?.message || e);
        if (!active) return;
        setError('Failed to load partner state');
        setStatus('error');
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const setRole = useCallback(async (r) => {
    await saveRole(r);
    setRoleState(r);
  }, []);

  const setPairId = useCallback(async (pid) => {
    await savePairId(pid);
    setPairIdState(pid);
  }, []);

  const setPairAndRole = useCallback(async (pid, r) => {
    await Promise.all([savePairId(pid), saveRole(r)]);
    setPairIdState(pid);
    setRoleState(r);
  }, []);

  const disconnect = useCallback(async () => {
    const pid = pairId;
    setStatus('loading');
    try {
      if (pid) {
        const res = await fetch(apiUrl('/api/partner-unlink'), {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ pairId: pid }),
        });
        let body = {};
        try {
          body = await res.json();
        } catch {
          // ignore json parse error; some proxies strip bodies on 204/304
        }
        if (!res.ok && res.status !== 403) {
          const retryAfter = res.headers.get('retry-after');
          console.warn('[partner-disconnect] non-OK unlink', {
            status: res.status,
            retryAfter,
            body,
          });
        } else {
          console.log('[partner-disconnect] unlink ok', body);
        }
      }
    } catch (e) {
      console.error('[partner-disconnect] network error:', e?.message || e);
    } finally {
      await clearAllPartner();
      setPairIdState(null);
      setRoleState(null);
      setStatus('idle');
    }
  }, [pairId]);

  const needsReconnect = useMemo(() => {
    return !pairId || !role;
  }, [pairId, role]);

  return {
    pairId,
    role,
    status,
    error,
    needsReconnect,
    setRole,
    setPairId,
    setPairAndRole,
    disconnect,
  };
}
