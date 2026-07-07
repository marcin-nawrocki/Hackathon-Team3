export type Booking = {
  ref: string;
  checkIn: string; // 'YYYY-MM-DD'
  checkOut: string; // 'YYYY-MM-DD', exclusive (guest departs this morning)
};

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

// Higher weight -> more bookings. Derived from the property's occupancy.
export function getBookings(
  propertyId: string,
  year: number,
  density = 0.22,
): Booking[] {
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

      bookings.push({
        ref: `${propertyId}-${year}-${String(counter).padStart(3, '0')}`,
        checkIn: ymd(checkIn),
        checkOut: ymd(checkOut),
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
export function getBookedDays(
  propertyId: string,
  year: number,
  density?: number,
): Set<string> {
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
