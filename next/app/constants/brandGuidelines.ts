// City of Boston Brand Guidelines
// Source: https://www.boston.gov/departments/innovation-and-technology/brand-guidelines

export const COLORS = {
  PRIMARY: {
    CHARLES_BLUE: {
      hex: '#091F2F',
      pantone: '295C',
      rgb: '9, 31, 47',
      usage: 'Typographic headers, contrast, official look',
    },
    OPTIMISTIC_BLUE: {
      hex: '#1871BD',
      pantone: '285C',
      rgb: '24, 113, 189',
      usage: 'Links, buttons, backgrounds, overlays, warmth',
    },
    FREEDOM_TRAIL_RED: {
      hex: '#FB4D42',
      pantone: '1788C',
      rgb: '251, 77, 66',
      usage: 'Minimal use, brick-red inspired by Freedom Trail',
    },
    WHITE: {
      hex: '#FFFFFF',
      usage: 'Primary site color, grounding mechanism',
    },
  },
  SUPPORTING: {
    BLUES: {
      DARKEST: '#061622',
      DARK_FOOTER: '#0C2639',
      DESATURATED: '#45789C',
      BRIGHT_ON_DARK: '#51ACFF',
    },
    GRAYS: {
      DARK_TEXT: '#58585B',
      MEDIUM_DARK: '#D2D2D2',
      MEDIUM_LIGHT: '#E0E0E0',
      LIGHT_BACKGROUND: '#F2F2F2',
    },
  },
} as const;

export const TYPOGRAPHY = {
  PRIMARY: {
    name: 'Montserrat',
    fallback: 'Arial, sans-serif',
    usage: 'Primary typeface for web',
  },
  SECONDARY: {
    name: 'Lora',
    fallback: 'serif',
    usage: 'Secondary typeface, can substitute Montserrat with Arial',
  },
} as const;

// CSS Custom Properties for easy theming
export const CSS_VARIABLES = {
  '--color-charles-blue': COLORS.PRIMARY.CHARLES_BLUE.hex,
  '--color-optimistic-blue': COLORS.PRIMARY.OPTIMISTIC_BLUE.hex,
  '--color-freedom-trail-red': COLORS.PRIMARY.FREEDOM_TRAIL_RED.hex,
  '--color-white': COLORS.PRIMARY.WHITE.hex,
  '--color-dark-text': COLORS.SUPPORTING.GRAYS.DARK_TEXT,
  '--color-light-background': COLORS.SUPPORTING.GRAYS.LIGHT_BACKGROUND,
  '--font-primary': `${TYPOGRAPHY.PRIMARY.name}, ${TYPOGRAPHY.PRIMARY.fallback}`,
  '--font-secondary': `${TYPOGRAPHY.SECONDARY.name}, ${TYPOGRAPHY.SECONDARY.fallback}`,
} as const;
