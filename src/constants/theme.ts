import '@/global.css';

export const palette = {
  light: {
    background: '#F6F6F2',
    surface: '#FFFFFF',
    surfaceMuted: '#F0F1EC',
    ink: '#202522',
    inkSoft: '#5D665F',
    inkFaint: '#96A098',
    line: '#E1E5DF',
    lineStrong: '#C9D2C8',
    blue: '#426A85',
    blueSoft: '#E8F0F4',
    green: '#4F7A61',
    greenSoft: '#EAF2EA',
    orange: '#B16D45',
    orangeSoft: '#F7EDE5',
    red: '#A95D58',
    redSoft: '#F8EAE8',
    shadow: 'rgba(35, 46, 38, 0.08)',
  },
  dark: {
    background: '#202522',
    surface: '#2A302C',
    surfaceMuted: '#303832',
    ink: '#F1F3ED',
    inkSoft: '#B4BDB4',
    inkFaint: '#7D897F',
    line: '#3B443D',
    lineStrong: '#536158',
    blue: '#94B8CA',
    blueSoft: '#2C3D45',
    green: '#9AC1A4',
    greenSoft: '#2C4032',
    orange: '#E1A477',
    orangeSoft: '#44362F',
    red: '#E49A91',
    redSoft: '#452F2F',
    shadow: 'rgba(0, 0, 0, 0.22)',
  },
} as const;

export type ThemeName = keyof typeof palette;
export type ThemeColors = (typeof palette)[ThemeName];

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const type = {
  display: 34,
  headline: 25,
  title: 18,
  body: 15,
  small: 13,
  micro: 11,
} as const;

export const Colors = {
  light: {
    text: palette.light.ink,
    background: palette.light.background,
    backgroundElement: palette.light.surfaceMuted,
    backgroundSelected: palette.light.greenSoft,
    textSecondary: palette.light.inkSoft,
  },
  dark: {
    text: palette.dark.ink,
    background: palette.dark.background,
    backgroundElement: palette.dark.surfaceMuted,
    backgroundSelected: palette.dark.greenSoft,
    textSecondary: palette.dark.inkSoft,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const Fonts = {
  sans: 'var(--font-display)',
  serif: 'Georgia',
  rounded: 'var(--font-display)',
  mono: 'var(--font-mono)',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
} as const;

export const BottomTabInset = 0;
export const MaxContentWidth = 960;
