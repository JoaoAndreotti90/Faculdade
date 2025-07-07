import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Função auxiliar para verificar se estamos na web
const isWeb = Platform.OS === 'web';

export async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    // Usa AsyncStorage na web
    await AsyncStorage.setItem(key, value);
  } else {
    // Usa SecureStore no mobile
    await SecureStore.setItemAsync(key, value);
  }
}

export async function getItem(key: string): Promise<string | null> {
  if (isWeb) {
    // Usa AsyncStorage na web
    return await AsyncStorage.getItem(key);
  } else {
    // Usa SecureStore no mobile
    return await SecureStore.getItemAsync(key);
  }
}

export async function deleteItem(key: string): Promise<void> {
  if (isWeb) {
    // Usa AsyncStorage na web
    await AsyncStorage.removeItem(key);
  } else {
    // Usa SecureStore no mobile
    await SecureStore.deleteItemAsync(key);
  }
}
