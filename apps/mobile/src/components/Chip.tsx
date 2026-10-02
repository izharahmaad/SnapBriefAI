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
      <View style={styles.iconWrap}>
        <Ionicons
          name="pricetag-outline"
          size={10}
          color={colors.accent}
        />
      </View>

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

    minHeight: 27,

    paddingLeft: 7,
    paddingRight: 10,

    borderRadius: radius.pill,

    backgroundColor:
      'rgba(45, 225, 214, 0.045)',

    borderWidth: 1,
    borderColor:
      'rgba(45, 225, 214, 0.12)',
  },

  iconWrap: {
    width: 17,
    height: 17,

    borderRadius: 999,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor:
      'rgba(45, 225, 214, 0.075)',

    marginRight: 5,
  },

  text: {
    color: colors.text,

    fontSize: 9,
    lineHeight: 11,

    fontWeight: '700',
    letterSpacing: 0.15,

    maxWidth: 150,
  },
});