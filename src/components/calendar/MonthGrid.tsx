import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fonts, radii, shadows } from '../../theme';
import { MONTHS, WEEKDAYS, monthCells, pad2 } from '../../utils/calendar';

type Props = {
  year: number;
  month: number;
  bookedDays: Set<string>;
  style?: StyleProp<ViewStyle>;
};

/** A single month's day grid with booked days highlighted. */
export default function MonthGrid({ year, month, bookedDays, style }: Props) {
  const cells = monthCells(year, month);
  const monthKey = `${year}-${pad2(month + 1)}`;

  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>{MONTHS[month]}</Text>

      <View style={styles.weekHeader}>
        {WEEKDAYS.map((day, i) => (
          <Text key={i} style={styles.weekHeaderText}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {cells.map((day, i) => {
          if (day === null) {
            return <View key={i} style={styles.dayCell} />;
          }
          const booked = bookedDays.has(`${monthKey}-${pad2(day)}`);
          return (
            <View key={i} style={styles.dayCell}>
              <View style={[styles.dayInner, booked && styles.dayBooked]}>
                <Text style={[styles.dayText, booked && styles.dayTextBooked]}>
                  {day}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const CELL = `${100 / 7}%` as const;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 8,
    marginBottom: 14,
    ...shadows.card,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  weekHeader: {
    flexDirection: 'row',
  },
  weekHeaderText: {
    width: CELL,
    textAlign: 'center',
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: '#aaa',
    marginBottom: 4,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: CELL,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  dayInner: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBooked: {
    backgroundColor: colors.green,
  },
  dayText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
  },
  dayTextBooked: {
    color: colors.white,
    fontFamily: fonts.semibold,
  },
});
