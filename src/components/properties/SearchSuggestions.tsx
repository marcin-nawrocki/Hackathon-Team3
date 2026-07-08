import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonts, Palette, radii, shadows } from '../../theme';
import { useTheme, useThemedStyles } from '../../ThemeContext';
import { Property } from '../../data/properties';

type Props = {
  items: Property[];
  onSelect: (property: Property) => void;
};

/** Dropdown list of property matches shown beneath the search bar. */
export default function SearchSuggestions({ items, onSelect }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.container}>
      {items.map((property, index) => (
        <Pressable
          key={property.id}
          style={[styles.item, index < items.length - 1 && styles.divider]}
          onPress={() => onSelect(property)}
        >
          <Ionicons name="search-outline" size={15} color={colors.textMuted} />
          <View style={styles.textWrap}>
            <Text style={styles.name} numberOfLines={1}>
              {property.name}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {property.location} · {property.id}
            </Text>
          </View>
          <Ionicons
            name="arrow-up-outline"
            size={14}
            color={colors.placeholder}
            style={styles.arrow}
          />
        </Pressable>
      ))}
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    container: {
      marginTop: 6,
      backgroundColor: colors.surface,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.borderLight,
      overflow: 'hidden',
      ...shadows.soft,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    textWrap: {
      flex: 1,
    },
    name: {
      fontFamily: fonts.regular,
      fontSize: 14,
      color: colors.text,
    },
    meta: {
      fontFamily: fonts.regular,
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 1,
    },
    arrow: {
      transform: [{ rotate: '45deg' }],
    },
  });
