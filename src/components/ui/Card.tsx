import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Palette, radii, shadows } from '../../theme';
import { useThemedStyles } from '../../ThemeContext';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Rounded surface with the shared card shadow. */
export default function Card({ children, style }: Props) {
  const styles = useThemedStyles(createStyles);
  return <View style={[styles.card, style]}>{children}</View>;
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      ...shadows.card,
    },
  });
