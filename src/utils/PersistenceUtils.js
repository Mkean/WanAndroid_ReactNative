import AsyncStorage from '@react-native-async-storage/async-storage';
import {isEmpty} from './utils';

export async function loadData(key) {
  try {
    const item = await AsyncStorage.getItem(key);
    if (!isEmpty(item)) {
      return JSON.parse(item);
    }
    return null;
  } catch {
    return null;
  }
}

export async function storeData(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export async function removeItem(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch {}
}

export async function clear() {
  try {
    await AsyncStorage.clear();
  } catch {}
}
