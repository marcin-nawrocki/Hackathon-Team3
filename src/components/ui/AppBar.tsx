import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Palette, spacing } from '../../theme';
import { useThemedStyles } from '../../ThemeContext';

type Props = {
  maxWidth: number;
  children: ReactNode;
};

/** Full-width top bar whose inner content is centered and width-constrained. */
export default function AppBar({ maxWidth, children }: Props) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.bar}>
      <View style={[styles.inner, { maxWidth }]}>{children}</View>
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    bar: {
      alignItems: 'center',
      paddingVertical: spacing.md,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    inner: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
    },
  });
