const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        'surface-2': token('surface-2'),
        border: token('border'),
        text: token('text'),
        muted: token('text-muted'),
        primary: token('primary'),
        'on-primary': token('on-primary'),
        accent: token('accent'),
        'on-accent': token('on-accent'),
        blue: token('blue'),
        success: token('success'),
        warning: token('warning'),
        danger: token('danger'),
        info: token('info'),
        'success-fg': token('success-fg'),
        'warning-fg': token('warning-fg'),
        'danger-fg': token('danger-fg'),
        'info-fg': token('info-fg'),
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans Variable"', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['32px', '40px'],
        '4xl': ['40px', '48px'],
      },
      borderRadius: { card: '20px', control: '12px' },
      boxShadow: {
        card: '0 1px 2px rgba(20,26,42,.04), 0 8px 24px rgba(20,26,42,.06)',
        lift: '0 2px 4px rgba(20,26,42,.05), 0 14px 32px rgba(20,26,42,.1)',
      },
    },
  },
  plugins: [],
}
