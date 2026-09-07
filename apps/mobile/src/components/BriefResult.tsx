import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Brief } from '@/types/brief';
import { colors, radius, spacing } from '@/theme';
import { Chip } from './Chip';
import { GlassCard } from './GlassCard';

export function BriefResult({ brief }: { brief: Brief }) {
  return (
    <GlassCard style={styles.wrap}>
      <View style={styles.topRow}>
        <View style={styles.aiBadge}>
          <Ionicons name="sparkles" size={13} color={colors.bg} />
          <Text style={styles.aiBadgeText}>AI BRIEF</Text>
        </View>
        <View style={styles.priority}>
          <View style={styles.dot} />
          <Text style={styles.priorityText}>{brief.priority.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.title}>{brief.title}</Text>
      <Text style={styles.summary}>{brief.summary}</Text>

      <View style={styles.divider} />

      <View style={styles.section}>
        <View style={styles.headingRow}>
          <Ionicons name="list-outline" size={16} color={colors.accent} />
          <Text style={styles.heading}>Key points</Text>
        </View>
        {brief.key_points.map((point, index) => (
          <View style={styles.item} key={`${point}-${index}`}>
            <View style={styles.bullet} />
            <Text style={styles.itemText}>{point}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.headingRow}>
          <Ionicons name="arrow-forward-circle-outline" size={16} color={colors.accent} />
          <Text style={styles.heading}>Next actions</Text>
        </View>
        {brief.actions.map((action, index) => (
          <View style={styles.action} key={`${action}-${index}`}>
            <View style={styles.check}><Ionicons name="checkmark" size={12} color={colors.bg} /></View>
            <Text style={styles.itemText}>{action}</Text>
          </View>
        ))}
      </View>

      <View style={styles.tagsWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {brief.tags.map((tag) => <Chip key={tag} text={tag} />)}
          {brief.due_date ? <Chip text={`due ${brief.due_date}`} /> : null}
        </ScrollView>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing.xl, gap: 15 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.accent, paddingHorizontal: 9, paddingVertical: 6, borderRadius: radius.pill },
  aiBadgeText: { color: colors.bg, fontSize: 9, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: 1 },
  priority: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 6, backgroundColor: colors.accent },
  priorityText: { color: colors.muted, fontSize: 10, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: 1 },
  title: { color: colors.text, fontSize: 27, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: -0.7 },
  summary: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  divider: { height: 1, backgroundColor: colors.border },
  section: { gap: 11 },
  headingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heading: { color: colors.text, fontSize: 13, fontFamily: 'SpaceGrotesk_700Bold' },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bullet: { width: 5, height: 5, borderRadius: 5, backgroundColor: colors.accent, marginTop: 7 },
  itemText: { flex: 1, color: '#C4C9CC', fontSize: 13, lineHeight: 19 },
  action: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  check: { width: 19, height: 19, borderRadius: 10, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  tagsWrap: { marginTop: 2 },
});
