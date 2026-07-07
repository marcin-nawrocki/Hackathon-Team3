import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, shadows } from '../../theme';

export type SummaryStat = {
  value: string | number;
  label: string;
};

type Props = {
  stats: SummaryStat[];
};

/** Horizontal card of headline stats separated by dividers. */
export default function CalendarSummary({ stats }: Props) {
  return (
    <View style={styles.card}>
      {stats.map((stat, index) => (
        <View key={stat.label} style={styles.itemWrap}>
          {index > 0 ? <View style={styles.divider} /> : null}
          <View style={styles.item}>
            <Text style={styles.value}>{stat.value}</Text>
            <Text style={styles.label}>{stat.label}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    paddingVertical: 14,
    marginTop: 12,
    ...shadows.card,
  },
  itemWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    fontFamily: fonts.semibold,
    fontSize: 20,
    color: colors.text,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: '#eee',
  },
});
