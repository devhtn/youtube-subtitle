import 'react-toastify/dist/ReactToastify.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { PersistGate } from 'redux-persist/integration/react'

import App from './App'

import theme from './config/theme'
import { persistor, store } from './redux/store'
import env from './config/env'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
            <ToastContainer />
            <App />
          </GoogleOAuthProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
