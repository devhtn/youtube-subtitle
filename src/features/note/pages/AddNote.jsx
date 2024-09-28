import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Typography
} from '@mui/material'

import TextField from '~/components/fields/TextField'

import noteApi from '../noteApi'
import noteUtil from '../noteUtil'
import customToast from '~/config/toast'
import util from '~/utils'

const AddNote = () => {
  const navigate = useNavigate()
  const { control, handleSubmit } = useForm()
  const [checkVideo, setCheckVideo] = useState({})

  const onSubmit = async (data) => {
    const id = customToast.loading()
    const checkVideo = await noteApi.checkVideo(data).catch((err) => {
      customToast.stop(id)
      customToast.error(err.data.message)
    })
    customToast.stop(id)
    if (checkVideo) setCheckVideo(checkVideo)
    console.log(checkVideo)
  }

  const handleAddNote = async () => {
    const id = customToast.loading()
    const videoId = await noteApi.addNote(checkVideo).catch((err) => {
      customToast.stop(id)
      customToast.error(err.data.message)
    })
    customToast.stop(id)
    if (videoId) navigate(`/note/${videoId}`)
  }
  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Typography sx={{ color: 'orange', fontSize: '14px' }}>
            *Lưu ý khi chọn video:
          </Typography>
          <Box pl={2}>
            <Typography sx={{ color: 'orange', fontSize: '14px' }}>
              - Video phải có CC/Subtitles là tiếng Anh gốc ( Không phải auto
              translate )
            </Typography>
            <Typography sx={{ color: 'orange', fontSize: '14px' }}>
              - Video có tốc độ nói và ngắt câu hợp lý
            </Typography>
          </Box>
        </Box>
        <TextField
          label='Link to video on YouTube'
          name='link'
          control={control}
          rules={{
            required: 'Link to video on YouTube is required' // Thông báo lỗi khi field này bị bỏ trống
          }}
        />
        <FormControl margin='normal'>
          <Button
            style={{ textTransform: 'none', textWrap: 'nowrap' }}
            variant='contained'
            color='primary'
            type='submit'
          >
            Kiểm tra thông tin video
          </Button>
        </FormControl>
        <FormHelperText sx={{ fontSize: '14px' }}>
          *Bạn cần kiểm tra thông tin video trước khi tạo notes
        </FormHelperText>
      </form>
      {!util.isEmptyObject(checkVideo) && (
        <Box>
          <Typography variant='h6' component='h1' gutterBottom>
            {checkVideo.title}
          </Typography>
          <Box mt={2}>
            <img
              src={checkVideo.thumbnails[3].url}
              alt={checkVideo.title}
              width='300'
            />
          </Box>
          <Box mt={2}>
            <Typography variant='body1'>
              <strong>Số lượng từ vựng:</strong> {checkVideo.countWords} word
            </Typography>
            {checkVideo.checkList?.map((el) => (
              <Typography variant='body1' key={el.id} marginLeft={4}>
                - Có <strong>{el.match}</strong> word thuộc {el.name} ({el.desc}
                )
              </Typography>
            ))}
            <Typography variant='body1'>
              <strong>Tốc độ nói trung bình: </strong> {checkVideo.avgSpeed}{' '}
              word/s
            </Typography>
            <Typography variant='body1'>
              <strong>Thể loại:</strong> {checkVideo.category}
            </Typography>
            <Typography variant='body1'>
              <strong>Thời lượng:</strong>{' '}
              {noteUtil.formatTime(checkVideo.duration)}
            </Typography>
          </Box>
          <FormControl margin='normal'>
            <Button
              style={{ textTransform: 'none', textWrap: 'nowrap' }}
              variant='contained'
              color='primary'
              onClick={handleAddNote}
            >
              Tạo note với video này
            </Button>
          </FormControl>
        </Box>
      )}
    </Box>
  )
}

export default AddNote
