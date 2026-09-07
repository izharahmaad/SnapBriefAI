import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '@/components/GlassCard';
import { colors } from '@/theme';

const rows = [
  ['sparkles-outline', 'AI processing', 'Structured briefs via your FastAPI service'],
  ['shield-checkmark-outline', 'Privacy', 'Brief history stays on the device'],
  ['code-slash-outline', 'Built with', 'Expo · React Native · TypeScript · Python'],
];

export default function Settings() {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>PREFERENCES</Text>
      <Text style={styles.title}>Settings</Text>
      <GlassCard style={styles.card}>
        {rows.map(([icon, title, subtitle], index) => (
          <View key={title} style={[styles.row, index < rows.length - 1 && styles.rowBorder]}>
            <View style={styles.icon}><Ionicons name={icon as any} size={18} color={colors.accent} /></View>
            <View style={styles.body}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.rowText}>{subtitle}</Text></View>
          </View>
        ))}
      </GlassCard>
      <View style={styles.about}><Text style={styles.aboutTitle}>SnapBrief AI</Text><Text style={styles.aboutText}>A focused portfolio project for turning unstructured thoughts into actionable briefs.</Text><Text style={styles.version}>v1.0.0</Text></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 58, paddingBottom: 120 },
  kicker: { color: colors.accent, fontSize: 10, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: 1.6 },
  title: { color: colors.text, fontSize: 31, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: -1, marginTop: 3, marginBottom: 24 },
  card: { paddingHorizontal: 17 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 17 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  icon: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#1A2010', alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, gap: 2 },
  rowTitle: { color: colors.text, fontSize: 13, fontFamily: 'SpaceGrotesk_700Bold' },
  rowText: { color: colors.muted, fontSize: 11, lineHeight: 17 },
  about: { marginTop: 28, paddingHorizontal: 3 },
  aboutTitle: { color: colors.text, fontSize: 13, fontFamily: 'SpaceGrotesk_700Bold' },
  aboutText: { color: colors.dim, fontSize: 11, lineHeight: 17, marginTop: 4 },
  version: { color: colors.dim, fontSize: 10, marginTop: 12, fontFamily: 'SpaceGrotesk_600SemiBold' },
});
