// CompCleared Brand Constants

export const colors = {
  // Primary brand colors - Trust Blue
  primary: '#2563EB',        // Trust blue
  primaryLight: '#3B82F6',
  primaryDark: '#1E40AF',

  // Accent colors
  accent: '#3B82F6',          // Professional blue
  accentLight: '#60A5FA',
  accentDark: '#2563EB',

  // CTA color
  cta: '#F97316',             // Orange for call-to-action
  ctaLight: '#FB923C',
  ctaDark: '#EA580C',

  // Trust/success colors
  trust: '#10B981',           // Green for verified/secure
  trustLight: '#34D399',

  // Alert colors
  danger: '#EF4444',          // Red for imminent risk
  dangerLight: '#F87171',
  warning: '#F59E0B',         // Orange for warnings
  warningLight: '#FBBF24',

  // Neutral colors
  white: '#ffffff',
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',

  // Background colors
  bgLight: '#F8FAFC',
  bgDark: '#0F172A',
  bgGradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
};

export const typography = {
  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", "Droid Sans Mono", "Source Code Pro", monospace',
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
};

export const borderRadius = {
  sm: '0.25rem',    // 4px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  glow: '0 0 20px rgba(37, 99, 235, 0.3)',
  focus: '0 0 0 3px rgba(37, 99, 235, 0.1)',
};

export const transitions = {
  fast: 'all 0.15s ease-in-out',
  medium: 'all 0.3s ease-in-out',
  slow: 'all 0.5s ease-in-out',
};

export const focus = {
  ring: '2px solid #2563EB',
  ringOffset: '2px',
  ringColor: '#2563EB',
};

export const breakpoints = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
};
