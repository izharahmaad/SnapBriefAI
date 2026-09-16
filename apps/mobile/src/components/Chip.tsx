import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '@/theme';

export function Chip({ text }: { text: string }) {
  return (
    <View style={styles.chip}>
      <View style={styles.iconWrap}>
        <Ionicons
          name="pricetag-outline"
          size={9}
          color={colors.accent}
        />
      </View>

      <Text
        style={styles.text}
        numberOfLines={1}
      >
        {text.startsWith('#') ? text : `#${text}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',

    minHeight: 28,

    paddingLeft: 5,
    paddingRight: 10,
    paddingVertical: 4,

    borderRadius: radius.pill,

    backgroundColor: 'rgba(45, 225, 214, 0.045)',
    borderWidth: 1,
    borderColor: 'rgba(45, 225, 214, 0.12)',
  },

  iconWrap: {
    width: 19,
    height: 19,
    borderRadius: 7,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(45, 225, 214, 0.08)',
    marginRight: 6,
  },

  text: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.1,
    maxWidth: 150,
  },
});