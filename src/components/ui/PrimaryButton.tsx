import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { colors, fonts, radii } from '../../theme';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Solid green call-to-action button; shows a spinner while `loading`. */
export default function PrimaryButton({ label, onPress, loading, style }: Props) {
  if (loading) {
    return <ActivityIndicator size="small" color={colors.green} style={style} />;
  }

  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    paddingHorizontal: 18,
    backgroundColor: colors.green,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.white,
  },
});
