import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors, radius } from '@/theme';

type ChipProps = {
  text: string;
};

export function Chip({ text }: ChipProps) {
  const label = text.startsWith('#')
    ? text
    : `#${text}`;

  return (
    <View style={styles.chip}>
      <Ionicons
        name="pricetag-outline"
        size={9}
        color={colors.accent}
        style={styles.icon}
      />

      <Text
        style={styles.text}
        numberOfLines={1}
        ellipsizeMode="tail"
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

    borderRadius: radius.pill,

    backgroundColor:
      'rgba(45, 225, 214, 0.035)',

    borderWidth: 1,
    borderColor:
      'rgba(45, 225, 214, 0.10)',
  },

  icon: {
    marginRight: 5,
  },

  text: {
    color: colors.text,

    fontSize: 9,
    lineHeight: 11,

    fontWeight: '700',
    letterSpacing: 0.1,

    maxWidth: 135,
  },
});