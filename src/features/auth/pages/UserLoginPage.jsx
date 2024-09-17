import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import SubtitlesIcon from '@mui/icons-material/Subtitles'
import { Box, Dialog, DialogContent, Typography } from '@mui/material'
import { GoogleLogin } from '@react-oauth/google'

import authApi from '../authApi'
import { login } from '../authSlice'
import customToast from '~/config/toast'

const UserLoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  const pathname = location.pathname

  const handleSuccess = async (googleResponse) => {
    const id = customToast.loading()
    try {
      const response = await authApi.userLogin(googleResponse)
      dispatch(login(response))
      customToast.stop()
      if (pathname === '/login') navigate('/')
      else window.close()
    } catch (error) {
      customToast.update(id, error.message, 'error')
    }
  }

  return (
    <Dialog maxWidth='xs' fullWidth open={true} aria-labelledby='auth dialog'>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 5 }}
      >
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

        <Box display='flex' justifyContent='center'>
          <Box>
            <Typography
              variant='subtitle2'
              color='textSecondary'
              align='center'
            >
              continue with
            </Typography>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => {
                console.log('Login Failed')
              }}
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
export default UserLoginPage
