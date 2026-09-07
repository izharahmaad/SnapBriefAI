import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassCard } from '@/components/GlassCard';
import { clearBriefs, getBriefs } from '@/lib/storage';
import { colors, radius } from '@/theme';
import { Brief } from '@/types/brief';

export default function History() {
  const [items, setItems] = useState<Brief[]>([]);
  useFocusEffect(useCallback(() => { getBriefs().then(setItems); }, []));

  const clear = () => Alert.alert('Clear history?', 'This removes locally saved briefs.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Clear', style: 'destructive', onPress: async () => { await clearBriefs(); setItems([]); } },
  ]);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View><Text style={styles.kicker}>YOUR WORKSPACE</Text><Text style={styles.title}>History</Text></View>
        {items.length ? <Pressable onPress={clear}><Text style={styles.clear}>Clear all</Text></Pressable> : null}
      </View>

      {items.length === 0 ? (
        <GlassCard style={styles.empty}>
          <View style={styles.emptyIcon}><Ionicons name="time-outline" size={22} color={colors.accent} /></View>
          <Text style={styles.emptyTitle}>Nothing here yet</Text>
          <Text style={styles.emptyText}>Your generated briefs will appear here so you can come back to them later.</Text>
        </GlassCard>
      ) : items.map((item) => (
        <GlassCard key={item.id} style={styles.item}>
          <View style={styles.row}><Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text><Text style={styles.priority}>{item.priority}</Text></View>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text numberOfLines={2} style={styles.summary}>{item.summary}</Text>
          <View style={styles.meta}><Text style={styles.metaText}>{item.key_points.length} key points</Text><Text style={styles.metaDot}>•</Text><Text style={styles.metaText}>{item.actions.length} actions</Text></View>
        </GlassCard>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 58, paddingBottom: 120, gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 },
  kicker: { color: colors.accent, fontSize: 10, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: 1.6 },
  title: { color: colors.text, fontSize: 31, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: -1, marginTop: 3 },
  clear: { color: colors.muted, fontSize: 12, fontFamily: 'SpaceGrotesk_600SemiBold', paddingBottom: 3 },
  empty: { alignItems: 'center', padding: 34, marginTop: 14 },
  emptyIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: '#1A2010', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  emptyTitle: { color: colors.text, fontSize: 17, fontFamily: 'SpaceGrotesk_700Bold' },
  emptyText: { color: colors.muted, textAlign: 'center', fontSize: 12, lineHeight: 18, marginTop: 6, maxWidth: 280 },
  item: { padding: 17, gap: 9 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { color: colors.dim, fontSize: 10, fontFamily: 'SpaceGrotesk_600SemiBold' },
  priority: { color: colors.accent, fontSize: 9, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: 0.9 },
  itemTitle: { color: colors.text, fontSize: 18, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: -0.2 },
  summary: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 2 },
  metaText: { color: colors.dim, fontSize: 10, fontFamily: 'SpaceGrotesk_600SemiBold' },
  metaDot: { color: colors.dim, fontSize: 10 },
});
