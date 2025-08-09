import { alpha, createTheme, lighten, darken } from '@mui/material';
import '@mui/lab/themeAugmentation';

const themeColors = {
  primary: '#4FD1C5',
  secondary: '#38B2AC',
  success: '#10B981',
  warning: '#FBBF24',
  error: '#EF4444',
  info: '#3B82F6',
  black: '#1F2937',
  white: '#ffffff',
  primaryAlt: '#319795'
};

const colors = {
  gradients: {
    mint1: `linear-gradient(135deg, ${alpha(themeColors.primary, 0.8)} 0%, ${alpha(themeColors.primaryAlt, 0.9)} 100%)`,
    mint2: `linear-gradient(120deg, ${alpha(themeColors.primary, 0.7)} 0%, ${alpha(themeColors.info, 0.6)} 100%)`,
    mint3: `linear-gradient(150deg, ${alpha(themeColors.primary, 0.6)} 0%, ${alpha(themeColors.success, 0.8)} 100%)`,
    mint4: `linear-gradient(90deg, ${alpha(themeColors.primary, 0.9)} 0%, ${alpha(themeColors.secondary, 0.8)} 100%)`,
    mint5: `linear-gradient(180deg, ${alpha(themeColors.primary, 0.7)} 0%, ${alpha(themeColors.primaryAlt, 0.7)} 100%)`,
    blue1: `linear-gradient(135deg, ${alpha(themeColors.info, 0.8)} 0%, ${alpha(themeColors.secondary, 0.9)} 100%)`,
    blue2: `linear-gradient(120deg, ${alpha(themeColors.info, 0.7)} 0%, ${alpha(themeColors.primary, 0.6)} 100%)`,
    blue3: `linear-gradient(150deg, ${alpha(themeColors.info, 0.6)} 0%, ${alpha(themeColors.success, 0.8)} 100%)`,
    blue4: `linear-gradient(-20deg, ${alpha(themeColors.info, 0.8)} 0%, ${alpha(themeColors.primary, 0.9)} 100%)`,
    blue5: `linear-gradient(135deg, ${alpha(themeColors.info, 0.1)} 10%, ${alpha(themeColors.info, 0.8)} 100%)`,
    orange1: `linear-gradient(135deg, ${alpha(themeColors.warning, 0.8)} 0%, ${alpha(themeColors.error, 0.9)} 100%)`,
    orange2: `linear-gradient(135deg, ${alpha(themeColors.warning, 0.6)} 0%, ${alpha(themeColors.error, 0.7)} 100%)`,
    orange3: `linear-gradient(120deg, ${alpha(themeColors.warning, 0.7)} 0%, ${alpha(themeColors.error, 0.8)} 100%)`,
    purple1: `linear-gradient(135deg, ${alpha(themeColors.primary, 0.8)} 0%, ${alpha(themeColors.info, 0.9)} 100%)`,
    purple3: `linear-gradient(135deg, ${alpha(themeColors.primary, 0.6)} 0%, ${alpha(themeColors.info, 0.7)} 100%)`,
    green1: `linear-gradient(135deg, ${alpha(themeColors.success, 0.8)} 0%, ${alpha(themeColors.primary, 0.9)} 100%)`,
    green2: `linear-gradient(120deg, ${alpha(themeColors.success, 0.7)} 0%, ${alpha(themeColors.info, 0.6)} 100%)`,
    pink1: `linear-gradient(135deg, ${alpha(themeColors.error, 0.8)} 0%, ${alpha(themeColors.secondary, 0.9)} 100%)`,
    pink2: `linear-gradient(120deg, ${alpha(themeColors.error, 0.7)} 0%, ${alpha(themeColors.primary, 0.6)} 100%)`,
    black1: `linear-gradient(135deg, ${alpha(themeColors.black, 0.8)} 0%, ${alpha(themeColors.primaryAlt, 0.9)} 100%)`,
    black2: `linear-gradient(120deg, ${alpha(themeColors.black, 0.7)} 0%, ${alpha(themeColors.info, 0.6)} 100%)`
  },
  shadows: {
    success: `0px 1px 4px ${alpha(themeColors.success, 0.25)}, 0px 3px 12px 2px ${alpha(themeColors.success, 0.35)}`,
    error: `0px 1px 4px ${alpha(themeColors.error, 0.25)}, 0px 3px 12px 2px ${alpha(themeColors.error, 0.35)}`,
    info: `0px 1px 4px ${alpha(themeColors.info, 0.25)}, 0px 3px 12px 2px ${alpha(themeColors.info, 0.35)}`,
    primary: `0px 1px 4px ${alpha(themeColors.primary, 0.25)}, 0px 3px 12px 2px ${alpha(themeColors.primary, 0.35)}`,
    warning: `0px 1px 4px ${alpha(themeColors.warning, 0.25)}, 0px 3px 12px 2px ${alpha(themeColors.warning, 0.35)}`,
    card: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    cardSm: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px',
    cardLg: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px'
  },
  layout: {
    general: {
      bodyBg: '#F8FAFC'
    },
    sidebar: {
      background: themeColors.white,
      textColor: themeColors.secondary,
      dividerBg: '#E2E8F0',
      menuItemColor: '#475569',
      menuItemColorActive: themeColors.primary,
      menuItemBg: themeColors.white,
      menuItemBgActive: '#F1F5F9',
      menuItemIconColor: lighten(themeColors.secondary, 0.3),
      menuItemIconColorActive: themeColors.primary,
      menuItemHeadingColor: darken(themeColors.secondary, 0.3)
    }
  },
  alpha: {
    white: {
      5: alpha(themeColors.white, 0.02),
      10: alpha(themeColors.white, 0.1),
      30: alpha(themeColors.white, 0.3),
      50: alpha(themeColors.white, 0.5),
      70: alpha(themeColors.white, 0.7),
      100: themeColors.white
    },
    trueWhite: {
      5: alpha(themeColors.white, 0.02),
      10: alpha(themeColors.white, 0.1),
      30: alpha(themeColors.white, 0.3),
      50: alpha(themeColors.white, 0.5),
      70: alpha(themeColors.white, 0.7),
      100: themeColors.white
    },
    black: {
      5: alpha(themeColors.black, 0.02),
      10: alpha(themeColors.black, 0.1),
      30: alpha(themeColors.black, 0.3),
      50: alpha(themeColors.black, 0.5),
      70: alpha(themeColors.black, 0.7),
      100: themeColors.black
    }
  },
  secondary: {
    lighter: alpha(themeColors.secondary, 0.1),
    light: lighten(themeColors.secondary, 0.3),
    main: themeColors.secondary,
    dark: darken(themeColors.secondary, 0.2)
  },
  primary: {
    lighter: alpha(themeColors.primary, 0.1),
    light: lighten(themeColors.primary, 0.3),
    main: themeColors.primary,
    dark: darken(themeColors.primary, 0.2)
  },
  success: {
    lighter: alpha(themeColors.success, 0.1),
    light: lighten(themeColors.success, 0.3),
    main: themeColors.success,
    dark: darken(themeColors.success, 0.2)
  },
  warning: {
    lighter: alpha(themeColors.warning, 0.1),
    light: lighten(themeColors.warning, 0.3),
    main: themeColors.warning,
    dark: darken(themeColors.warning, 0.2)
  },
  error: {
    lighter: alpha(themeColors.error, 0.1),
    light: lighten(themeColors.error, 0.3),
    main: themeColors.error,
    dark: darken(themeColors.error, 0.2)
  },
  info: {
    lighter: alpha(themeColors.info, 0.1),
    light: lighten(themeColors.info, 0.3),
    main: themeColors.info,
    dark: darken(themeColors.info, 0.2)
  }
};

