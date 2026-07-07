import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radii, shadows, spacing } from '../../theme';
import { Property } from '../../data/properties';
import { StatusBadge } from '../ui';

type Props = {
  item: Property;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

type StatProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

function Stat({ icon, label }: StatProps) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={14} color={colors.textMuted} />
      <Text style={styles.statText}>{label}</Text>
    </View>
  );
}

/** Summary card for a single property in the list. */
export default function PropertyCard({ item, onPress, style }: Props) {
  return (
    <Pressable
      style={[styles.card, style]}
      onPress={onPress}
      android_ripple={{ color: '#eee' }}
    >
      <View style={[styles.thumb, { backgroundColor: item.accent }]}>
        <Ionicons name="home" size={26} color="rgba(255,255,255,0.9)" />
      </View>

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.name}
          </Text>
          <StatusBadge status={item.status} />
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color={colors.textMuted} />
          <Text style={styles.location} numberOfLines={1}>
            {item.location}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <Stat icon="people-outline" label={`Sleeps ${item.sleeps}`} />
          <Stat icon="bed-outline" label={`${item.bedrooms} bed`} />
          <Stat icon="calendar-outline" label={`${item.upcomingBookings} upcoming`} />
        </View>

        <View style={styles.occupancyRow}>
          <View style={styles.occupancyTrack}>
            <View style={[styles.occupancyFill, { width: `${item.occupancy}%` }]} />
          </View>
          <Text style={styles.occupancyText}>{item.occupancy}% occ.</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#c8c8c8" style={styles.chevron} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: 14,
    ...shadows.card,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  body: {
    flex: 1,
  },
  chevron: {
    marginLeft: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.text,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  location: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  occupancyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 10,
  },
  occupancyTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  occupancyFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.green,
  },
  occupancyText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    width: 58,
    textAlign: 'right',
  },
});
