import { useNavigate } from 'react-router-dom'

import { Box, Button, Grid, Typography } from '@mui/material'

const Intro = () => {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/login')
  }
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        backgroundColor: '#f5f5f5'
      }}
    >
      {/* Container để giữ nội dung */}
      {/* Tiêu đề chính */}
      <Typography variant='h3' sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        Ứng dụng hỗ trợ học tiếng Anh qua video trực tuyến
      </Typography>

      {/* Mô tả ngắn */}
      <Typography
        variant='h6'
        sx={{ marginBottom: 3, color: 'text.secondary' }}
      >
        Ứng dụng giúp bạn học từ vựng tiếng Anh hiệu quả, theo dõi tiến độ học
        qua các video trực tuyến.
      </Typography>

      {/* Giới thiệu về tính năng */}

      {/* Danh sách tính năng */}
      <Grid
        container
        spacing={2}
        justifyContent='center'
        sx={{ marginBottom: 4 }}
      >
        <Grid item xs={12} sm={4}>
          <Box
            display='flex'
            justifyContent='center'
            flexDirection='column'
            alignItems='center'
            gap={1}
          >
            <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
              📚 Học từ vựng
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              Chép chính tả phụ đề của các video yêu thích
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box
            display='flex'
            justifyContent='center'
            flexDirection='column'
            alignItems='center'
            gap={1}
          >
            <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
              🧠 Ghi nhớ lâu
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              Theo dõi từ vựng đã học và dễ dàng ôn lại.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box
            display='flex'
            justifyContent='center'
            flexDirection='column'
            alignItems='center'
            gap={1}
          >
            <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
              🎯 Tiến độ học
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              Xem báo cáo tiến độ học và cải thiện hiệu quả.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Nút để bắt đầu sử dụng ứng dụng */}
      <Button
        variant='contained'
        color='primary'
        size='large'
        href='#start'
        sx={{ padding: '10px 30px', fontSize: '16px' }}
        onClick={handleStart}
      >
        Bắt đầu học ngay
      </Button>
    </Box>
  )
}

export default Intro
