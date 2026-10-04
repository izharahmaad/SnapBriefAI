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
        <View style={styles.eyebrowAccent} />

        <Text
          style={styles.eyebrow}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {eyebrow}
        </Text>

        <View style={styles.eyebrowLine} />
      </View>

      <Text
        style={styles.title}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
  },

  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 12,
    marginBottom: 5,
  },

  eyebrowAccent: {
    width: 3,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginRight: 6,
  },

  eyebrow: {
    flexShrink: 0,
    color: colors.accentSoft,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '900',
    letterSpacing: 1.15,
    textTransform: 'uppercase',
  },

  eyebrowLine: {
    flex: 1,
    height: 1,
    marginLeft: 8,
    backgroundColor: 'rgba(45, 225, 214, 0.16)',
  },

  title: {
    color: colors.white,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '900',
    letterSpacing: -0.55,
  },
});