import AsyncStorage from '@react-native-async-storage/async-storage';

import { Brief } from '@/types/brief';

const KEY = '@snapbrief/briefs';
const MAX_BRIEFS = 30;

export async function getBriefs(): Promise<Brief[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? (parsed as Brief[]) : [];
  } catch {
    return [];
  }
}

export async function saveBrief(brief: Brief): Promise<void> {
  try {
    const current = await getBriefs();

    const updated = [brief, ...current]
      .filter(
        (item, index, items) =>
          index === items.findIndex((entry) => entry.id === item.id)
      )
      .slice(0, MAX_BRIEFS);

    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Could not save your brief: ${error.message}`
        : 'Could not save your brief.'
    );
  }
}

export async function clearBriefs(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Could not clear your saved briefs: ${error.message}`
        : 'Could not clear your saved briefs.'
    );
  }
}