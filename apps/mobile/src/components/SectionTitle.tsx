import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme';

type SectionTitleProps = {
  eyebrow: string;
  title: string;
};

export function SectionTitle({
  eyebrow,
  title,
}: SectionTitleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.eyebrowRow}>
        <View style={styles.dot} />

        <Text style={styles.eyebrow}>
          {eyebrow}
        </Text>
      </View>

      <Text style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },

  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginRight: 7,
  },

  eyebrow: {
    color: colors.accentSoft,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  title: {
    color: colors.white,
    fontSize: 23,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
});