import { memo, useState } from 'react'

import { EditNote, MoreHoriz } from '@mui/icons-material'
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from '@mui/material'

import noteUtil from '../noteUtil'

const Segment = memo(
  ({
    isCurrent,
    segment,
    handleSegmentClick,
    isDictation = false,
    setOpenFormSegmentNote,
    setSelectedSegment
  }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const arrayWords = segment.text.split(' ')

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget)
      event.stopPropagation()
    }
    const handleClose = (event) => {
      setAnchorEl(null)
      event.stopPropagation()
    }

    const findWord = (word, dictationWords) => {
      // Kiểm tra xem từ trong mảng words có nằm trong từ hiện tại không
      const cleanWord = word
        .replace(/^[^a-zA-Z0-9]+/, '')
        .replace(/[^a-zA-Z0-9]+$/, '')
        .toLowerCase()
      return dictationWords.find((el) => el.word === cleanWord)
    }

    return (
      <Box
        id={`subtitle-${segment.start}`} // Đặt id cho mỗi subtitle
        sx={{
          p: '20px 40px 20px 16px',
          borderBottom: `1px solid #ddd`,
          backgroundColor: isCurrent
            ? '#94b1bc4d' // Màu nền khác khi segment đang kích hoạt
            : 'transparent',
          cursor: 'pointer',
          position: 'relative'
        }}
        onClick={() => handleSegmentClick(segment)}
      >
        <Box>
          {arrayWords.map((word, index) => {
            const dictationWord = findWord(word, segment.dictationWords)
            return (
              <Typography
                key={index}
                color={
                  dictationWord
                    ? dictationWord.isCompleted
                      ? 'success.main'
                      : ''
                    : '#000fff'
                }
                variant='span'
                sx={{ mr: '' }}
              >
                {isDictation && dictationWord && !dictationWord.isCompleted
                  ? '____' + ' '
                  : word + ' '}
              </Typography>
            )
          })}
        </Box>

        {/* show start of segment */}
        <Typography
          variant='caption'
          sx={{
            position: 'absolute',
            bottom: 0,
            right: '8px',
            color: '#7bb58a'
          }}
        >
          {noteUtil.formatTime(segment.start)}
        </Typography>

        {/* menu segment */}
        <IconButton
          onClick={(event) => handleClick(event)}
          aria-controls={open ? 'segment-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          className='replay'
          sx={{
            position: 'absolute',
            width: '24px',
            height: '24px',
            top: '6px',
            right: '6px',
            '&:hover': {
              background: '#fff'
            }
          }}
        >
          <MoreHoriz sx={{ fontSize: 16, color: 'secondary.main' }} />
        </IconButton>
        {segment.note && (
          <EditNote
            sx={{
              position: 'absolute',
              width: '20px',
              height: '20px',
              top: '6px',
              right: '38px',
              color: 'secondary.main'
            }}
          />
        )}
        <Menu
          anchorEl={anchorEl}
          id='segment-menu'
          open={open}
          transformOrigin={{
            horizontal: 'right',
            vertical: 'bottom'
          }}
          sx={{ display: 'flex', alignItems: 'center', py: 0 }}
          onClose={(event) => handleClose(event)}
          MenuListProps={{
            sx: { py: 0 } // Điều chỉnh padding cho MenuList
          }}
        >
          <MenuItem
            onClick={(event) => {
              handleClose(event)
              setOpenFormSegmentNote(true)
              setSelectedSegment(segment)
            }}
          >
            <ListItemIcon>
              <EditNote fontSize='small' />
            </ListItemIcon>
            <ListItemText>Ghi chú</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    )
  }
)

export default Segment
