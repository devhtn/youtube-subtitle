import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import SubtitlesIcon from '@mui/icons-material/Subtitles'
import {
  Box,
  Dialog,
  DialogContent,
  Tab,
  Tabs,
  Typography
} from '@mui/material'

import AdminForgotForm from '../components/AdminForgotForm'
import AdminLoginForm from '../components/AdminLoginForm'

const AdminLoginPage = () => {
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
  if (authIndex === 2) return <AdminForgotForm {...{ gobackToSignIn }} />
  return (
    <Dialog maxWidth='xs' fullWidth open={true} aria-labelledby='auth dialog'>
      <DialogContent sx={{ py: 5 }}>
        <Box
          onClick={() => navigate('/')}
          sx={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}
        >
          <SubtitlesIcon sx={{ fontSize: 30, color: '#ff0000' }} />

          <Typography
            variant='h6'
            noWrap
            component='div'
            sx={{
              display: { xs: 'none', sm: 'block' },
              fontWeight: 'bold'
            }}
          >
            YTSub
          </Typography>
        </Box>
        <Tabs
          variant='fullWidth'
          value={authIndex}
          centered
          onChange={tabChange}
          aria-label='auth tabs'
        >
          <Tab label='Login' tabIndex={0} />
          <Tab label='Forgot' tabIndex={1} />
        </Tabs>
        {(() => {
          switch (authIndex) {
            case 0:
              return <AdminLoginForm {...{ goToForget, goToSignUp }} />
            case 1:
              return <AdminForgotForm {...{ gobackToSignIn }} />
            default:
              return null
          }
        })()}
      </DialogContent>
    </Dialog>
  )
}
export default AdminLoginPage
