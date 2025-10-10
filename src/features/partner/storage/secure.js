// src/features/partner/storage/secure.js
/**
 * Partner Mode secure storage layer.
 * - Prefer Expo SecureStore (device keystore)
 * - Fallback to AsyncStorage when SecureStore unavailable (web/dev)
 *
 * Exposes string + JSON helpers and partner-specific keys.
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PAIR_ID_KEY = 'pm:pairId';
export const ROLE_KEY = 'pm:role';

let cachedSecureAvailable = null;

async function isSecureAvailable() {
  if (cachedSecureAvailable !== null) return cachedSecureAvailable;
  try {
    const ok = await SecureStore.isAvailableAsync();
    cachedSecureAvailable = !!ok;
  } catch {
    cachedSecureAvailable = false;
  }
  return cachedSecureAvailable;
}

export async function getString(key) {
  try {
    if (await isSecureAvailable()) {
      const v = await SecureStore.getItemAsync(key);
      return v ?? null;
    }
    const v = await AsyncStorage.getItem(key);
    return v ?? null;
  } catch (e) {
    console.error('[secure][getString] key:', key, 'error:', e?.message || e);
    return null;
  }
}

export async function setString(key, value) {
  try {
    if (await isSecureAvailable()) {
      await SecureStore.setItemAsync(key, value, {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      });
      return;
    }
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error('[secure][setString] key:', key, 'error:', e?.message || e);
  }
}

export async function deleteKey(key) {
  try {
    if (await isSecureAvailable()) {
      await SecureStore.deleteItemAsync(key);
      return;
    }
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('[secure][deleteKey] key:', key, 'error:', e?.message || e);
  }
}

export async function getJSON(key) {
  const s = await getString(key);
  if (!s) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

export async function setJSON(key, value) {
  try {
    await setString(key, JSON.stringify(value));
  } catch (e) {
    console.error('[secure][setJSON] key:', key, 'error:', e?.message || e);
  }
}

// Partner-specific helpers

export async function loadPairId() {
  return getString(PAIR_ID_KEY);
}

export async function savePairId(pairId) {
  await setString(PAIR_ID_KEY, pairId);
}

export async function clearPairId() {
  await deleteKey(PAIR_ID_KEY);
}

export async function loadRole() {
  const s = await getString(ROLE_KEY);
  if (!s) return null;
  return s === 'HIM' || s === 'HER' ? s : null;
}

export async function saveRole(role) {
  await setString(ROLE_KEY, role);
}

export async function clearRole() {
  await deleteKey(ROLE_KEY);
}

export async function clearAllPartner() {
  await Promise.all([clearPairId(), clearRole()]);
}
