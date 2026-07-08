import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, radii } from '../../theme';
import { useTheme, useThemedStyles } from '../../ThemeContext';
import Input from './Input';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  hasError?: boolean;
};

/** Password field with a show/hide visibility toggle. */
export default function PasswordInput({ value, onChangeText, hasError }: Props) {
  const [visible, setVisible] = useState(false);
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row}>
      <Input
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        hasError={hasError}
        secureTextEntry={!visible}
        autoComplete="password"
      />
      <Pressable
        style={styles.toggle}
        onPress={() => setVisible((prev) => !prev)}
        accessibilityLabel={visible ? 'Hide password' : 'Show password'}
      >
        <Ionicons
          name={visible ? 'eye-off-outline' : 'eye-outline'}
          size={18}
          color={colors.textMuted}
        />
      </Pressable>
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'stretch',
    },
    input: {
      flex: 1,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderRightWidth: 0,
    },
    toggle: {
      width: 34,
      height: 34,
      borderWidth: 1,
      borderColor: colors.border,
      borderTopRightRadius: radii.sm,
      borderBottomRightRadius: radii.sm,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
    },
  });
