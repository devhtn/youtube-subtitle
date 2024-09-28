import { useEffect, useState } from 'react'

import { Box, LinearProgress, Typography } from '@mui/material'

const ProcessDictation = ({ process }) => {
  const [displayedProcess, setDisplayedProcess] = useState(0)

  useEffect(() => {
    // Tăng dần giá trị displayedProcess tới giá trị process trong 0.5 giây
    if (process > displayedProcess) {
      const increment = (process - displayedProcess) / 20 // Chia nhỏ giá trị tăng
      const timer = setTimeout(() => {
        setDisplayedProcess((prev) => Math.min(prev + increment, process))
      }, 25) // Cập nhật sau mỗi 25ms

      return () => clearTimeout(timer) // Dọn dẹp timeout khi component unmount hoặc khi giá trị process thay đổi
    }
  }, [process, displayedProcess])
  return (
    <Box
      sx={{
        height: '50px',
        px: 2,
        backgroundColor: '#fff',
        border: '1px solid #ddd'
      }}
    >
      <Box height={'100%'} display='flex' alignItems='center'>
        {/* Thanh progress */}
        <Box width='100%' mr={1}>
          <LinearProgress variant='determinate' value={process} />
        </Box>
        {/* Label hiển thị % */}
        <Box minWidth={50}>
          <Typography variant='body2' color='success.main'>
            {`${displayedProcess.toFixed(2)}%`}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default ProcessDictation
