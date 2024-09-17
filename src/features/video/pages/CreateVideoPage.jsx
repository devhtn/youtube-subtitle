import React from 'react'

import { Box, Typography } from '@mui/material'

import CreateVideoForm from '../components/CreateVideoForm'

const CreateVideo = () => {
  return (
    <Box>
      <Box sx={{ textAlign: 'center'}}></Box>
      <CreateVideoForm />
    </Box>
  )
}

export default CreateVideo
