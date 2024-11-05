import { useState } from 'react'

import { FilterAlt } from '@mui/icons-material'
import { Backdrop, Box, Button, Chip, Popover } from '@mui/material'

const Filter = () => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <Box position='relative'>
      {/* Backdrop xuất hiện khi Popover mở và không phủ Chip và Popover */}
      {open && (
        <Backdrop
          open={open}
          onClick={handleClosePopover} // Đóng Popover khi nhấp vào overlay
          sx={{
            zIndex: (theme) => theme.zIndex.drawer, // Đặt thấp hơn Chip và Popover
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền tối với độ mờ
            position: 'fixed', // Bao phủ toàn bộ màn hình
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh'
          }}
        />
      )}

      <Box display='flex' gap={1} mb={1}>
        {/* Nút Filter để mở Popover */}
        <Chip
          icon={<FilterAlt />}
          label='Filter'
          variant='outlined'
          onClick={handleOpenPopover}
          sx={{
            cursor: 'pointer',
            backgroundColor: 'white',
            borderRadius: 1,
            zIndex: (theme) => (open ? theme.zIndex.drawer : '') // Đảm bảo Chip luôn hiển thị trên Backdrop
          }}
        />

        {/* Popover với các tùy chọn lọc */}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          PaperProps={{
            sx: {
              overflow: 'visible',
              mt: 1.5,
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: -10,
                left: 10,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(50%) rotate(45deg)',
                zIndex: 0
              }
            }
          }}
        >
          <Box p={2}>Hello</Box>
        </Popover>
      </Box>
    </Box>
  )
}

export default Filter
