import { StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle } from 'react-native';
import { fonts, Palette, radii } from '../../theme';
import { useTheme, useThemedStyles } from '../../ThemeContext';

type Props = TextInputProps & {
  hasError?: boolean;
  style?: StyleProp<TextStyle>;
};

/** Styled single-line text input matching the SuperControl form fields. */
export default function Input({ hasError, style, ...rest }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <TextInput
      style={[styles.input, hasError && styles.inputError, style]}
      placeholderTextColor={colors.placeholder}
      autoCapitalize="none"
      autoCorrect={false}
      {...rest}
    />
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    input: {
      height: 34,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.sm,
      paddingHorizontal: 12,
      paddingVertical: 6,
      fontSize: 14,
      fontFamily: fonts.regular,
      color: colors.inputText,
      backgroundColor: colors.surface,
    },
    inputError: {
      borderColor: colors.error,
    },
  });
