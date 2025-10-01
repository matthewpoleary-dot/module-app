// constants/theme.ts
export const colors = {
  bg: '#0B0B0E',
  surface: '#14141A',
  surface2: '#191922',
  text: '#F5F6FA',
  textDim: '#A6A8B3',
  accent: '#7C3AED',    // electric purple
  accent2: '#06B6D4',   // cyan
  danger: '#EF4444',
  success: '#22C55E',
  border: '#2A2A35',
  chip: '#232333',
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const spacing = (n = 1) => 8 * n;
export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
};
