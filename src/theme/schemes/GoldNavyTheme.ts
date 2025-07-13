import { alpha, createTheme, lighten, darken } from '@mui/material';

const gold = '#FFD700';
const navy = '#223354';
const white = '#fff';

const themeColors = {
  primary: gold,
  secondary: navy,
  success: '#57CA22',
  warning: '#FFA319',
  error: '#FF1943',
  info: '#33C2FF',
  navy: navy,
  white: white,
  primaryAlt: '#B8860B'
};

const colors = {
  gradients: {
    blue1: `linear-gradient(135deg, ${gold} 0%, ${navy} 100%)`,
    blue2: `linear-gradient(135deg, ${navy} 0%, ${gold} 100%)`,
    blue3: `linear-gradient(127.55deg, ${gold} 3.73%, ${navy} 92.26%)`,
    blue4: `linear-gradient(-20deg, ${gold} 0%, ${navy} 100%)`,
    blue5: `linear-gradient(135deg, ${navy} 10%, ${gold} 100%)`,
    orange1: `linear-gradient(135deg, #FCCF31 0%, #F55555 100%)`,
    orange2: `linear-gradient(135deg, #FFD3A5 0%, #FD6585 100%)`,
    orange3: `linear-gradient(120deg, #f6d365 0%, #fda085 100%)`,
    purple1: `linear-gradient(135deg, #43CBFF 0%, #9708CC 100%)`,
    purple3: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
    pink1: `linear-gradient(135deg, #F6CEEC 0%, #D939CD 100%)`,
    pink2: `linear-gradient(135deg, #F761A1 0%, #8C1BAB 100%)`,
    green1: `linear-gradient(135deg, #FFF720 0%, #3CD500 100%)`,
    green2: `linear-gradient(to bottom, #00b09b, #96c93d)`,
    black1: `linear-gradient(100.66deg, #434343 6.56%, #000000 93.57%)`,
    black2: `linear-gradient(60deg, #29323c 0%, #485563 100%)`
  },
  shadows: {
    success: '0px 1px 4px rgba(68, 214, 0, 0.25), 0px 3px 12px 2px rgba(68, 214, 0, 0.35)',
    error: '0px 1px 4px rgba(255, 25, 67, 0.25), 0px 3px 12px 2px rgba(255, 25, 67, 0.35)',
    info: '0px 1px 4px rgba(51, 194, 255, 0.25), 0px 3px 12px 2px rgba(51, 194, 255, 0.35)',
    primary: '0px 1px 4px rgba(255, 215, 0, 0.25), 0px 3px 12px 2px rgba(255, 215, 0, 0.35)',
    warning: '0px 1px 4px rgba(255, 163, 25, 0.25), 0px 3px 12px 2px rgba(255, 163, 25, 0.35)',
    card: '0px 9px 16px rgba(159, 162, 191, .18), 0px 2px 2px rgba(159, 162, 191, 0.32)',
    cardSm: '0px 2px 3px rgba(159, 162, 191, .18), 0px 1px 1px rgba(159, 162, 191, 0.32)',
    cardLg: '0 5rem 14rem 0 rgb(255 255 255 / 30%), 0 0.8rem 2.3rem rgb(0 0 0 / 60%), 0 0.2rem 0.3rem rgb(0 0 0 / 45%)'
  }
};

export const GoldNavyTheme = createTheme({
  colors: {
    gradients: {
      blue1: colors.gradients.blue1,
      blue2: colors.gradients.blue2,
      blue3: colors.gradients.blue3,
      blue4: colors.gradients.blue4,
      blue5: colors.gradients.blue5,
      orange1: colors.gradients.orange1,
      orange2: colors.gradients.orange2,
      orange3: colors.gradients.orange3,
      purple1: colors.gradients.purple1,
      purple3: colors.gradients.purple3,
      pink1: colors.gradients.pink1,
      pink2: colors.gradients.pink2,
      green1: colors.gradients.green1,
      green2: colors.gradients.green2,
      black1: colors.gradients.black1,
      black2: colors.gradients.black2
    },
    shadows: colors.shadows,
    alpha: {
      white: {
        5: alpha(white, 0.02),
        10: alpha(white, 0.1),
        30: alpha(white, 0.3),
        50: alpha(white, 0.5),
        70: alpha(white, 0.7),
        100: white
      },
      trueWhite: {
        5: alpha(white, 0.02),
        10: alpha(white, 0.1),
        30: alpha(white, 0.3),
        50: alpha(white, 0.5),
        70: alpha(white, 0.7),
        100: white
      },
      black: {
        5: alpha(navy, 0.02),
        10: alpha(navy, 0.1),
        30: alpha(navy, 0.3),
        50: alpha(navy, 0.5),
        70: alpha(navy, 0.7),
        100: navy
      }
    },
    secondary: {
      lighter: lighten(navy, 0.85),
      light: lighten(navy, 0.25),
      main: navy,
      dark: darken(navy, 0.2)
    },
    primary: {
      lighter: lighten(gold, 0.85),
      light: lighten(gold, 0.3),
      main: gold,
      dark: darken(gold, 0.2)
    },
    success: {
      lighter: lighten('#57CA22', 0.85),
      light: lighten('#57CA22', 0.3),
      main: '#57CA22',
      dark: darken('#57CA22', 0.2)
    },
    warning: {
      lighter: lighten('#FFA319', 0.85),
      light: lighten('#FFA319', 0.3),
      main: '#FFA319',
      dark: darken('#FFA319', 0.2)
    },
    error: {
      lighter: lighten('#FF1943', 0.85),
      light: lighten('#FF1943', 0.3),
      main: '#FF1943',
      dark: darken('#FF1943', 0.2)
    },
    info: {
      lighter: lighten('#33C2FF', 0.85),
      light: lighten('#33C2FF', 0.3),
      main: '#33C2FF',
      dark: darken('#33C2FF', 0.2)
    }
  },
  general: {
    reactFrameworkColor: gold,
    borderRadiusSm: '6px',
    borderRadius: '10px',
    borderRadiusLg: '12px',
    borderRadiusXl: '16px'
  },
  sidebar: {
    background: navy,
    textColor: gold,
    dividerBg: alpha(white, 0.1),
    menuItemColor: gold,
    menuItemColorActive: white,
    menuItemBg: navy,
    menuItemBgActive: gold,
    menuItemIconColor: gold,
    menuItemIconColorActive: white,
    menuItemHeadingColor: gold,
    boxShadow: '2px 0 3px rgba(255, 215, 0, .18), 1px 0 1px rgba(255, 215, 0, 0.32)',
    width: '290px'
  },
  header: {
    height: '80px',
    background: navy,
    boxShadow: colors.shadows.cardSm,
    textColor: gold
  },
  palette: {
    mode: 'dark',
    primary: {
      light: lighten(gold, 0.3),
      main: gold,
      dark: darken(gold, 0.2)
    },
    secondary: {
      light: lighten(navy, 0.3),
      main: navy,
      dark: darken(navy, 0.2)
    },
    background: {
      default: navy,
      paper: darken(navy, 0.1)
    },
    text: {
      primary: gold,
      secondary: alpha(gold, 0.7),
      disabled: alpha(gold, 0.5)
    }
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: 35 },
    h2: { fontWeight: 700, fontSize: 30 },
    h3: { fontWeight: 700, fontSize: 25 },
    h4: { fontWeight: 700, fontSize: 16 },
    h5: { fontWeight: 700, fontSize: 14 },
    h6: { fontSize: 15 },
    body1: { fontSize: 14 },
    body2: { fontSize: 14 },
    button: { fontWeight: 600 }
  }
}); 