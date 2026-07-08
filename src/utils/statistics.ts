import { Booking, COUNTRIES, Country, SOURCES } from '../data/bookings';

export type CountryStat = Country & { count: number; share: number };
export type SourceStat = { name: string; color: string; count: number; share: number };

export type Statistics = {
  totalBookings: number;
  totalNights: number;
  totalGuests: number;
  totalRevenue: number;
  avgGuests: number;
  avgStay: number;
  monthlyBookings: number[]; // length 12, Jan..Dec
  revenueByMonth: number[]; // length 12, Jan..Dec (£)
  avgGuestsByMonth: number[]; // length 12
  arrivalByHour: number[]; // length 24
  departureByHour: number[]; // length 24
  countries: CountryStat[]; // sorted desc, count > 0
  sources: SourceStat[]; // sorted desc
  topCountry?: CountryStat;
};

function nightsBetween(checkIn: string, checkOut: string): number {
  const start = new Date(`${checkIn}T00:00:00`).getTime();
  const end = new Date(`${checkOut}T00:00:00`).getTime();
  return Math.max(1, Math.round((end - start) / 86_400_000));
}

export function computeStatistics(bookings: Booking[]): Statistics {
  const monthlyBookings = new Array(12).fill(0);
  const revenueByMonth = new Array(12).fill(0);
  const guestsByMonthSum = new Array(12).fill(0);
  const arrivalByHour = new Array(24).fill(0);
  const departureByHour = new Array(24).fill(0);
  const countryCounts = new Map<string, number>();
  const sourceCounts = new Map<string, number>();

  let totalNights = 0;
  let totalGuests = 0;
  let totalRevenue = 0;

  for (const b of bookings) {
    const month = Number(b.checkIn.slice(5, 7)) - 1;
    monthlyBookings[month] += 1;
    revenueByMonth[month] += b.revenue;
    guestsByMonthSum[month] += b.guests;
    arrivalByHour[b.arrivalHour] += 1;
    departureByHour[b.departureHour] += 1;
    countryCounts.set(b.countryCode, (countryCounts.get(b.countryCode) ?? 0) + 1);
    sourceCounts.set(b.source, (sourceCounts.get(b.source) ?? 0) + 1);
    totalNights += nightsBetween(b.checkIn, b.checkOut);
    totalGuests += b.guests;
    totalRevenue += b.revenue;
  }

  const total = bookings.length;
  const avgGuestsByMonth = monthlyBookings.map((count, i) =>
    count > 0 ? guestsByMonthSum[i] / count : 0,
  );

  const countries: CountryStat[] = COUNTRIES.map((c) => {
    const count = countryCounts.get(c.code) ?? 0;
    return { ...c, count, share: total ? count / total : 0 };
  })
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  const sources: SourceStat[] = SOURCES.map((s) => {
    const count = sourceCounts.get(s.name) ?? 0;
    return { name: s.name, color: s.color, count, share: total ? count / total : 0 };
  })
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);

  return {
    totalBookings: total,
    totalNights,
    totalGuests,
    totalRevenue,
    avgGuests: total ? totalGuests / total : 0,
    avgStay: total ? totalNights / total : 0,
    monthlyBookings,
    revenueByMonth,
    avgGuestsByMonth,
    arrivalByHour,
    departureByHour,
    countries,
    sources,
    topCountry: countries[0],
  };
}

/** Full pounds with thousands separators, e.g. £128,450. */
export function formatGBP(value: number): string {
  return `£${Math.round(value).toLocaleString('en-GB')}`;
}

/** Compact currency for headline stats / axes, e.g. £128k or £950. */
export function formatGBPCompact(value: number): string {
  if (value >= 1000) {
    const k = value / 1000;
    return `£${k >= 100 ? Math.round(k) : k.toFixed(1)}k`;
  }
  return `£${Math.round(value)}`;
}

/** Builds inclusive 'YYYY-MM' month options between two years. */
export function monthRangeOptions(
  startYear: number,
  endYear: number,
): { label: string; value: string }[] {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const options: { label: string; value: string }[] = [];
  for (let year = startYear; year <= endYear; year++) {
    for (let m = 0; m < 12; m++) {
      const value = `${year}-${String(m + 1).padStart(2, '0')}`;
      options.push({ label: `${monthNames[m]} ${year}`, value });
    }
  }
  return options;
}
