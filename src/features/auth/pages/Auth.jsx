import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import { Subtitles } from '@mui/icons-material'
import {
  Box,
  Dialog,
  DialogContent,
  Tab,
  Tabs,
  Typography
} from '@mui/material'

import ForgetForm from '../components/ForgetForm'
import AdminLoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'

const Auth = () => {
  const navigate = useNavigate()
  const [authIndex, setAuthIndex] = React.useState(0)

  const tabChange = (event, tabValue) => {
    event.preventDefault()
    setAuthIndex(tabValue)
  }
  const goToForget = () => {
    setAuthIndex(2)
  }
  const goToSignUp = () => {
    setAuthIndex(1)
  }
  const gobackToSignIn = () => {
    setAuthIndex(0)
  }
  if (authIndex === 2) return <ForgetForm {...{ gobackToSignIn }} />
  return (
    <Dialog maxWidth='xs' fullWidth open={true} aria-labelledby='auth dialog'>
      <DialogContent sx={{ py: 5 }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Subtitles sx={{ fontSize: 30, color: 'primary.main' }} />

          <Typography
            variant='h6'
            noWrap
            component='div'
            sx={{
              display: { xs: 'none', sm: 'block' },
              fontWeight: 'bold'
            }}
          >
            YTNOTE
          </Typography>
        </Box>
        <Tabs
          variant='fullWidth'
          value={authIndex}
          centered
          onChange={tabChange}
          aria-label='auth tabs'
        >
          <Tab label='Đăng nhập' tabIndex={0} />
          <Tab label='Đăng ký' tabIndex={1} />
        </Tabs>
        {(() => {
          switch (authIndex) {
            case 0:
              return <AdminLoginForm {...{ goToForget, goToSignUp }} />
            case 1:
              return <SignupForm {...{ gobackToSignIn }} />
            default:
              return null
          }
        })()}
      </DialogContent>
    </Dialog>
  )
}
export default Auth
