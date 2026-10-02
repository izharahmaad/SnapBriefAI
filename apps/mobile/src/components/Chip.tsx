import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '@/theme';

export function Chip({ text }: { text: string }) {
  const label = text.startsWith('#') ? text : `#${text}`;

  return (
    <View style={styles.chip}>
      <Ionicons
        name="pricetag-outline"
        size={10}
        color={colors.accent}
      />

      <Text
        style={styles.text}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',

    minHeight: 26,

    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: radius.pill,

    backgroundColor: 'rgba(45, 225, 214, 0.045)',
    borderWidth: 1,
    borderColor: 'rgba(45, 225, 214, 0.12)',
  },

  text: {
    color: colors.text,
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '700',
    letterSpacing: 0.1,
    marginLeft: 5,
    maxWidth: 150,
  },
});