import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, radii } from '../../theme';
import { useTheme, useThemedStyles } from '../../ThemeContext';

/** Segmented light/dark switch shown in the global top bar. */
export default function ThemeToggle() {
  const { colors, isDark, toggle } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      onPress={toggle}
      style={styles.track}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
      accessibilityLabel="Toggle dark mode"
    >
      <View style={[styles.segment, !isDark && styles.segmentActive]}>
        <Ionicons name="sunny" size={15} color={isDark ? colors.textMuted : colors.green} />
      </View>
      <View style={[styles.segment, isDark && styles.segmentActive]}>
        <Ionicons name="moon" size={14} color={isDark ? colors.green : colors.textMuted} />
      </View>
    </Pressable>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    track: {
      flexDirection: 'row',
      backgroundColor: colors.offlineBg,
      borderRadius: radii.pill,
      padding: 2,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    segment: {
      width: 34,
      height: 26,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radii.pill,
    },
    segmentActive: {
      backgroundColor: colors.surface,
    },
  });
