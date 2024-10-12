import ReactAvatar from 'react-avatar'

import {
  CheckCircle,
  CheckCircleOutline,
  Done,
  FavoriteBorder,
  HowToReg,
  ThumbUpOffAlt
} from '@mui/icons-material'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  List,
  ListItem,
  Stack,
  Typography
} from '@mui/material'

import exerciseUtil from '../exerciseUtil'

const CardItem = ({
  exercise,
  isCheckInfo = false,
  onClickThumbnail,
  user = {}
}) => {
  const isLiked = user.likeList?.includes(exercise.id)
  return (
    <>
      <Card>
        {/* Card Media (Image) */}
        <CardMedia
          onClick={() => onClickThumbnail(exercise.videoId)}
          component='img'
          image={exercise.thumbnails[3].url}
          alt={exercise.name}
          sx={{ cursor: 'pointer' }}
        />
        {/* Card Content */}
        <CardContent>
          {/* Name of the Content */}
          <Typography
            variant='body1'
            component='div'
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%' // Đặt chiều rộng tối đa nếu cần thiết
            }}
          >
            {exercise.title}
          </Typography>

          {/* Avatar and Shared By */}
          {exercise.shareUserId ? (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: '4px', gap: 2 }}>
              <ReactAvatar name={exercise.shareUserId.name} size='40' round />
              <Box>
                <Typography variant='body2' color='text.secondary'>
                  Shared by
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {exercise.shareUserId.name}
                </Typography>
              </Box>
            </Box>
          ) : (
            exercise.userId && (
              <Box
                sx={{ display: 'flex', alignItems: 'center', mt: '4px', gap: 2 }}
              >
                <ReactAvatar name={exercise.userId.name} size='40' round />
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Added by
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {exercise.userId.name}
                  </Typography>
                </Box>
              </Box>
            )
          )}

          <Typography variant='body2' sx={{ mt: '4px' }}>
            Thể loại: {exercise.category}
          </Typography>
          <Typography variant='body2' sx={{ mt: '4px' }}>
            Từ vựng cơ bản: {exercise.checkList[0].match} words
          </Typography>
          <Typography variant='body2' sx={{ mt: '4px' }}>
            Từ vựng nâng cao:{' '}
            {exercise.totalDictationUniqWords - exercise.checkList[0].match}{' '}
            words
          </Typography>
          <Typography variant='body2' sx={{ mt: '4px' }}>
            Từ chép chính tả: {exercise.totalDictationWords} words
          </Typography>
          <Typography variant='body2' sx={{ mt: '4px' }}>
            Tốc độ nói: {exercise.avgSpeed} WPM
          </Typography>
          <Typography variant='body2' sx={{ mt: '4px' }}>
            Thời lượng: {exerciseUtil.formatTime(exercise.duration)}
          </Typography>

          {!isCheckInfo && (
            <Box
              display={'flex'}
              alignItems='center'
              justifyContent={'space-between'}
              mt={2}
            >
              <Stack
                direction='row'
                gap={2}
                border={(theme) => theme.app.border}
                padding='2px 10px'
                borderRadius='10px'
              >
                <Stack direction='row'>
                  <HowToReg sx={{ fontSize: '20px' }} />
                  <Typography variant='body2'>
                    {exercise.completedCount}
                  </Typography>
                </Stack>
                <Stack direction='row'>
                  <ThumbUpOffAlt
                    sx={{
                      fontSize: '20px',
                      color: isLiked ? 'warning.main' : ''
                    }}
                  />
                  <Typography variant='body2'>{exercise.likesCount}</Typography>
                </Stack>
              </Stack>
              <Typography variant='body2'>
                {exerciseUtil.getTimeSince(exercise.createdAt)}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default CardItem
