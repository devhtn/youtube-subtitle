import { MarkEmailRead, ReportProblem } from '@mui/icons-material'
import {
  Box,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'

import util from '~/utils'

const NotifyItem = ({
  message,
  seen,
  onMarkAsRead,
  time,
  image,
  type,
  subText
}) => {
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
      {image ? (
        <Box
          component='img'
          src={image} // Nếu không có src thì dùng ảnh mặc định
          alt='Notification Icon'
          sx={{
            width: 40,
            height: 40,
            borderRadius: type === 'Exercise' ? '' : '50%',
            objectFit: 'cover',
            border: (theme) =>
              `2px solid ${seen ? theme.palette.grey[300] : theme.palette.primary.main}`,
            mr: 2
          }}
        />
      ) : (
        <ListItemIcon>
          <ReportProblem sx={{ fontSize: '40px', color: 'error.main' }} />
        </ListItemIcon>
      )}
      <ListItemText
        primary={message}
        secondary={subText}
        primaryTypographyProps={{
          fontSize: '14px',
          fontWeight: seen ? '' : 'bold'
        }}
        secondaryTypographyProps={{
          fontSize: '12px',
          color: 'text.secondary',
          whiteSpace: 'nowrap', // Giữ văn bản trên một dòng
          overflow: 'hidden', // Ẩn phần văn bản vượt quá
          textOverflow: 'ellipsis' // Hiển thị dấu ba chấm khi bị cắt
        }}
      />
      {/* IconButton đánh dấu đã xem */}
      <IconButton
        size='small'
        className='icon-button'
        sx={{
          visibility: 'hidden' // Ẩn IconButton mặc định
        }}
        onClick={(e) => {
          e.stopPropagation() // Ngăn chặn sự kiện lan truyền
          onMarkAsRead() // Gọi hàm xử lý khi đánh dấu đã đọc
        }}
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
