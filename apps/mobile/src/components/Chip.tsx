import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '@/theme';

export function Chip({ text }: { text: string }) {
  return (
    <View style={styles.chip}>
      <Ionicons
        name="pricetag-outline"
        size={11}
        color={colors.accent}
      />

      <Text
        style={styles.text}
        numberOfLines={1}
      >
        #{text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',

    minHeight: 31,

    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: radius.pill,

    backgroundColor: 'rgba(45, 225, 214, 0.06)',
    borderWidth: 1,
    borderColor: colors.border,
  },

  text: {
    color: colors.accentSoft,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.15,
    marginLeft: 5,
    maxWidth: 150,
  },
});