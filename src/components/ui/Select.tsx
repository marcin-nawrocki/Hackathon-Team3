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

export type SelectOption = { label: string; value: string };

type Props = {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  title?: string;
  style?: StyleProp<ViewStyle>;
};

/** Dropdown that opens options in a centered modal (reliable across platforms). */
export default function Select({ value, options, onChange, icon, title, style }: Props) {
  const [open, setOpen] = useState(false);
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const current = options.find((o) => o.value === value);

  return (
    <>
      <Pressable
        style={[styles.field, open && styles.fieldOpen, style]}
        onPress={() => setOpen(true)}
      >
        {icon ? <Ionicons name={icon} size={15} color={colors.textMuted} /> : null}
        <Text style={styles.fieldText} numberOfLines={1}>
          {current?.label ?? value}
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
              {options.map((o) => {
                const active = o.value === value;
                return (
                  <Pressable
                    key={o.value}
                    style={[styles.option, active && styles.optionActive]}
                    onPress={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                  >
                    <Text
                      style={[styles.optionText, active && styles.optionTextActive]}
                      numberOfLines={1}
                    >
                      {o.label}
                    </Text>
                    {active ? (
                      <Ionicons name="checkmark" size={16} color={colors.green} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
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
    maxWidth: 300,
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
    maxHeight: 320,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  optionActive: {
    backgroundColor: colors.liveBg,
  },
  optionText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
  },
  optionTextActive: {
    fontFamily: fonts.semibold,
    color: colors.liveText,
  },
});
