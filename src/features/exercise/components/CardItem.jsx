import { useContext, useEffect, useState } from 'react'

import { Visibility } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  Typography
} from '@mui/material'
import _ from 'lodash'

import CardAction from './CardAction'

import exerciseUtil from '../exerciseUtil'

const CardItem = ({ exercise, isCheckInfo = false, handlePreview }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  return (
    <>
      <Card>
        <Box
          sx={{
            position: 'relative',
            paddingTop: '56.25%', // Tỷ lệ 16:9
            '&:hover .media-icons': {
              opacity: 1 // Hiển thị các biểu tượng khi hover vào Box
            }
          }}
        >
          {/* Card Media (Image) */}
          {!isImageLoaded && (
            <Skeleton
              variant='rectangular'
              animation='wave'
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            />
          )}
          <CardMedia
            component='img'
            image={exercise.thumbnails[3].url}
            alt={exercise.name}
            onLoad={() => setIsImageLoaded(true)} // Khi ảnh tải xong, cập nhật trạng thái
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              cursor: !isCheckInfo ? 'pointer' : '',
              display: isImageLoaded ? 'block' : 'none' // Ẩn ảnh cho đến khi nó tải xong
            }}
          />

          {/* Thẻ thời lượng nằm góc dưới bên phải */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 8, // Cách đáy một chút
              right: 8, // Cách phải một chút
              backgroundColor: 'rgba(0, 0, 0, 0.7)', // Nền mờ
              color: 'white',
              padding: '2px 6px', // Khoảng cách giữa text và viền
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            {exerciseUtil.formatTime(exercise.duration)}
          </Box>

          {/* IconButtons chỉ hiển thị khi hover và nằm chính giữa */}
          {!isCheckInfo && (
            <Box
              className='media-icons'
              onClick={() => handlePreview(exercise.videoId)}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                opacity: 0, // Ẩn các biểu tượng khi không hover
                transition: 'opacity 0.3s ease',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Tạo nền mờ phía sau các biểu tượng
                cursor: 'pointer'
              }}
            >
              <Visibility sx={{ color: 'warning.main', fontSize: '32px' }} />
            </Box>
          )}
        </Box>
        {/* Card Content */}
        <CardContent>
          {/* Name of the Content */}
          <Typography
            variant='body1'
            component='div'
            mb={2}
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
          {!isCheckInfo && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
              <Avatar
                src={
                  !_.isEmpty(exercise.firstUser)
                    ? `https://robohash.org/${exercise.firstUser._id}?set=set4`
                    : ''
                }
                name={exercise.firstUser?.name}
                size='40'
              />
              <Box>
                <Typography variant='body2' color='text.secondary'>
                  First completed by
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {exercise.firstUser?.name || '? ? ?'}
                </Typography>
              </Box>
            </Box>
          )}
          {/* action */}

          {!isCheckInfo && <CardAction exercise={exercise} />}
        </CardContent>
      </Card>
    </>
  )
}

export default CardItem
