export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Monday-first single-letter weekday headers. */
export const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Monday-first weekday offset (0–6) for the 1st of the month. */
export function firstWeekdayOffset(year: number, month: number): number {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function isLeap(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInYear(year: number): number {
  return isLeap(year) ? 366 : 365;
}

/** Layout cells for a month: leading nulls for the offset, then day numbers, padded to full weeks. */
export function monthCells(year: number, month: number): (number | null)[] {
  const offset = firstWeekdayOffset(year, month);
  const total = daysInMonth(year, month);
  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
