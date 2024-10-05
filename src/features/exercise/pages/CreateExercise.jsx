import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  List,
  ListItem,
  Typography
} from '@mui/material'

import TextField from '~/components/fields/TextField'

import exerciseApi from '../exerciseApi'
import exerciseUtil from '../exerciseUtil'
import customToast from '~/config/toast'
import useAuth from '~/hooks/useAuth'
import util from '~/utils'

const CreateExercise = () => {
  const navigate = useNavigate()
  const auth = useAuth()
  const { control, handleSubmit, reset } = useForm()
  const [checkVideo, setCheckVideo] = useState({})

  const onSubmit = async (data) => {
    const id = customToast.loading()
    const checkVideo = await exerciseApi.checkVideo(data).catch((err) => {
      customToast.stop(id)
      customToast.error(err.data.message)
    })
    customToast.stop(id)
    if (checkVideo) setCheckVideo(checkVideo)
  }

  const handleCreateExercise = async () => {
    const id = customToast.loading()
    const videoId = await exerciseApi
      .createExercise(checkVideo)
      .catch((err) => {
        customToast.stop(id)
        customToast.error(err.data.message)
      })
    customToast.stop(id)
    if (videoId) {
      if (auth.role === 'user') navigate(`/exercise/${videoId}/play`)
      else {
        customToast.success('Video được public thành công')
        setCheckVideo({})
        reset()
      }
    }
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
          *Bạn cần kiểm tra thông tin video trước khi tạo bài tập
        </FormHelperText>
      </form>
      {!util.isEmptyObject(checkVideo) && (
        <Box>
          <Typography variant='h6' component='h1' gutterBottom>
            {checkVideo.title}
          </Typography>
          <Box mt={2}>
            <img src={checkVideo.thumbnails[2].url} alt={checkVideo.title} />
          </Box>
          <Box mt={2}>
            <Typography variant='body1'>
              <strong>Số lượng từ vựng:</strong>{' '}
              {checkVideo.totalDictationUniqWords} words
            </Typography>
            <List sx={{ listStyleType: 'disc', p: '0 0 0 32px' }}>
              {checkVideo.checkList?.map((el) => (
                <ListItem key={el.id} sx={{ display: 'list-item', p: 0 }}>
                  <Typography variant='body1'>
                    {el.match} words thuộc {el.name} ({el.desc})
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Typography variant='body1'>
              <strong>Số lượng từ vựng phải chép chính tả:</strong>{' '}
              {checkVideo.totalDictationWords} words
            </Typography>
            <Typography variant='body1'>
              <strong>Tốc độ nói trung bình: </strong> {checkVideo.avgSpeed} WPM
            </Typography>
            <Typography variant='body1'>
              <strong>Thể loại:</strong> {checkVideo.category}
            </Typography>
            <Typography variant='body1'>
              <strong>Thời lượng:</strong>{' '}
              {exerciseUtil.formatTime(checkVideo.duration)}
            </Typography>
          </Box>
          <FormControl margin='normal'>
            {auth.role === 'admin' ? (
              <Button
                style={{ textTransform: 'none', textWrap: 'nowrap' }}
                variant='contained'
                color='primary'
                onClick={handleCreateExercise}
              >
                Tạo và chia sẻ video với mọi người
              </Button>
            ) : (
              <Button
                style={{ textTransform: 'none', textWrap: 'nowrap' }}
                variant='contained'
                color='primary'
                onClick={handleCreateExercise}
              >
                Tạo bài tập với video này
              </Button>
            )}
          </FormControl>
        </Box>
      )}
    </Box>
  )
}

export default CreateExercise
