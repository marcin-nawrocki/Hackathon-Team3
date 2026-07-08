import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { fonts, Palette, radii, shadows, spacing } from '../../theme';
import { useThemedStyles } from '../../ThemeContext';

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Surface card with a heading used to frame each dashboard chart. */
export default function ChartCard({ title, subtitle, children, style }: Props) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      padding: spacing.lg,
      marginBottom: 14,
      ...shadows.card,
    },
    title: {
      fontFamily: fonts.semibold,
      fontSize: 16,
      color: colors.text,
    },
    subtitle: {
      fontFamily: fonts.regular,
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
    },
    body: {
      marginTop: spacing.md,
    },
  });
