import { createMuiTheme } from '@material-ui/core/styles'

export const themeCreator = (darkMode: boolean) => {
  return createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#3d4260',
        light: '#4b566f',
      },
      secondary: {
        main: '#292f4f',
      },
      error: {
        main: '#da4453',
        light: '#f8bfc5',
        dark: '#9a303b',
      },
      warning: {
        main: '#ff9800',
        light: '#ffebba',
        dark: '#765a20',
      },
      info: {
        dark: '#003c75',
        light: '#b3e5fc',
        main: '#2196f3',
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1440,
        xl: 1920,
      },
    },
    typography: {
      button: {
        textTransform: 'none',
      },
    },
  })
}
