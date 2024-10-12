import { memo } from 'react'

import { Box, Typography } from '@mui/material'

import noteUtil from '../exerciseUtil'
import util from '~/utils'

const Segment = memo(
  ({
    isCurrent,
    segment,
    handleSegmentClick = () => {},
    isDictation = false,
    isCheck = false
  }) => {
    const arrayWords = segment.text.split(' ')
    const findWord = (word, dictationWords) => {
      // Kiểm tra xem từ trong mảng words có nằm trong từ hiện tại không
      const cleanWord = word
        .replace(/^[^a-zA-Z0-9]+/, '')
        .replace(/[^a-zA-Z0-9]+$/, '')
        .toLowerCase()

      return dictationWords.find((dictationWord) => {
        // Kiểm tra nếu dictationWord là object chứa thuộc tính word
        if (typeof dictationWord === 'object' && dictationWord.word) {
          return dictationWord.word === cleanWord
        }

        // Nếu dictationWord là string
        return dictationWord === cleanWord
      })
    }

    return (
      <Box
        id={`segment-${segment.start}`} // Đặt id cho mỗi segment
        sx={{
          p: '10px 16px 26px 16px',
          borderBottom: (theme) => theme.app.border,
          backgroundColor: isCurrent
            ? '#94b1bc4d' // Màu nền khác khi segment đang kích hoạt
            : 'transparent',
          cursor: !util.isEmptyFunction(handleSegmentClick) && 'pointer',
          position: 'relative'
        }}
        onClick={() => handleSegmentClick(segment)}
      >
        <Box>
          {arrayWords.map((word, index) => {
            const match = findWord(word, segment.dictationWords)
            return (
              <Typography
                key={index}
                fontSize='14px'
                color={
                  match
                    ? match.isCorrected
                      ? 'success.main'
                      : isCheck
                        ? 'error.main'
                        : ''
                    : 'text.hightlight'
                }
                variant='span'
              >
                {isDictation && !isCheck && match && !segment.isCompleted
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
            color: 'warning.main'
          }}
        >
          {noteUtil.formatTime(segment.start)}
        </Typography>
      </Box>
    )
  }
)

export default Segment
