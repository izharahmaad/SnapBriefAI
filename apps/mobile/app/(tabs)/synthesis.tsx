import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';

export default function SynthesisScreen() {
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>02 / SYNTHESIS</Text>
          <Text style={styles.title}>Synthesis</Text>
          <Text style={styles.subtitle}>
            Review and understand your generated briefs.
          </Text>
        </View>

        <View style={styles.icon}>
          <Ionicons
            name="sparkles-outline"
            size={19}
            color={colors.accent}
          />
        </View>
      </View>

      <View style={styles.empty}>
        <View style={styles.emptyIcon}>
          <Ionicons
            name="layers-outline"
            size={24}
            color={colors.accent}
          />
        </View>

        <Text style={styles.emptyTitle}>
          Your synthesis space
        </Text>

        <Text style={styles.emptyText}>
          Generated briefs will appear here as you work.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  eyebrow: {
    color: colors.accentSoft,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  title: {
    color: colors.white,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginTop: 5,
  },

  subtitle: {
    color: colors.dim,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
    maxWidth: 280,
  },

  icon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(45, 225, 214, 0.12)',
  },

  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
    paddingHorizontal: spacing.xl,
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.06)',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },

  emptyTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '800',
  },

  emptyText: {
    color: colors.dim,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 6,
  },
});