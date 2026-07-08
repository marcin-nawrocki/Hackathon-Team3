import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { fonts, Palette, spacing } from '../theme';
import { useTheme, useThemedStyles } from '../ThemeContext';
import { properties } from '../data/properties';
import { getBookingsInRange } from '../data/bookings';
import {
  computeStatistics,
  formatGBPCompact,
  monthRangeOptions,
} from '../utils/statistics';
import { AppBar, MultiSelect, Select, SelectOption } from '../components/ui';
import CalendarSummary from '../components/calendar/CalendarSummary';
import ChartCard from '../components/charts/ChartCard';
import MonthlyBookingsChart from '../components/charts/MonthlyBookingsChart';
import RevenueChart from '../components/charts/RevenueChart';
import HourlyChart from '../components/charts/HourlyChart';
import GuestsTrendChart from '../components/charts/GuestsTrendChart';
import CountryMap from '../components/charts/CountryMap';
import SourcesDonut from '../components/charts/SourcesDonut';

const CONTENT_MAX_WIDTH = 1100;
const MONTH_OPTIONS = monthRangeOptions(2023, 2026);
const ARRIVAL_COLOR = '#82BF40';
const DEPARTURE_COLOR = '#4A90D9';

type Props = {
  onBack: () => void;
};

export default function StatisticsScreen({ onBack }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [selectedIds, setSelectedIds] = useState<string[]>(properties.map((p) => p.id));
  const [startMonth, setStartMonth] = useState('2026-01');
  const [endMonth, setEndMonth] = useState('2026-12');

  const [rangeStart, rangeEnd] =
    startMonth <= endMonth ? [startMonth, endMonth] : [endMonth, startMonth];

  const stats = useMemo(() => {
    const bookings = getBookingsInRange(selectedIds, rangeStart, rangeEnd);
    return computeStatistics(bookings);
  }, [selectedIds, rangeStart, rangeEnd]);

  const propertyOptions: SelectOption[] = properties.map((p) => ({
    label: p.name,
    value: p.id,
  }));

  const { width } = useWindowDimensions();
  const twoColumns = width >= 900;

  const cards = [
    <ChartCard
      key="months"
      title="Bookings by month"
      subtitle="Total reservations checking in each month"
    >
      <MonthlyBookingsChart data={stats.monthlyBookings} />
    </ChartCard>,
    <ChartCard
      key="revenue"
      title="Revenue by month"
      subtitle="Estimated earnings from bookings (£)"
    >
      <RevenueChart data={stats.revenueByMonth} />
    </ChartCard>,
    <ChartCard
      key="times"
      title="Popular check-in & check-out times"
      subtitle="When guests typically arrive and depart"
    >
      <View style={styles.hourBlock}>
        <View style={styles.hourHeader}>
          <View style={[styles.dot, { backgroundColor: ARRIVAL_COLOR }]} />
          <Text style={styles.hourLabel}>Arrivals</Text>
        </View>
        <HourlyChart data={stats.arrivalByHour} color={ARRIVAL_COLOR} />
      </View>
      <View style={styles.hourBlock}>
        <View style={styles.hourHeader}>
          <View style={[styles.dot, { backgroundColor: DEPARTURE_COLOR }]} />
          <Text style={styles.hourLabel}>Departures</Text>
        </View>
        <HourlyChart data={stats.departureByHour} color={DEPARTURE_COLOR} />
      </View>
    </ChartCard>,
    <ChartCard
      key="guests"
      title="Average guests per month"
      subtitle="Mean party size across the period"
    >
      <GuestsTrendChart data={stats.avgGuestsByMonth} />
    </ChartCard>,
    <ChartCard key="sources" title="Booking sources" subtitle="Channels driving reservations">
      <SourcesDonut sources={stats.sources} />
    </ChartCard>,
  ];

  const countriesCard = (
    <ChartCard
      title="Guests by country"
      subtitle="Where your guests travel from"
      style={styles.fullWidthCard}
    >
      <CountryMap countries={stats.countries} />
    </ChartCard>
  );

  const leftColumn = cards.filter((_, i) => i % 2 === 0);
  const rightColumn = cards.filter((_, i) => i % 2 === 1);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppBar maxWidth={CONTENT_MAX_WIDTH}>
        <Pressable
          style={styles.backBtn}
          onPress={onBack}
          hitSlop={8}
          accessibilityLabel="Back to properties"
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Statistics</Text>
          <Text style={styles.subtitle}>Portfolio performance dashboard</Text>
        </View>
        <Ionicons name="bar-chart" size={20} color={colors.green} />
      </AppBar>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.controls}>
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>From</Text>
              <Select
                value={startMonth}
                options={MONTH_OPTIONS}
                onChange={setStartMonth}
                icon="calendar-outline"
                title="Start month"
              />
            </View>
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>To</Text>
              <Select
                value={endMonth}
                options={MONTH_OPTIONS}
                onChange={setEndMonth}
                icon="calendar-outline"
                title="End month"
              />
            </View>
            <View style={[styles.controlGroup, styles.controlWide]}>
              <Text style={styles.controlLabel}>Properties</Text>
              <MultiSelect
                values={selectedIds}
                options={propertyOptions}
                onChange={setSelectedIds}
                icon="home-outline"
                title="Select properties"
                allLabel="All properties"
              />
            </View>
          </View>

          <CalendarSummary
            stats={[
              { value: formatGBPCompact(stats.totalRevenue), label: 'Revenue' },
              { value: stats.totalBookings, label: 'Bookings' },
              { value: stats.totalNights, label: 'Nights' },
              { value: stats.avgGuests.toFixed(1), label: 'Avg guests' },
              { value: `${stats.avgStay.toFixed(1)}`, label: 'Avg nights' },
            ]}
          />

          {stats.totalBookings === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="bar-chart-outline" size={40} color={colors.border} />
              <Text style={styles.emptyText}>
                No bookings for the selected filters
              </Text>
            </View>
          ) : (
            <>
              {twoColumns ? (
                <View style={styles.grid}>
                  <View style={styles.column}>{leftColumn}</View>
                  <View style={styles.column}>{rightColumn}</View>
                </View>
              ) : (
                <View>{cards}</View>
              )}
              {countriesCard}
            </>
          )}
        </View>
      </ScrollView>
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
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  content: {
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
    marginBottom: 4,
  },
  controlGroup: {
    flexGrow: 1,
    flexBasis: 150,
  },
  controlWide: {
    flexBasis: 220,
  },
  controlLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 5,
  },
  grid: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 14,
  },
  column: {
    flex: 1,
  },
  fullWidthCard: {
    width: '100%',
  },
  hourBlock: {
    marginBottom: spacing.sm,
  },
  hourHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  hourLabel: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.textMuted,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 10,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
});
