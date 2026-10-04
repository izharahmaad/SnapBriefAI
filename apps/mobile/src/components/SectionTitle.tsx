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
        <Text style={styles.eyebrow}>
          {eyebrow}
        </Text>

        <View style={styles.eyebrowLine} />
      </View>

      <Text
        style={styles.title}
        numberOfLines={2}
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    gap: 5,
  },

  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 10,
  },

  eyebrow: {
    color: colors.accent,
    fontSize: 7,
    lineHeight: 9,
    fontWeight: '900',
    letterSpacing: 1.35,
    textTransform: 'uppercase',
  },

  eyebrowLine: {
    width: 18,
    height: 1,
    marginLeft: 7,
    backgroundColor: 'rgba(45, 225, 214, 0.28)',
  },

  title: {
    color: colors.white,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '900',
    letterSpacing: -0.55,
  },
});