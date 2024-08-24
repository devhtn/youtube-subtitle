import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  app: {
    headerHeight: '56px',
    sidebarWidth: '240px'
  },
  typography: {
    fontFamily: 'Nunito, sans-serif'
  },
  palette: {
    text: {
      primary: '#212121',
      secondary: '#737373'
    }
  },
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: '#959595' // Màu cho icon SVG
        }
      }
    }
  }
})

export default theme
