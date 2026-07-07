import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radii } from '../../theme';

type Props = {
  checked: boolean;
  onToggle: () => void;
  label: string;
};

/** Labelled checkbox with the brand green fill when checked. */
export default function Checkbox({ checked, onToggle, label }: Props) {
  return (
    <Pressable style={styles.row} onPress={onToggle}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 2,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  boxChecked: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  label: {
    fontFamily: fonts.light,
    fontSize: 16,
    color: colors.text,
  },
});
