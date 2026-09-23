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
      <Text style={styles.eyebrow}>
        {eyebrow}
      </Text>

      <Text style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },

  eyebrow: {
    color: colors.accent,
    fontSize: 7,
    lineHeight: 9,
    fontWeight: '900',
    letterSpacing: 1.35,
    textTransform: 'uppercase',
  },

  title: {
    color: colors.white,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '900',
    letterSpacing: -0.55,
  },
});