import { memo, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { SkipNext, VolumeUp } from '@mui/icons-material'
import { Box, Button, FormControl, Typography } from '@mui/material'
import _ from 'lodash'

import Segment from './Segment'
import TextField from '~/components/fields/TextField'

import noteApi from '../noteApi'
import customToast from '~/config/toast'
import util from '~/utils'

const Dictation = memo(({ dictation, setDictation, handleSegmentClick, setOpenFormSegmentNote, setSelectedSegment, setShowSegmentNote }) => {
  const [segment, setSegment] = useState({})
  const [segmentIndex, setSegmentIndex] = useState(0)
  const [isCheck, setIsCheck] = useState(false)

  const subs = dictation.subs

  const { control, handleSubmit, reset } = useForm({})

  const onSubmit = async (data) => {
    const id = customToast.loading()
    const inputWords = data.inputWords
      .split(' ')
      .map((word) => {
        const sanitizedWord = word.replace(/[^a-zA-Z0-9']/g, '').toLowerCase()
        return isNaN(sanitizedWord) ? sanitizedWord : sanitizedWord.toString()
      })
      .filter((word) => word.length > 0)
    let corrects = ''
    let countCompletedWords = 0
    const updateDictationWords = segment.dictationWords.map((el) => {
      const found = inputWords.includes(el.word.toLowerCase())
      if (found) {
        el.isCompleted = true
        corrects += ' ' + el.word
        countCompletedWords++
      }
      return el
    })
    const newSegment = _.cloneDeep(segment)
    newSegment.dictationWords = updateDictationWords
    const updateDictation = await noteApi
      .updateSegment({
        id: dictation.id,
        segment: newSegment,
        countCompletedWords
      })
      .catch(() => customToast.error())
    customToast.stop(id)
    if (updateDictation) {
      setDictation(updateDictation)
      if (corrects.trim()) customToast.success(corrects.trim())
      else customToast.warning('Chúc bạn may mắn lần sau!')
    }
    setIsCheck(true)
  }
  // get random segment
  const getRandomSegment = () => {
    // Lọc ra các phần tử có ít nhất một dictationWord với isCompleted là false
    const validSubs = subs.filter((sub) =>
      sub.dictationWords.some((word) => word.isCompleted === false)
    )

    // Kiểm tra nếu có phần tử hợp lệ
    if (validSubs.length === 0) {
      return null // Không có phần tử nào thỏa mãn điều kiện
    }

    // Lấy ngẫu nhiên một phần tử từ mảng validSubs
    const randomIndex = Math.floor(Math.random() * validSubs.length)
    setSegment(validSubs[randomIndex])
    setSegmentIndex(randomIndex + 1)
    handleSegmentClick(validSubs[randomIndex])
    setIsCheck(false)
  }

  const handleSegmentNext = () => {
    getRandomSegment()
    reset()
  }

  const handleFormSubmit = (e) => {
    if (isCheck) {
      e.preventDefault() // Chặn submit nếu isCheck là true
    }
  }
  useEffect(() => {
    getRandomSegment(subs)
  }, [])
  useEffect(() => {
    setShowSegmentNote(isCheck)
  }, [isCheck])
  return (
    <Box sx={{ p: 2 }}>
      <form onSubmit={handleSubmit(onSubmit)} onClick={handleFormSubmit}>
        {!util.isEmptyObject(segment) && (
          <Segment
            isCurrent={true}
            segment={segment}
            handleSegmentClick={handleSegmentClick}
            isDictation={!isCheck}
            setOpenFormSegmentNote={setOpenFormSegmentNote}
            setSelectedSegment={setSelectedSegment}
          />
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            justifyItems: 'center',
            marginTop: 2
          }}
        >
          <Button onClick={() => handleSegmentClick(segment)}>
            <VolumeUp />
          </Button>
          <Button
            style={{ textTransform: 'none' }}
            variant='outlined'
            color='error'
            onClick={() => setIsCheck(true)}
          >
            Show result
          </Button>
          <Box display='flex' alignItems='center'>
            {/* Hiển thị số thứ tự segment */}
            <Typography component='div' marginRight={2}>
              {segmentIndex} / {subs.length}
            </Typography>

            {/* Nút click để đi tới segment kế tiếp */}
            <Box
              sx={{
                '&:hover': {
                  cursor: isCheck ? 'pointer' : 'not-allowed'
                }
              }}
            >
              <Button onClick={() => handleSegmentNext()} disabled={!isCheck}>
                <SkipNext
                  sx={{ color: isCheck ? 'warning.main' : 'action.disabled' }}
                />
              </Button>
            </Box>
          </Box>
        </Box>
        <TextField
          name='inputWords'
          control={control}
          rules={{
            required: 'Bạn cần nhập từ để kiểm tra câu trả lời  ' // Thông báo lỗi khi field này bị bỏ trống
          }}
          placeholder='Nhập tất cả những gì bạn nghe được!'
          autoComplete='off'
          disabled={isCheck}
          sx={{
            '& .MuiInputBase-root': {
              cursor: isCheck ? 'not-allowed' : 'initial' // Đặt biểu tượng cấm khi hover
            },
            '& .MuiOutlinedInput-input': {
              cursor: isCheck ? 'not-allowed' : 'initial' // Hiển thị biểu tượng cấm khi hover vào phần input
            }
          }}
        />

        <FormControl margin='normal' fullWidth>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {!isCheck && (
              <Button
                style={{ textTransform: 'none' }}
                variant='contained'
                color='primary'
                type='submit'
              >
                Check answer
              </Button>
            )}
          </Box>
        </FormControl>
      </form>
    </Box>
  )
})

export default Dictation
