import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RouterProvider } from 'react-router-dom'

import { CssBaseline, ThemeProvider } from '@mui/material'

import CommentSocketProvider from './contexts/CommentSocketProvider'

import getTheme from './config/theme'
import useAuth from './hooks/useAuth'
import router from './router'

function App() {
  const auth = useAuth()
  const theme = useSelector((state) => state.theme)
  return (
    <>
      <ThemeProvider theme={getTheme(theme.mode)}>
        <CssBaseline />
        <CommentSocketProvider userId={auth.id}>
          <RouterProvider router={router} />
        </CommentSocketProvider>
      </ThemeProvider>
    </>
  )
}

export default App
