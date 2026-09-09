import { PropsWithChildren } from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { colors, radius } from '@/theme';

type GlassCardProps = PropsWithChildren<{
  style?: ViewStyle;
}>;

export function GlassCard({
  children,
  style,
}: GlassCardProps) {
  return (
    <View style={[styles.wrapper, style]}>
      <View pointerEvents="none" style={styles.topHighlight} />

      <View pointerEvents="none" style={styles.innerBorder} />

      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',

    overflow: 'hidden',

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: radius.lg,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 18,

    elevation: 5,
  },

  content: {
    position: 'relative',
    zIndex: 2,
  },

  topHighlight: {
    position: 'absolute',

    top: 0,
    left: '8%',
    right: '8%',

    height: 1,

    backgroundColor: 'rgba(146, 255, 247, 0.16)',
  },

  innerBorder: {
    position: 'absolute',

    top: 1,
    left: 1,
    right: 1,
    bottom: 1,

    borderWidth: 1,
    borderColor: 'rgba(45, 225, 214, 0.035)',

    borderRadius: radius.lg - 1,
  },
});