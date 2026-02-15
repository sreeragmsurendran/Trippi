import { ColorOption } from '../types';

export const MESSAGE_COLORS: ColorOption[] = [
  // Reds
  { hex: '#E74C3C', name: 'Red' },
  { hex: '#C0392B', name: 'Dark Red' },
  { hex: '#FF6B6B', name: 'Coral' },

  // Oranges
  { hex: '#E67E22', name: 'Orange' },
  { hex: '#F39C12', name: 'Amber' },
  { hex: '#FF9F43', name: 'Light Orange' },

  // Yellows
  { hex: '#F1C40F', name: 'Yellow' },
  { hex: '#FECA57', name: 'Sunflower' },

  // Greens
  { hex: '#2ECC71', name: 'Green' },
  { hex: '#27AE60', name: 'Dark Green' },
  { hex: '#1ABC9C', name: 'Turquoise' },
  { hex: '#00B894', name: 'Mint' },

  // Blues
  { hex: '#3498DB', name: 'Blue' },
  { hex: '#2980B9', name: 'Dark Blue' },
  { hex: '#74B9FF', name: 'Light Blue' },
  { hex: '#0984E3', name: 'Royal Blue' },

  // Purples
  { hex: '#9B59B6', name: 'Purple' },
  { hex: '#8E44AD', name: 'Dark Purple' },
  { hex: '#A29BFE', name: 'Lavender' },
  { hex: '#6C5CE7', name: 'Indigo' },

  // Pinks
  { hex: '#FD79A8', name: 'Pink' },
  { hex: '#E84393', name: 'Hot Pink' },
  { hex: '#FF6F91', name: 'Salmon' },

  // Neutrals
  { hex: '#636E72', name: 'Gray' },
  { hex: '#2D3436', name: 'Charcoal' },
  { hex: '#B2BEC3', name: 'Silver' },
];

// App theme colors
export const THEME = {
  background: '#0D1117',
  surface: '#161B22',
  surfaceLight: '#1C2333',
  surfaceHover: '#252D3A',
  border: '#30363D',
  borderLight: '#3D4450',
  textPrimary: '#F0F6FC',
  textSecondary: '#8B949E',
  textMuted: '#6E7681',
  accent: '#FF6B35',
  accentLight: '#FF8B5E',
  accentDark: '#E05520',
  success: '#2ECC71',
  warning: '#F39C12',
  danger: '#E74C3C',
  info: '#3498DB',
  overlay: 'rgba(0, 0, 0, 0.75)',
  shadow: '#000000',
  floatingBg: '#1A1F2E',
  floatingBorder: '#FF6B35',
};
