import { createMuiTheme } from '@material-ui/core/styles'

export const themeCreator = (darkMode: boolean) => {
  return createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#3d4260',
      },
      secondary: {
        main: '#292f4f',
      },
      warning: {
        main: '#da4453',
        light: '#f8bfc5',
        dark: '#9a303b'
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
