import { useEffect, useState } from 'react'

import { Comment, Info, NotificationsNone } from '@mui/icons-material'
import { Box, List, Popover, Stack, Typography } from '@mui/material'

import NotifyItem from './NotifyItem'

import useCommentSocketContext from '~/contexts/useCommentSocketContext'
import notifyApi from '~/features/notify/notifyApi'

const notifyIcons = {
  Comment: <Comment />,
  Info: <Info />
}

const NotifyList = ({
  anchorEl,
  open,
  onClose,
  onNewNotifiesChange,
  newNotifies
}) => {
  const { newNotify } = useCommentSocketContext()
  const [notifies, setNotifies] = useState([])

  const handleMarkAsRead = async (id) => {
    try {
      const updatedNotify = await notifyApi.updateNotify(id, { seen: true })
      setNotifies((prev) =>
        prev.map((notify) =>
          notify.id === updatedNotify.id ? updatedNotify : notify
        )
      )
      const updatedNewNotifies = newNotifies.filter(
        (el) => el.id !== updatedNotify.id
      )
      onNewNotifiesChange(updatedNewNotifies)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (newNotify) {
      setNotifies((prev) => [newNotify, ...prev])
      const updatedNewNotifies = [
        ...notifies.filter((el) => !el.seen),
        newNotify
      ]
      onNewNotifiesChange(updatedNewNotifies)
      console.log(newNotify)
    }
  }, [newNotify])

  useEffect(() => {
    ;(async () => {
      try {
        const notifies = await notifyApi.getUserNotifies()
        setNotifies(notifies)
        const newNotifies = notifies.filter((el) => !el.seen)
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
            {notifies.map((el, index) => (
              <NotifyItem
                key={index}
                message={el.message}
                icon={notifyIcons[el.type]}
                seen={el.seen}
                time={el.createdAt}
                onMarkAsRead={() => handleMarkAsRead(el.id)}
              />
            ))}
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
