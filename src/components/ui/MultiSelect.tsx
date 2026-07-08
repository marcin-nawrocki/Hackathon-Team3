import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonts, Palette, radii, shadows } from '../../theme';
import { useTheme, useThemedStyles } from '../../ThemeContext';
import { SelectOption } from './Select';

type Props = {
  values: string[];
  options: SelectOption[];
  onChange: (values: string[]) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  title?: string;
  allLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Multi-choice dropdown with a select-all option, rendered in a modal. */
export default function MultiSelect({
  values,
  options,
  onChange,
  icon,
  title,
  allLabel = 'All',
  style,
}: Props) {
  const [open, setOpen] = useState(false);
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const allSelected = values.length === options.length && options.length > 0;

  const summary = allSelected
    ? allLabel
    : values.length === 0
      ? 'None selected'
      : values.length === 1
        ? options.find((o) => o.value === values[0])?.label ?? '1 selected'
        : `${values.length} selected`;

  const toggle = (value: string) => {
    onChange(
      values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value],
    );
  };

  const toggleAll = () => {
    onChange(allSelected ? [] : options.map((o) => o.value));
  };

  return (
    <>
      <Pressable
        style={[styles.field, open && styles.fieldOpen, style]}
        onPress={() => setOpen(true)}
      >
        {icon ? <Ionicons name={icon} size={15} color={colors.textMuted} /> : null}
        <Text style={styles.fieldText} numberOfLines={1}>
          {summary}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={15}
          color={colors.textMuted}
        />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.card}>
            {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
            <ScrollView style={styles.optionsScroll} bounces={false}>
              <Row
                label={allLabel}
                checked={allSelected}
                onPress={toggleAll}
                emphasized
                styles={styles}
                colors={colors}
              />
              <View style={styles.divider} />
              {options.map((o) => (
                <Row
                  key={o.value}
                  label={o.label}
                  checked={values.includes(o.value)}
                  onPress={() => toggle(o.value)}
                  styles={styles}
                  colors={colors}
                />
              ))}
            </ScrollView>
            <Pressable style={styles.doneBtn} onPress={() => setOpen(false)}>
              <Text style={styles.doneText}>Done</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function Row({
  label,
  checked,
  onPress,
  emphasized,
  styles,
  colors,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
  emphasized?: boolean;
  styles: ReturnType<typeof createStyles>;
  colors: Palette;
}) {
  return (
    <Pressable style={styles.option} onPress={onPress}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Ionicons name="checkmark" size={13} color={colors.white} /> : null}
      </View>
      <Text
        style={[styles.optionText, emphasized && styles.optionTextEmphasized]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  fieldOpen: {
    borderColor: colors.green,
  },
  fieldText: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.text,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    paddingVertical: 8,
    paddingHorizontal: 4,
    ...shadows.modal,
  },
  cardTitle: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.textMuted,
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 8,
  },
  optionsScroll: {
    maxHeight: 340,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  optionText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
  },
  optionTextEmphasized: {
    fontFamily: fonts.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 4,
    marginHorizontal: 12,
  },
  doneBtn: {
    margin: 8,
    height: 38,
    borderRadius: radii.md,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.white,
  },
});