export const ModernMintTheme = createTheme({
  colors: {
    gradients: colors.gradients,
    shadows: colors.shadows,
    alpha: colors.alpha,
    secondary: colors.secondary,
    primary: colors.primary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info
  },
  general: {
    reactFrameworkColor: '#00D8FF',
    borderRadiusSm: '8px',
    borderRadius: '12px',
    borderRadiusLg: '16px',
    borderRadiusXl: '20px'
  },
  sidebar: {
    background: colors.layout.sidebar.background,
    textColor: colors.layout.sidebar.textColor,
    dividerBg: colors.layout.sidebar.dividerBg,
    menuItemColor: colors.layout.sidebar.menuItemColor,
    menuItemColorActive: colors.layout.sidebar.menuItemColorActive,
    menuItemBg: colors.layout.sidebar.menuItemBg,
    menuItemBgActive: colors.layout.sidebar.menuItemBgActive,
    menuItemIconColor: colors.layout.sidebar.menuItemIconColor,
    menuItemIconColorActive: colors.layout.sidebar.menuItemIconColorActive,
    menuItemHeadingColor: colors.layout.sidebar.menuItemHeadingColor,
    boxShadow: colors.shadows.cardSm,
    width: '280px'
  },
  header: {
    height: '80px',
    background: colors.alpha.white[100],
    boxShadow: colors.shadows.cardSm,
    textColor: colors.secondary.main
  },
  spacing: 8,
  palette: {
    common: {
      black: colors.alpha.black[100],
      white: colors.alpha.white[100]
    },
    mode: 'light',
    primary: {
      light: colors.primary.light,
      main: colors.primary.main,
      dark: colors.primary.dark,
      contrastText: colors.alpha.white[100]
    },
    secondary: {
      light: colors.secondary.light,
      main: colors.secondary.main,
      dark: colors.secondary.dark,
      contrastText: colors.alpha.white[100]
    },
    error: {
      light: colors.error.light,
      main: colors.error.main,
      dark: colors.error.dark,
      contrastText: colors.alpha.white[100]
    },
    warning: {
      light: colors.warning.light,
      main: colors.warning.main,
      dark: colors.warning.dark,
      contrastText: colors.alpha.white[100]
    },
    info: {
      light: colors.info.light,
      main: colors.info.main,
      dark: colors.info.dark,
      contrastText: colors.alpha.white[100]
    },
    success: {
      light: colors.success.light,
      main: colors.success.main,
      dark: colors.success.dark,
      contrastText: colors.alpha.white[100]
    },
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
      A100: '#F3F4F6',
      A200: '#E5E7EB',
      A400: '#9CA3AF',
      A700: '#374151'
    },
    text: {
      primary: colors.alpha.black[100],
      secondary: colors.alpha.black[70],
      disabled: colors.alpha.black[50]
    },
    background: {
      paper: colors.alpha.white[100],
      default: colors.layout.general.bodyBg
    },
    action: {
      active: colors.alpha.black[100],
      hover: colors.primary.lighter,
      hoverOpacity: 0.1,
      selected: colors.alpha.black[10],
      selectedOpacity: 0.1,
      disabled: colors.alpha.black[50],
      disabledBackground: colors.alpha.black[5],
      disabledOpacity: 0.38,
      focus: colors.alpha.black[10],
      focusOpacity: 0.05,
      activatedOpacity: 0.12
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1840
    }
  },
  components: {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(darken(themeColors.primaryAlt, 0.4), 0.2),
          backdropFilter: 'blur(3px)',
          '&.MuiBackdrop-invisible': {
            backgroundColor: 'transparent',
            backdropFilter: 'blur(3px)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: colors.shadows.card,
          transition: 'all .2s',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: colors.shadows.cardLg
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
          paddingLeft: 16,
          paddingRight: 16,
          borderRadius: 8,
          '&:hover': {
            transform: 'translateY(-1px)'
          }
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: colors.shadows.cardSm
          }
        }
      }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false
      },
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    },
    MuiToggleButton: {
      defaultProps: {
        disableRipple: true
      },
      styleOverrides: {
        root: {
          color: colors.primary.main,
          background: colors.alpha.white[100],
          transition: 'all .2s',
          '&:hover, &.Mui-selected, &.Mui-selected:hover': {
            color: colors.alpha.white[100],
            background: colors.primary.main,
            boxShadow: colors.shadows.cardSm
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: 8,
          transition: 'all .2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: colors.shadows.cardSm
          }
        },
        sizeSmall: {
          padding: 4
        }
      }
    }
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: 35
    },
    h2: {
      fontWeight: 700,
      fontSize: 30
    },
    h3: {
      fontWeight: 700,
      fontSize: 25,
      lineHeight: 1.4,
      color: colors.alpha.black[100]
    },
    h4: {
      fontWeight: 700,
      fontSize: 16
    },
    h5: {
      fontWeight: 700,
      fontSize: 14
    },
    h6: {
      fontSize: 15
    },
    body1: {
      fontSize: 14
    },
    body2: {
      fontSize: 14
    },
    button: {
      fontWeight: 600
    },
    caption: {
      fontSize: 13,
      textTransform: 'uppercase',
      color: colors.alpha.black[50]
    },
    subtitle1: {
      fontSize: 14,
      color: colors.alpha.black[70]
    },
    subtitle2: {
      fontWeight: 400,
      fontSize: 15,
      color: colors.alpha.black[70]
    }
  }
});

export default ModernMintTheme; 