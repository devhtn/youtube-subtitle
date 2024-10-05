import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Box, Button, Container, Typography } from '@mui/material'

import useAuth from '~/hooks/useAuth'

const NotFound = () => {
  const navigate = useNavigate()
  const auth = useAuth()

  const handleGoHome = () => {
    if (auth.role === 'user') navigate('/') // Điều hướng trở về trang chủ
    else navigate('/admin')
  }

  return (
    <Container sx={{ textAlign: 'center', mt: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h2' component='div' gutterBottom>
          404
        </Typography>
        <Typography variant='h5' component='div' gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant='body1' component='p' gutterBottom>
          The page you are looking for does not exist or has been moved.
        </Typography>
      </Box>
      <Button
        variant='contained'
        color='primary'
        onClick={handleGoHome}
        sx={{ mt: 3 }}
      >
        Go to Home
      </Button>
    </Container>
  )
}

export default NotFound
