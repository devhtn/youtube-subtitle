import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import LockIcon from '@mui/icons-material/LockOpen'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import ShownPasswordIcon from '@mui/icons-material/VisibilityOffOutlined'
import HiddenPasswordIcon from '@mui/icons-material/VisibilityOutlined'
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  Typography
} from '@mui/material'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

import TextField from '~/components/fields/TextField'

import authApi from '../authApi'
import { login } from '../slices/authSlice'
import customToast from '~/config/toast'
import { persistor } from '~/redux/store'

const LoginForm = ({ goToForget }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  })
  const [showPassword, setShowPassword] = React.useState(false)

  const pathname = location.pathname

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }
  const onSubmit = async (data) => {
    const id = customToast.loading()
    try {
      const token = await authApi.login(data)
      dispatch(login(token))
      // Đợi redux persist
      await persistor.flush()
      customToast.stop()
      const { role } = jwtDecode(token)
      if (pathname === '/login') {
        if (['admin'].includes(role)) navigate('/statistic/admin')
        else navigate('/exercise/playlist')
        customToast.success('Bạn đã đăng nhập thành công!')
      } else window.close()
    } catch (error) {
      customToast.update(id, error.data.message, 'error')
    }
  }
  const handleSuccess = async (googleResponse) => {
    const id = customToast.loading()
    try {
      const response = await authApi.googleLogin(googleResponse)
      dispatch(login(response))
      customToast.stop()
      if (pathname === '/login') navigate('/exercise/playlist')
      else window.close()
    } catch (error) {
      customToast.update(id, error.data.message, 'error')
    }
  }
  return (
    <Box p={2}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          name='username'
          control={control}
          rules={{
            required: 'Username is required' // Thông báo lỗi khi field này bị bỏ trống
          }}
          placeholder='Tên đăng nhập'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <PersonOutlineIcon
                  sx={{ color: errors.username ? 'error.main' : '' }}
                />
              </InputAdornment>
            )
          }}
          autoComplete='username'
        />
        <TextField
          name='password'
          control={control}
          rules={{
            required: 'Password is required' // Thông báo lỗi khi field này bị bỏ trống
          }}
          placeholder='Mật khẩu'
          type={!showPassword ? 'password' : 'text'}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <LockIcon sx={{ color: errors.password ? 'error.main' : '' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password'
                  onClick={togglePassword}
                >
                  {React.createElement(
                    !showPassword ? ShownPasswordIcon : HiddenPasswordIcon
                  )}
                </IconButton>
              </InputAdornment>
            )
          }}
          autoComplete='password'
        />

        <Typography
          variant='body2'
          align='right'
          style={{ cursor: 'pointer' }}
          onClick={goToForget}
        >
          Quên mật khẩu ?
        </Typography>

        <FormControl margin='normal' fullWidth>
          <Button
            style={{ textTransform: 'none' }}
            size='large'
            variant='contained'
            fullWidth
            type='submit'
          >
            Đăng nhập
          </Button>
        </FormControl>
      </form>
      <Box display='flex' justifyContent='center'>
        <Box>
          <Typography variant='subtitle2' align='center'>
            hoặc đăng nhập, đăng ký với
          </Typography>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
              console.log('Login Failed')
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}
export default LoginForm
