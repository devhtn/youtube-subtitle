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
  InputAdornment
} from '@mui/material'

import TextField from '~/components/fields/TextField'

import authApi from '../authApi'
import { login } from '../authSlice'
import customToast from '~/config/toast'

const AdminLoginForm = () => {
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
    setTimeout(async () => {
      try {
        const response = await authApi.adminLogin(data)
        dispatch(login(response))
        customToast.stop()
        if (pathname === '/admin/login') navigate('/admin')
        else window.close()
      } catch (error) {
        customToast.update(id, error.message, 'error')
      }
    }, 1000)
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
          placeholder='Username'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <PersonOutlineIcon
                  color={errors.username ? 'error' : 'action'}
                />
              </InputAdornment>
            )
          }}
        />
        <TextField
          name='password'
          control={control}
          rules={{
            required: 'Password is required' // Thông báo lỗi khi field này bị bỏ trống
          }}
          placeholder='Password'
          type={!showPassword ? 'password' : 'text'}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <LockIcon color={errors.password ? 'error' : 'action'} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password'
                  onClick={togglePassword}
                >
                  {React.createElement(
                    !showPassword ? ShownPasswordIcon : HiddenPasswordIcon,
                    {
                      color: errors.password ? 'error' : 'action'
                    }
                  )}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <FormControl margin='normal' fullWidth>
          <Button
            style={{ textTransform: 'none' }}
            size='large'
            variant='contained'
            color='primary'
            fullWidth
            type='submit'
          >
            Login
          </Button>
        </FormControl>
      </form>
    </Box>
  )
}
export default AdminLoginForm
