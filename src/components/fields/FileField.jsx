  import React from 'react'
  import { Controller } from 'react-hook-form'

  import CloudUploadIcon from '@mui/icons-material/CloudUpload'
  import { Box, Button, FormHelperText, styled } from '@mui/material'

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
  })
  const FileField = ({ name, control, label, rules, ...props }) => {
    const fileInputRef = React.useRef(null)
    const handleFileClick = () => {
      fileInputRef.current.click()
    }
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => {
          return (
            <Box sx={{ mt: 2, mb: 1 }}>
              <VisuallyHiddenInput
                type='file'
                ref={(e) => {
                  fileInputRef.current = e
                  field.ref(e) // Kết nối với ref của react-hook-form
                }}
                onChange={(e) => {
                  field.onChange(e.target.files[0]) // Cập nhật giá trị trong react-hook-form
                }}
                {...props}
              />
              <Button
                variant='contained'
                color='primary'
                startIcon={<CloudUploadIcon sx={{ color: '#fff' }} />}
                onClick={handleFileClick}
              >
                {label}
              </Button>
              <FormHelperText error={true} sx={{ ml: 2 }}>
                {error?.message}
              </FormHelperText>
            </Box>
          )
        }}
      />
    )
  }

  export default FileField
