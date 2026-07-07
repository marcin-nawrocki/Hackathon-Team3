import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme';
import { contentMaxWidth, gridItemWidth, useMonthColumns } from '../constants/layout';
import { properties } from '../data/properties';
import { getBookedDays, getBookings } from '../data/bookings';
import { MONTHS, daysInYear } from '../utils/calendar';
import { AppBar, Select, SelectOption } from '../components/ui';
import MonthGrid from '../components/calendar/MonthGrid';
import CalendarSummary from '../components/calendar/CalendarSummary';
import CalendarLegend from '../components/calendar/CalendarLegend';

const YEARS = [2026, 2025, 2024, 2023];

type Props = {
  propertyId: string;
  year: number;
  onBack: () => void;
  onChangeProperty: (propertyId: string) => void;
  onChangeYear: (year: number) => void;
};

export default function BookingCalendarScreen({
  propertyId,
  year,
  onBack,
  onChangeProperty,
  onChangeYear,
}: Props) {
  const property = properties.find((p) => p.id === propertyId) ?? properties[0];

  // More occupied properties show more bookings; keep it bounded.
  const density = useMemo(
    () => Math.max(0.1, Math.min(0.32, (property.occupancy / 100) * 0.3 + 0.08)),
    [property.occupancy],
  );

  const bookedDays = useMemo(
    () => getBookedDays(property.id, year, density),
    [property.id, year, density],
  );

  const bookingCount = useMemo(
    () => getBookings(property.id, year, density).length,
    [property.id, year, density],
  );

  const nightsBooked = bookedDays.size;
  const occupancyPct = Math.round((nightsBooked / daysInYear(year)) * 100);

  const yearOptions: SelectOption[] = YEARS.map((y) => ({
    label: String(y),
    value: String(y),
  }));
  const propertyOptions: SelectOption[] = properties.map((p) => ({
    label: p.name,
    value: p.id,
  }));

  const monthColumns = useMonthColumns();
  const monthStyle = { width: gridItemWidth(monthColumns) };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppBar maxWidth={contentMaxWidth.calendar}>
        <Pressable
          style={styles.backBtn}
          onPress={onBack}
          hitSlop={8}
          accessibilityLabel="Back to properties"
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={1}>
            {property.name}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {property.location}
          </Text>
        </View>
        <View style={[styles.thumb, { backgroundColor: property.accent }]}>
          <Ionicons name="home" size={18} color="rgba(255,255,255,0.95)" />
        </View>
      </AppBar>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.selectorRow}>
            <Select
              value={String(year)}
              options={yearOptions}
              onChange={(v) => onChangeYear(Number(v))}
              icon="calendar-outline"
              title="Select year"
              style={styles.yearSelect}
            />
            <Select
              value={property.id}
              options={propertyOptions}
              onChange={onChangeProperty}
              icon="home-outline"
              title="Select property"
              style={styles.propertySelect}
            />
          </View>

          <CalendarSummary
            stats={[
              { value: bookingCount, label: 'Bookings' },
              { value: nightsBooked, label: 'Nights booked' },
              { value: `${occupancyPct}%`, label: 'Occupancy' },
            ]}
          />

          <CalendarLegend />

          <View style={styles.monthsGrid}>
            {MONTHS.map((_, month) => (
              <MonthGrid
                key={month}
                year={year}
                month={month}
                bookedDays={bookedDays}
                style={monthStyle}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backBtn: {
    padding: 4,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 17,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  thumb: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  content: {
    width: '100%',
    maxWidth: contentMaxWidth.calendar,
  },
  selectorRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  yearSelect: {
    width: 116,
  },
  propertySelect: {
    flex: 1,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
