export const lightColors = {
  green: '#82BF40',
  greenDark: '#72a838',
  text: '#333333',
  textMuted: '#555555',
  inputText: '#555555',
  border: '#cccccc',
  borderLight: '#e2e2e2',
  divider: '#ececec',
  background: '#f5f5f5',
  surface: '#ffffff',
  white: '#ffffff',
  error: '#a94442',
  liveBg: '#eaf5df',
  liveText: '#5a8a2a',
  offlineBg: '#f2f2f2',
  offlineText: '#888888',
  placeholder: '#999999',
  mapOcean: '#e4eef6',
  mapLand: '#d7e6d9',
  mapBorder: '#b3cfb8',
  mapGraticule: '#cfe0ee',
};

export type Palette = typeof lightColors;

export const darkColors: Palette = {
  green: '#8fce4a',
  greenDark: '#a6d977',
  text: '#e8eaed',
  textMuted: '#9aa0a8',
  inputText: '#d0d4da',
  border: '#3a3f47',
  borderLight: '#2c313a',
  divider: '#2a2f37',
  background: '#0f1115',
  surface: '#1b1f26',
  white: '#ffffff',
  error: '#e06c68',
  liveBg: 'rgba(130,191,64,0.18)',
  liveText: '#a6d977',
  offlineBg: '#262b33',
  offlineText: '#8b929b',
  placeholder: '#6b7280',
  mapOcean: '#10202e',
  mapLand: '#2c3a44',
  mapBorder: '#3f5460',
  mapGraticule: '#1c2b38',
};

// Backwards-compatible default palette (light). Prefer `useTheme().colors`
// in components so they react to the active theme.
export const colors = lightColors;

export const fonts = {
  light: 'SourceSans3_300Light',
  regular: 'SourceSans3_400Regular',
  semibold: 'SourceSans3_600SemiBold',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 4,
  md: 8,
  lg: 10,
  xl: 12,
  pill: 16,
};

export const shadows = {
  card: {
    shadowColor: '#d1d0d0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 2,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
} as const;
