import { Text, View, StyleSheet } from 'react-native';
import { colors, radius } from '@/theme';

export function Chip({ text }: { text: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.text}>#{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface2, paddingHorizontal: 10, paddingVertical: 6 },
  text: { color: colors.muted, fontSize: 11, fontFamily: 'SpaceGrotesk_600SemiBold' },
});
