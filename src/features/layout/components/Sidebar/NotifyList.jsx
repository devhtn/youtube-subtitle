import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { NotificationsNone } from '@mui/icons-material'
import { Box, List, Popover, Stack, Typography } from '@mui/material'

import NotifyItem from './NotifyItem'

import notifyApi from '~/features/notify/notifyApi'
import useSocketListener from '~/hooks/useSocketListener'
import util from '~/utils'

const imageMapping = [
  {
    type: 'Exercise',
    getImage: (el) => el.relatedId?.thumbnails[3]?.url
  },
  {
    type: 'Comment',
    getImage: (el) =>
      el.relatedId.userId?.picture || util.getRoboHashUrl(el.userId.id)
  }
]

const NotifyList = ({
  anchorEl,
  open,
  onClose,
  onNewNotifiesChange,
  userId
}) => {
  const navigate = useNavigate()

  const [commentNotify, setCommentNotify] = useState({})
  const [exerciseNotify, setExerciseNotify] = useState({})
  useSocketListener(userId, 'comment', (data) => {
    setCommentNotify(data)
  })
  useSocketListener(userId, 'exercise', (data) => {
    setExerciseNotify(data)
    console.log(data)
  })

  const [newNotifies, setNewNotifies] = useState([])
  const [notifies, setNotifies] = useState([])
  console.log(notifies)

  const handleGetImage = (el) => {
    const mapping = imageMapping.find((item) => item.type === el.type)
    return mapping ? mapping.getImage(el) : null
  }

  const handleClick = (notify) => {
    if (notify.type === 'Comment') {
      const exerciseId = notify.relatedId.exerciseId
      const relatedId = notify.relatedId.id
      navigate(`/exercise/preview/${exerciseId}/?commentId=${relatedId}`)
    }

    if (notify.type === 'Exercise') {
      const exerciseId = notify.relatedId.id
      navigate(`/exercise/preview/${exerciseId}`)
    }

    if (notify.type === 'Word') {
      navigate(`/exercise/playlist?tab=1`)
    }
    if (!notify.seen) handleMarkAsRead(notify.id)

    onClose()
  }

  const handleMarkAsRead = async (id) => {
    try {
      const updatedNotify = await notifyApi.updateNotify(id, { seen: true })
      setNotifies((prev) =>
        prev.map((notify) =>
          notify.id === updatedNotify.id
            ? { ...notify, seen: true } // Cập nhật chỉ thuộc tính `seen`
            : notify
        )
      )
      const updatedNewNotifies = newNotifies.filter(
        (el) => el.id !== updatedNotify.id
      )
      setNewNotifies(updatedNewNotifies)
      onNewNotifiesChange(updatedNewNotifies)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (commentNotify) {
      setNotifies((prev) => [commentNotify, ...prev])
      const updatedNewNotifies = [
        ...notifies.filter((el) => !el.seen),
        commentNotify
      ]
      onNewNotifiesChange(updatedNewNotifies)
    }
  }, [commentNotify])

  useEffect(() => {
    if (exerciseNotify) {
      setNotifies((prev) => [exerciseNotify, ...prev])
      const updatedNewNotifies = [
        ...notifies.filter((el) => !el.seen),
        exerciseNotify
      ]
      onNewNotifiesChange(updatedNewNotifies)
    }
  }, [exerciseNotify]) // Gộp lại đc không, trả lời tiếng việt

  useEffect(() => {
    ;(async () => {
      try {
        const notifies = await notifyApi.getUserNotifies()
        setNotifies(notifies)
        const newNotifies = notifies.filter((el) => !el.seen)
        setNewNotifies(newNotifies)
        onNewNotifiesChange(newNotifies)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])
  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
    >
      <Box
        sx={{
          width: 500,
          minHeight: 500,
          p: 2,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Thông báo
        </Typography>
        {notifies.length > 0 ? (
          <List>
            {notifies.map((el, index) => {
              return (
                <Box key={index} onClick={() => handleClick(el)}>
                  <NotifyItem
                    message={el.message}
                    seen={el.seen}
                    image={handleGetImage(el)}
                    type={el.type}
                    time={el.createdAt}
                    onMarkAsRead={() => handleMarkAsRead(el.id)}
                    subText={el.relatedId?.content}
                  />
                </Box>
              )
            })}
          </List>
        ) : (
          <Stack direction='column' flexGrow={1} justifyContent='center'>
            <Typography variant='body2' sx={{ textAlign: 'center' }}>
              Không có thông báo
            </Typography>
            <Stack direction='row' justifyContent='center'>
              <NotificationsNone sx={{ fontSize: 50 }} />
            </Stack>
          </Stack>
        )}
      </Box>
    </Popover>
  )
}

export default NotifyList
