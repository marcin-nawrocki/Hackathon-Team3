import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { fonts, Palette } from '../theme';
import { useTheme, useThemedStyles } from '../ThemeContext';
import { contentMaxWidth, gridItemWidth, useMonthColumns } from '../constants/layout';
import { properties } from '../data/properties';
import { Booking, getBookedDays, getBookings } from '../data/bookings';
import { MONTHS, daysInYear } from '../utils/calendar';
import { AppBar, Select, SelectOption } from '../components/ui';
import MonthGrid from '../components/calendar/MonthGrid';
import CalendarSummary from '../components/calendar/CalendarSummary';
import CalendarLegend from '../components/calendar/CalendarLegend';
import DayBookingModal, { NewBookingInput } from '../components/calendar/DayBookingModal';

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function expandNights(checkIn: string, checkOut: string): string[] {
  const days: string[] = [];
  const out = new Date(`${checkOut}T00:00:00`).getTime();
  let cur = new Date(`${checkIn}T00:00:00`);
  while (cur.getTime() < out) {
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const dd = String(cur.getDate()).padStart(2, '0');
    days.push(`${y}-${m}-${dd}`);
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

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
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const [manualBookings, setManualBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // More occupied properties show more bookings; keep it bounded.
  const density = useMemo(
    () => Math.max(0.1, Math.min(0.32, (property.occupancy / 100) * 0.3 + 0.08)),
    [property.occupancy],
  );

  const generatedBookings = useMemo(
    () => getBookings(property.id, year, density),
    [property.id, year, density],
  );

  const manualForYear = useMemo(
    () =>
      manualBookings.filter(
        (b) => b.propertyId === property.id && b.checkIn.slice(0, 4) === String(year),
      ),
    [manualBookings, property.id, year],
  );

  const allBookings = useMemo(
    () => [...generatedBookings, ...manualForYear],
    [generatedBookings, manualForYear],
  );

  const bookedDays = useMemo(() => {
    const set = getBookedDays(property.id, year, density);
    for (const b of manualForYear) {
      for (const day of expandNights(b.checkIn, b.checkOut)) set.add(day);
    }
    return set;
  }, [property.id, year, density, manualForYear]);

  const bookingCount = allBookings.length;
  const nightsBooked = bookedDays.size;
  const occupancyPct = Math.round((nightsBooked / daysInYear(year)) * 100);

  const selectedBooking = useMemo(() => {
    if (!selectedDate) return null;
    return (
      allBookings.find((b) => b.checkIn <= selectedDate && selectedDate < b.checkOut) ?? null
    );
  }, [selectedDate, allBookings]);

  const handleAddBooking = (input: NewBookingInput) => {
    const checkOut = addDays(input.checkIn, input.nights);
    const ref = `${property.id}-${year}-M${manualForYear.length + 1}`;
    const nightlyRate = Math.max(
      35,
      Math.round((42 + property.sleeps * 16 + (property.occupancy ?? 50) * 0.5) / 5) * 5,
    );
    const newBooking: Booking = {
      ref,
      propertyId: property.id,
      checkIn: input.checkIn,
      checkOut,
      guests: input.guests,
      arrivalHour: input.arrivalHour,
      departureHour: 10,
      countryCode: input.countryCode,
      source: input.source,
      nightlyRate,
      revenue: nightlyRate * input.nights,
    };
    setManualBookings((prev) => [...prev, newBooking]);
    setSelectedDate(null);
  };

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
                onPressDay={setSelectedDate}
                style={monthStyle}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <DayBookingModal
        visible={selectedDate !== null}
        date={selectedDate}
        booking={selectedBooking}
        onClose={() => setSelectedDate(null)}
        onAdd={handleAddBooking}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
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
