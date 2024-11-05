import * as React from 'react'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

function CircularProgressWithLabel(props) {
  const getColor = (value) => {
    if (value < 25) return '#FFA500' // Màu vàng
    if (value < 50) return '#fff900' // Màu vàng
    if (value < 75) return '#00BFFF' // Màu xanh dương
    return '#4CAF50' // Màu xanh lá
  }

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant='determinate'
        value={100} // Giá trị cố định để giữ cho vòng tròn nền đầy
        sx={{ color: 'grey.300' }} // Màu mặc định cho vòng tròn nền
      />
      {/* Vòng tròn tiến trình */}
      <CircularProgress
        variant='determinate'
        {...props}
        sx={{
          position: 'absolute',
          color: getColor(props.value) // Sử dụng hàm để lấy màu cho vòng tròn tiến trình
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography
          variant='caption'
          component='div'
          sx={{ color: 'text.secondary' }}
        >
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  )
}

export default function ProcessDictation({ process }) {
  return <CircularProgressWithLabel value={process} />
}
