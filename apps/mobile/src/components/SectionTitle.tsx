import { Text, View, StyleSheet } from 'react-native';
import { colors } from '@/theme';

export function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 3 },
  eyebrow: { color: colors.accent, fontSize: 10, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 23, fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: -0.5 },
});
