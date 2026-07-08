import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, Palette, radii, spacing } from '../../theme';
import { useThemedStyles } from '../../ThemeContext';

export type ChipOption<T extends string> = {
  key: T;
  label: string;
};

type Props<T extends string> = {
  options: ChipOption<T>[];
  value: T;
  onChange: (key: T) => void;
};

/** Row of single-select pill chips. */
export default function FilterChips<T extends string>({
  options,
  value,
  onChange,
}: Props<T>) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const active = option.key === value;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.md,
      marginBottom: spacing.xs,
    },
    chip: {
      paddingHorizontal: spacing.lg,
      paddingVertical: 6,
      borderRadius: radii.pill,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    chipActive: {
      backgroundColor: colors.green,
      borderColor: colors.green,
    },
    chipText: {
      fontFamily: fonts.regular,
      fontSize: 13,
      color: colors.textMuted,
    },
    chipTextActive: {
      color: colors.white,
    },
  });
