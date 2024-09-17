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
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px' // Hiển thị scrollbar khi hover
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#c4c4c4',
            borderRadius: '10px',
            border: '2px solid transparent',
            backgroundClip: 'content-box'
          },
          '*::-webkit-scrollbar-track': {
            backgroundColor: '#f5f5f5'
          }
        }
      }
    },
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
