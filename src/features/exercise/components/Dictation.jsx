import { memo, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Flag, NoteAlt, Replay, SkipNext } from '@mui/icons-material'
import { Box, Button, FormControl, Typography } from '@mui/material'
import _ from 'lodash'

import SeekBarDictation from './SeekBarDictation'
import Segment from './Segment'
import SegmentNote from './SegmentNote'
import SegmentNoteForm from './SegmentNoteForm'
import TextField from '~/components/fields/TextField'

import exerciseApi from '../exerciseApi'
import customToast from '~/config/toast'

const Dictation = memo(
  ({
    exercise,
    dictation,
    setDictation,
    handlePlay,
    currentTime,
    setCurrentSegment
  }) => {
    const [validSegments, setValidSegments] = useState([])
    const [segmentIndex, setSegmentIndex] = useState(null)
    const [resultSegment, setResultSegment] = useState({})
    const [isCheck, setIsCheck] = useState(false)
    const [markers, setMarkers] = useState([])
    const [duration, setDuration] = useState(0)
    const [playTime, setPlayTime] = useState({})
    const [openSegmentNoteForm, setOpenSegmentNoteForm] = useState(false)
    const [segmentNote, setSegmentNote] = useState(null)
    const segments = exercise.segments
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
      let totalCorrectedWords = 0
      const resultDictationWords = segments[segmentIndex].dictationWords.map(
        (dictationWord) => {
          const found = inputWords.includes(dictationWord.toLowerCase())
          if (found) {
            totalCorrectedWords++
          }
          return {
            word: dictationWord,
            isCorrected: !!found
          }
        }
      )

      const resultSegment = _.cloneDeep(segments[segmentIndex])
      resultSegment.dictationWords = resultDictationWords
      setResultSegment(resultSegment)
      if (
        totalCorrectedWords === segments[segmentIndex].dictationWords.length
      ) {
        const newDictation = await exerciseApi
          .updateDictationProcess(dictation.id, segments[segmentIndex].id)
          .catch(() => customToast.error('Lỗi server!'))
        if (newDictation) {
          setDictation(newDictation)
          customToast.success(`Chúc mừng! Bạn đã trả lời chính xác!`)
          setValidSegments((prevValidSegments) =>
            prevValidSegments.filter(
              (segment) => segment.segmentId !== segments[segmentIndex].id
            )
          )
        }
      } else customToast.error('Cố gắng hơn ở lần sau bạn nhé!')
      customToast.stop(id)
      setIsCheck(true)
    }

    const handlePlayTime = (segmentIndex) => {
      console.log(segmentIndex)
      if (segmentIndex !== null) {
        let prev = segmentIndex === 0 ? 0 : 1
        let next = segmentIndex === segments.length - 1 ? 0 : 1
        return {
          start: segments[segmentIndex - prev].start,
          end: segments[segmentIndex + next].end
        }
      }
    }

    // get random segment
    const getRandomSegment = () => {
      // Lấy ngẫu nhiên một phần tử từ mảng validSegments
      const randomValidSegment =
        validSegments[Math.floor(Math.random() * validSegments.length - 1)]

      // Tìm kiếm segment được lưu trữ trong dictation thõa mãn segment đã random
      const findSegmentNote =
        dictation.segments.find((el) => el.segmentId === randomValidSegment.id)
          ?.note || null

      setSegmentNote(findSegmentNote)

      // Tìm chỉ số của phần tử này trong mảng gốc segments
      const randomIndex = segments.indexOf(randomValidSegment)
      const playTime = handlePlayTime(randomIndex)
      setPlayTime(playTime)

      // Cập nhật trạng thái
      setSegmentIndex(randomIndex)
      setIsCheck(false)
      setResultSegment(segments[randomIndex])
      handlePlay(playTime.start, playTime.end)
      setDuration(playTime.end - playTime.start)
      setMarkers([
        {
          value:
            randomValidSegment.start -
            (randomIndex ? segments[randomIndex - 1].start : 0)
        },
        {
          value:
            randomValidSegment.end -
            (randomIndex ? segments[randomIndex - 1].start : 0)
        }
      ])
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

    const handleStart = () => {
      getRandomSegment()
    }

    // effect
    useEffect(() => {
      const completedSegmentIds = dictation.segments
        .filter((segment) => segment.isCompleted) // Lọc ra các segment đã hoàn thành
        .map((segment) => segment.segmentId)
      // Lọc ra các phần tử có ít nhất một dictationWord với isCompleted là false
      const validSegments = segments.filter(
        (segment) => !completedSegmentIds.includes(segment.segmentId)
      )
      setValidSegments(validSegments)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      setCurrentSegment(segments[segmentIndex])
    }, [segmentIndex])

    return (
      <Box sx={{ p: 2 }}>
        {segmentIndex !== null ? (
          <Box>
            <form onSubmit={handleSubmit(onSubmit)} onClick={handleFormSubmit}>
              <Box>
                {segmentIndex > 0 && (
                  <Segment segment={segments[segmentIndex - 1]} />
                )}
                <Segment
                  isCurrent={true}
                  segment={resultSegment}
                  isDictation={true}
                  isCheck={isCheck}
                />
                {segmentIndex < segments.length - 1 && (
                  <Segment segment={segments[segmentIndex + 1]} />
                )}
              </Box>
              {/* Seek bar */}
              <SeekBarDictation
                duration={duration}
                marks={markers}
                start={
                  segmentIndex
                    ? segments[segmentIndex - 1].start
                    : segments[segmentIndex].start
                }
                currentTime={
                  currentTime -
                  (segmentIndex
                    ? segments[segmentIndex - 1].start
                    : segments[segmentIndex].start)
                }
                handlePlay={handlePlay}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  justifyItems: 'center',
                  marginTop: 2
                }}
              >
                <Button
                  onClick={() => {
                    handlePlay(playTime.start, playTime.end)
                  }}
                >
                  <Replay sx={{ color: 'warning.main' }} />
                </Button>

                <Box display='flex' alignItems='center'>
                  {/* Hiển thị số thứ tự segment */}
                  <Typography component='div' marginRight={2}>
                    {segmentIndex + 1} / {segments.length}
                  </Typography>

                  {/* Nút click để đi tới segment kế tiếp */}
                  <Box>
                    <Button
                      onClick={() => handleSegmentNext()}
                      disabled={!isCheck}
                    >
                      <SkipNext
                        sx={{
                          color: isCheck ? 'warning.main' : 'action.disabled'
                        }}
                      />
                    </Button>
                  </Box>
                </Box>
                <Button
                  disabled={!isCheck}
                  onClick={() => {
                    setIsCheck(true)
                    setOpenSegmentNoteForm(true)
                  }}
                >
                  <NoteAlt
                    sx={{ color: isCheck ? 'warning.main' : 'action.disabled' }}
                  />
                </Button>
                <Button
                  disabled={isCheck}
                  onClick={() => {
                    setIsCheck(true)
                  }}
                >
                  <Flag
                    sx={{
                      color: !isCheck ? 'warning.main' : 'action.disabled'
                    }}
                  />
                </Button>
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
              />

              <FormControl margin='normal' fullWidth>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    style={{ textTransform: 'none' }}
                    variant='contained'
                    color='primary'
                    type='submit'
                    fullWidth
                    disabled={isCheck}
                  >
                    Kiểm tra kết quả
                  </Button>
                </Box>
              </FormControl>
            </form>
            {/* note */}
            {isCheck && segmentNote && <SegmentNote note={segmentNote} />}
            <SegmentNoteForm
              segmentNote={segmentNote}
              setSegmentNote={setSegmentNote}
              selectedSegment={validSegments[segmentIndex]}
              open={openSegmentNoteForm}
              setOpen={setOpenSegmentNoteForm}
              dictation={dictation}
              setDictation={setDictation}
              resultSegment={resultSegment}
            />
          </Box>
        ) : (
          <Button
            onClick={handleStart}
            variant='contained'
            color='primary'
            type='submit'
            fullWidth
          >
            Click to start
          </Button>
        )}
      </Box>
    )
  }
)

export default Dictation
