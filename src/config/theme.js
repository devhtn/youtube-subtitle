import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  // Những thuộc tính do MUI định nghĩa, ta custom sẽ ảnh hưởng tới nhiều component sẵn có
  // Chỉ nên tự định nghĩa thuộc tính được dùng nhiều nơi hoặc sẽ được thay đổi thường xuyên
  app: {
    headerHeight: '56px',
    sidebarWidth: '300px',
    border: '1px solid #ddd'
  },
  typography: {
    fontFamily: 'Nunito, sans-serif',
    body2: {
      color: '#606060'
    }
  },
  palette: {
    background: {
      secondary: '#f5f5f5db'
    },
    primary: {
      main: '#ff3199'
    },
    secondary: {
      main: '#ffcd5b'
    },
    text: {
      primary: '#2e2e2e',
      secondary: '#606060'
    },
    success: {
      main: '#26db13'
    },
    warning: {
      main: '#ffa211'
    },
    error: {
      main: '#f21616'
    },
    action: {
      disabled: '#a3a3a23b'
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
