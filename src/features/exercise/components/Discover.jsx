import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ThumbDown, ThumbUp } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  List,
  ListItem,
  Typography
} from '@mui/material'

import exerciseApi from '../exerciseApi'
import exerciseUtil from '../exerciseUtil'

const Discover = () => {
  const navigate = useNavigate()

  const [exercises, setExercises] = useState([])

  const handleLike = () => {}
  const handleDislike = () => {}

  const handleExerciseClick = (videoId) => {
    navigate(`/exercise/${videoId}/review`)
  }

  useEffect(() => {
    ;(async () => {
      await exerciseApi
        .getAllExercises()
        .then((exercises) => setExercises(exercises))
    })()
  }, [])
  return (
    <Grid container spacing={3}>
      {exercises.map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item.id}>
          <Card>
            {/* Card Media (Image) */}
            <CardMedia
              component='img'
              image={item.thumbnails[3].url}
              alt={item.name}
              onClick={() => handleExerciseClick(item.videoId)}
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
                {item.title}
              </Typography>

              {/* Avatar and Shared By */}
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Avatar
                  src={item.userId.picture}
                  alt={item.userId.name}
                  sx={{ mr: 1 }}
                />
                <Typography variant='body2' color='text.secondary'>
                  Shared by {item.userId.name}
                </Typography>
              </Box>

              <Typography variant='body2' sx={{ mt: 1 }}>
                Từ vựng: {item.countWords} words
              </Typography>
              <List sx={{ listStyleType: 'disc', p: '0 0 0 32px' }}>
                {item.checkList.map((el) => (
                  <ListItem
                    key={el.id}
                    sx={{ display: 'list-item', px: 0, py: 0 }}
                  >
                    <Typography variant='body2'>
                      {((el.match * 100) / item.countWords).toFixed(0)}% words
                      thuộc {el.name}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              <Typography variant='body2' sx={{ mt: 1 }}>
                Từ chép chính tả: {item.countDictationWords} words
              </Typography>
              <Typography variant='body2' sx={{ mt: 1 }}>
                Tốc độ nói: {item.avgSpeed} words/s
              </Typography>
              <Typography variant='body2' sx={{ mt: 1 }}>
                Thời lượng: {item.duration}
              </Typography>

              <Box display='flex' justifyContent='space-between' mt={1}>
                <Box display='flex' alignItems='center'>
                  <IconButton onClick={() => handleLike(item.id)}>
                    <ThumbUp />
                  </IconButton>
                  <Typography variant='body2'>
                    {item.likesCount || 0}
                  </Typography>
                </Box>

                <Box display='flex' alignItems='center'>
                  <IconButton onClick={() => handleDislike(item.id)}>
                    <ThumbDown />
                  </IconButton>
                  <Typography variant='body2'>
                    {item.dislikesCount || 0}
                  </Typography>
                </Box>

                <Box display='flex' alignItems='center' justifyContent='center'>
                  <Typography variant='body2'>
                    {item.commentsCount || 0} comments
                  </Typography>
                </Box>
              </Box>

              <Box display={'flex'} justifyContent={'space-between'} mt={2}>
                <Typography variant='body2'>10 completed users</Typography>
                <Typography variant='body2'>
                  {exerciseUtil.getTimeSince(item.createdAt)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default Discover
