import { properties } from './properties';

export type BookingSource = 'Booking.com' | 'Airbnb' | 'Sykes Cottages' | 'Holidu' | 'Direct';

export type Booking = {
  ref: string;
  propertyId: string;
  checkIn: string; // 'YYYY-MM-DD'
  checkOut: string; // 'YYYY-MM-DD', exclusive (guest departs this morning)
  guests: number;
  arrivalHour: number; // 0-23
  departureHour: number; // 0-23
  countryCode: string;
  source: BookingSource;
  nightlyRate: number; // £ per night
  revenue: number; // £ total = nights * nightlyRate
};

export type Country = {
  code: string;
  name: string;
  flag: string;
  lat: number;
  lon: number;
  weight: number;
};

// Typical origin countries for UK holiday-let guests, with rough coordinates.
export const COUNTRIES: Country[] = [
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', lat: 54, lon: -2, weight: 46 },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', lat: 53.3, lon: -8, weight: 8 },
  { code: 'FR', name: 'France', flag: '🇫🇷', lat: 46.6, lon: 2.2, weight: 10 },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', lat: 51, lon: 10, weight: 9 },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', lat: 52.1, lon: 5.3, weight: 7 },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', lat: 50.5, lon: 4.5, weight: 3 },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', lat: 40.4, lon: -3.7, weight: 4 },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', lat: 41.9, lon: 12.5, weight: 3 },
  { code: 'US', name: 'United States', flag: '🇺🇸', lat: 39.8, lon: -98.6, weight: 6 },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', lat: -25, lon: 133, weight: 2 },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', lat: 52, lon: 19, weight: 2 },
];

export const SOURCES: { name: BookingSource; weight: number; color: string }[] = [
  { name: 'Booking.com', weight: 34, color: '#003580' },
  { name: 'Airbnb', weight: 26, color: '#FF5A5F' },
  { name: 'Sykes Cottages', weight: 18, color: '#82BF40' },
  { name: 'Holidu', weight: 12, color: '#F5A623' },
  { name: 'Direct', weight: 10, color: '#7E6BC4' },
];

// Hour-of-day likelihoods that give a realistic "popular times" shape.
const ARRIVAL_WEIGHTS = [
  0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 4, 6, 8, 11, 15, 17, 15, 10, 7, 4, 3, 2, 1,
];
const DEPARTURE_WEIGHTS = [
  0, 0, 0, 0, 0, 0, 1, 2, 5, 12, 17, 15, 8, 4, 3, 2, 2, 1, 1, 1, 1, 0, 0, 0,
];

// Seasonal price multiplier by month (Jan..Dec): summer peak + a festive bump.
const SEASON_MULTIPLIER = [
  0.78, 0.8, 0.9, 1.02, 1.12, 1.28, 1.5, 1.52, 1.16, 0.98, 0.82, 1.12,
];

function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ymd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function weightedIndex(rand: number, weights: number[]): number {
  const total = weights.reduce((sum, w) => sum + w, 0);
  let target = rand * total;
  for (let i = 0; i < weights.length; i++) {
    target -= weights[i];
    if (target <= 0) return i;
  }
  return weights.length - 1;
}

/** Booking likelihood derived from a property's occupancy, kept in a sane band. */
export function densityForOccupancy(occupancy: number): number {
  return Math.max(0.1, Math.min(0.32, (occupancy / 100) * 0.3 + 0.08));
}

// Higher density -> more bookings.
export function getBookings(propertyId: string, year: number, density = 0.22): Booking[] {
  const property = properties.find((p) => p.id === propertyId);
  const sleeps = property?.sleeps ?? 4;
  const occupancy = property?.occupancy ?? 50;
  // Deterministic base nightly rate driven by property size and popularity.
  const baseRate = 42 + sleeps * 16 + occupancy * 0.5;
  const rand = mulberry32(hashSeed(`${propertyId}-${year}`));
  const bookings: Booking[] = [];
  const cursor = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  let counter = 1;

  while (cursor <= end) {
    if (rand() < density) {
      const nights = 2 + Math.floor(rand() * 12); // 2–13 nights
      const checkIn = new Date(cursor);
      const checkOut = new Date(cursor);
      checkOut.setDate(checkOut.getDate() + nights);

      const guests = 1 + Math.floor(rand() * sleeps);
      const arrivalHour = weightedIndex(rand(), ARRIVAL_WEIGHTS);
      const departureHour = weightedIndex(rand(), DEPARTURE_WEIGHTS);
      const country = COUNTRIES[weightedIndex(rand(), COUNTRIES.map((c) => c.weight))];
      const source = SOURCES[weightedIndex(rand(), SOURCES.map((s) => s.weight))].name;

      const season = SEASON_MULTIPLIER[checkIn.getMonth()];
      const variation = 0.92 + rand() * 0.16; // ±8% deterministic wobble
      const nightlyRate = Math.max(35, Math.round((baseRate * season * variation) / 5) * 5);
      const revenue = nightlyRate * nights;

      bookings.push({
        ref: `${propertyId}-${year}-${String(counter).padStart(3, '0')}`,
        propertyId,
        checkIn: ymd(checkIn),
        checkOut: ymd(checkOut),
        guests,
        arrivalHour,
        departureHour,
        countryCode: country.code,
        source,
        nightlyRate,
        revenue,
      });
      counter += 1;

      const gap = 1 + Math.floor(rand() * 7); // rest days before next booking
      cursor.setTime(checkOut.getTime());
      cursor.setDate(cursor.getDate() + gap);
    } else {
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  return bookings;
}

// Set of booked night dates ('YYYY-MM-DD') for quick lookup while rendering.
export function getBookedDays(propertyId: string, year: number, density?: number): Set<string> {
  const set = new Set<string>();
  for (const booking of getBookings(propertyId, year, density)) {
    const day = new Date(`${booking.checkIn}T00:00:00`);
    const out = new Date(`${booking.checkOut}T00:00:00`);
    while (day < out) {
      set.add(ymd(day));
      day.setDate(day.getDate() + 1);
    }
  }
  return set;
}

/**
 * Collects bookings for the given properties whose check-in month falls within
 * the inclusive [start, end] month range. Range values are 'YYYY-MM' strings.
 */
export function getBookingsInRange(
  propertyIds: string[],
  startMonth: string,
  endMonth: string,
): Booking[] {
  const [startYear] = startMonth.split('-').map(Number);
  const [endYear] = endMonth.split('-').map(Number);
  const result: Booking[] = [];

  for (const propertyId of propertyIds) {
    const property = properties.find((p) => p.id === propertyId);
    const density = densityForOccupancy(property?.occupancy ?? 50);
    for (let year = startYear; year <= endYear; year++) {
      for (const booking of getBookings(propertyId, year, density)) {
        const month = booking.checkIn.slice(0, 7); // 'YYYY-MM'
        if (month >= startMonth && month <= endMonth) {
          result.push(booking);
        }
      }
    }
  }

  return result;
}
