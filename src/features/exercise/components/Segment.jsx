import { memo } from 'react'

import { Done } from '@mui/icons-material'
import { Box, Stack, Tooltip, Typography } from '@mui/material'

import util from '~/utils'

const Segment = memo(
  ({
    isCurrent,
    segment,
    onClick = () => {},
    isDictation = false,
    isCheck = false,
    dictationSegment = {}
  }) => {
    const arrayWords = segment.text.split(' ')

    const findWord = (word, dictationWords) => {
      // Kiểm tra xem từ trong mảng words có nằm trong từ hiện tại không
      const cleanWord = word
        .replace(/^[^a-zA-Z0-9]+/, '')
        .replace(/[^a-zA-Z0-9]+$/, '')

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
        id={!isDictation && `segment-${segment.start}`} // Đặt id cho mỗi segment
        sx={{
          p: '10px 16px 26px 16px',
          borderBottom: (theme) => theme.app.border,
          backgroundColor: isCurrent
            ? '#94b1bc4d' // Màu nền khác khi segment đang kích hoạt
            : 'transparent',
          cursor: !util.isEmptyFunction(onClick) && 'pointer',
          position: 'relative'
        }}
        onClick={() => onClick(segment)}
      >
        <Box>
          {arrayWords.map((word, index) => {
            const match = findWord(word, segment.dictationWords)
            return (
              <Tooltip title={segment.tags[index] || ''} key={index}>
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
                      : 'secondary.main'
                  }
                  variant='span'
                >
                  {isDictation && !isCheck && match && !segment.isCompleted
                    ? '____' + ' '
                    : word + ' '}
                </Typography>
              </Tooltip>
            )
          })}
        </Box>

        {/* hiển thị số lần gặp segment */}
        <Stack
          direction='row'
          alignItems='center'
          sx={{ position: 'absolute', bottom: 0, right: '8px' }}
        >
          {dictationSegment.isCompleted && (
            <Done sx={{ color: 'success.main' }} />
          )}
          <Typography color='secondary'>
            {dictationSegment.attemptsCount > 0 &&
              dictationSegment.attemptsCount}
          </Typography>
        </Stack>
      </Box>
    )
  }
)

export default Segment
