import { Controller } from 'react-hook-form'

import { TextField as MuiTextField } from '@mui/material'

const TextField = ({ name, control, label, rules, type, ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue=''
      render={({ field, fieldState: { error } }) => (
        <MuiTextField
          {...field}
          label={label}
          type={type ? type : 'text'}
          error={!!error}
          helperText={error ? error.message : ''}
          fullWidth
          size='small'
          margin='normal'
          {...props}
        />
      )}
    />
  )
}

export default TextField
