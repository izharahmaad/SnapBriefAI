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
    <View style={styles.wrap}>
      <View style={styles.eyebrowRow}>
        <View style={styles.accentLine} />

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
  wrap: {
    gap: 5,
  },

  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  accentLine: {
    width: 14,
    height: 2,
    borderRadius: 99,
    backgroundColor: colors.accent,
    marginRight: 7,
  },

  eyebrow: {
    color: colors.accentSoft,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  title: {
    color: colors.white,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '800',
    letterSpacing: -0.55,
  },
});