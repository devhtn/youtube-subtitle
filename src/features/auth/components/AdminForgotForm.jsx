import * as React from 'react'
import { useForm } from 'react-hook-form'

import MailOutlineIcon from '@mui/icons-material/MailOutline'
import { Box, Button, FormControl, InputAdornment } from '@mui/material'

import TextField from '~/components/fields/TextField'

const AdminForgotForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: ''
    }
  })
  console.log(errors)

  const [showPassword, setShowPassword] = React.useState(false)

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }
  const onSubmit = (data) => {
    console.log(data)
  }
  return (
    <Box p={2}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          name='email'
          control={control}
          rules={{
            required: 'Email is required' // Thông báo lỗi khi field này bị bỏ trống
          }}
          placeholder='Email'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <MailOutlineIcon color={errors.username ? 'error' : 'action'} />
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
            Reset my password
          </Button>
        </FormControl>
      </form>
    </Box>
  )
}
export default AdminForgotForm
