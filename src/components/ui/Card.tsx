import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radii, shadows } from '../../theme';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** White rounded surface with the shared card shadow. */
export default function Card({ children, style }: Props) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    ...shadows.card,
  },
});
