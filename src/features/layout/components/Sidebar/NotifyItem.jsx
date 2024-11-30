import { cloneElement } from 'react'

import { MarkEmailRead } from '@mui/icons-material'
import {
  Box,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'

import util from '~/utils'

const NotifyItem = ({ message, icon, seen, onMarkAsRead, time }) => {
  return (
    <ListItem
      disablePadding
      sx={{
        position: 'relative',
        borderBottom: (theme) => theme.app.border,
        p: 2,
        '&:hover': {
          cursor: 'pointer',
          backgroundColor: 'rgba(0, 0, 0, 0.05)', // Đổi màu nền khi hover
          '& .icon-button': {
            visibility: !seen && 'visible' // Hiển thị IconButton khi hover
          }
        }
      }}
    >
      <ListItemIcon>
        {cloneElement(icon, { sx: { color: seen ? '' : 'primary.main' } })}
      </ListItemIcon>
      <ListItemText
        primary={message}
        primaryTypographyProps={{
          fontSize: '14px',
          fontWeight: seen ? '' : 'bold'
        }}
      />
      {/* IconButton đánh dấu đã xem */}
      <IconButton
        size='small'
        className='icon-button'
        sx={{
          visibility: 'hidden' // Ẩn IconButton mặc định
        }}
        onClick={onMarkAsRead}
      >
        <MarkEmailRead />
      </IconButton>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 4,
          fontSize: '12px',
          color: 'text.secondary'
        }}
      >
        <Typography variant='caption'>{util.getTimeSince(time)}</Typography>
      </Box>
    </ListItem>
  )
}

export default NotifyItem
