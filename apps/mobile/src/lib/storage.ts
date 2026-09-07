import AsyncStorage from '@react-native-async-storage/async-storage';
import { Brief } from '@/types/brief';

const KEY = '@snapbrief/briefs';

export async function getBriefs(): Promise<Brief[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveBrief(brief: Brief) {
  const current = await getBriefs();
  await AsyncStorage.setItem(KEY, JSON.stringify([brief, ...current].slice(0, 30)));
}

export async function clearBriefs() {
  await AsyncStorage.removeItem(KEY);
}
