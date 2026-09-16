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
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',

    backgroundColor: 'rgba(11, 24, 27, 0.82)',

    borderWidth: 1,
    borderColor: 'rgba(146, 255, 247, 0.08)',

    borderRadius: radius.xl,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.14,
    shadowRadius: 14,

    elevation: 3,
  },
});