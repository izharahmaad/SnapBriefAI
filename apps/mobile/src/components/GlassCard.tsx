import { PropsWithChildren } from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { colors, radius } from '@/theme';

type GlassCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function GlassCard({
  children,
  style,
}: GlassCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View pointerEvents="none" style={styles.highlight} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    overflow: 'hidden',

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: 'rgba(146, 255, 247, 0.075)',
    borderRadius: radius.xl,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.16,
    shadowRadius: 14,

    elevation: 3,
  },

  highlight: {
    position: 'absolute',
    top: 0,
    left: 18,
    right: 18,
    height: 1,

    backgroundColor:
      'rgba(146, 255, 247, 0.10)',
  },
});