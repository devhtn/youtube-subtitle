import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Box, Button, FormControl, Grid, Stack } from '@mui/material'

import CardItem from '../components/CardItem'
import TextField from '~/components/fields/TextField'

import exerciseApi from '../exerciseApi'
import customToast from '~/config/toast'
import useAuth from '~/hooks/useAuth'
import util from '~/utils'

const CreateExercise = () => {
  const auth = useAuth()
  const { control, handleSubmit, reset } = useForm()
  const [videoInfo, setVideoInfo] = useState({})

  const onSubmit = async (data) => {
    const id = customToast.loading()
    const videoInfo = await exerciseApi.checkVideo(data).catch((err) => {
      customToast.stop(id)
      customToast.error(err.data.message)
    })
    customToast.stop(id)
    if (videoInfo) setVideoInfo(videoInfo)
  }

  const handleCreateExercise = async () => {
    const id = customToast.loading()
    try {
      await exerciseApi.createExercise(videoInfo)
      customToast.success('Khởi tạo exercise thành công!')
      setVideoInfo({})
      reset()
    } catch (error) {
      customToast.error(error.data.message)
    }
    customToast.stop(id)
  }
  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction={'row'} gap={2}>
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
              sx={{
                textTransform: 'none',
                textWrap: 'nowrap',
                px: 4,
                height: '40px'
              }}
              variant='contained'
              color='primary'
              type='submit'
            >
              Kiểm tra thông tin video
            </Button>
          </FormControl>
        </Stack>
      </form>
      {!util.isEmptyObject(videoInfo) && (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <CardItem exercise={videoInfo} isCheckInfo={true} />
              <FormControl margin='normal' fullWidth>
                {auth.role === 'admin' ? (
                  <Button
                    style={{ textTransform: 'none', textWrap: 'nowrap' }}
                    variant='contained'
                    color='primary'
                    onClick={handleCreateExercise}
                  >
                    Tạo và chia sẻ exercise với mọi người
                  </Button>
                ) : (
                  <Button
                    style={{ textTransform: 'none', textWrap: 'nowrap' }}
                    variant='contained'
                    color='primary'
                    onClick={handleCreateExercise}
                  >
                    Tạo exercise và thêm vào playlist
                  </Button>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  )
}

export default CreateExercise
