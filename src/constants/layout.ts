import { useWindowDimensions } from 'react-native';

export const contentMaxWidth = {
  login: 456,
  properties: 940,
  calendar: 1040,
};

export const breakpoints = {
  sm: 680,
  md: 760,
  lg: 1000,
};

/** Number of property cards per row based on viewport width. */
export function usePropertyColumns(): number {
  const { width } = useWindowDimensions();
  return width >= breakpoints.md ? 2 : 1;
}

/** Number of month calendars per row based on viewport width. */
export function useMonthColumns(): number {
  const { width } = useWindowDimensions();
  if (width >= breakpoints.lg) return 3;
  if (width >= breakpoints.sm) return 2;
  return 1;
}

/** Maps a column count to the percentage width used within a space-between grid. */
export function gridItemWidth(columns: number): `${number}%` {
  if (columns >= 3) return '32%';
  if (columns === 2) return '48.7%';
  return '100%';
}
