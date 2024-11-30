import { memo } from 'react'

import styled from '@emotion/styled'
import { Done } from '@mui/icons-material'
import { Box, Stack, Tooltip, tooltipClasses, Typography } from '@mui/material'

import util from '~/utils'

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: '14px' // Kích thước chữ
  }
}))

const Segment = memo(
  ({
    isCurrent = false,
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
        id={`segment-${segment.start}`} // Đặt id cho mỗi segment
        sx={{
          p: '10px 16px 26px 16px',
          borderBottom: (theme) => theme.app.border,
          backgroundColor: isCurrent
            ? 'background.highlight' // Màu nền khác khi segment đang kích hoạt
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
              <CustomTooltip title={segment.tags[index] || ''} key={index}>
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
                  fontFamily='Nunito, sans-serif'
                  sx={{
                    // pr: isSelec && !isCheck && 5,
                    '&:hover': {
                      color: 'primary.main' // Đổi màu khi hover
                    }
                  }}
                >
                  {isDictation && !isCheck && match && !segment.isCompleted
                    ? `_${word.length}_` + ' '
                    : word + ' '}
                </Typography>
              </CustomTooltip>
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
