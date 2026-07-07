export const colors = {
  green: '#82BF40',
  greenDark: '#72a838',
  text: '#333333',
  textMuted: '#555555',
  inputText: '#555555',
  border: '#cccccc',
  borderLight: '#e2e2e2',
  divider: '#ececec',
  background: '#f5f5f5',
  white: '#ffffff',
  error: '#a94442',
  liveBg: '#eaf5df',
  liveText: '#5a8a2a',
  offlineBg: '#f2f2f2',
  offlineText: '#888888',
  placeholder: '#999999',
};

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
