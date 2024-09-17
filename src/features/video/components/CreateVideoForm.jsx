import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Box, Button, FormControl, Typography } from '@mui/material'

import FileField from '~/components/fields/FileField'
import TextField from '~/components/fields/TextField'

import videoApi from '../videoApi'
import createVideoUtils from '../videoUtil'
import customToast from '~/config/toast'

const CreateVideoForm = () => {
  const { control, handleSubmit, setError, reset } = useForm()

  const [auth, setAuth] = useState(false)
  const onSubmit = async (data) => {
    const id = customToast.loading()
    const videoId = createVideoUtils.getVideoId(data.link)
    let video = {}
    if (videoId) {
      video = await createVideoUtils.fetchVideo(videoId)
    }
    if (videoId && video) {
      data.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      data.title = video.snippet.title
      data.duration = video.contentDetails.duration
    } else
      setError('link', { type: 'manual', message: 'Video link is not valid' })

    data.enSubs = await createVideoUtils.translateSubs(
      data.enSrtFile,
      data.viSrtFile
    )
    data.viSubs = await createVideoUtils.translateSubs(
      data.viSrtFile,
      data.enSrtFile
    )
    console.log(data)

    // remove unnecessary things
    delete data.enSrtFile
    delete data.viSrtFile

    // call api
    // try {
    //   const response = await videoApi.createVideo(data)
    //   customToast.stop(id)
    //   customToast.success(response)
    //   reset()
    // } catch (error) {
    //   customToast.stop(id)
    //   if (error.status === 401) setAuth(true)
    //   customToast.error(error.data.message)
    // }
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label='Video link'
          name='link'
          control={control}
          rules={{
            required: 'Video link is required' // Thông báo lỗi khi field này bị bỏ trống
          }}
        />

        <FileField
          label='Upload file English Subtitle (.SRT)'
          name='enSrtFile'
          control={control}
          rules={{ required: 'Please upload a file' }}
        />

        <FileField
          label='Upload file Vietnamese Subtitle (.SRT)'
          name='viSrtFile'
          control={control}
          rules={{ required: 'Please upload a file' }}
        />

        <FormControl margin='normal'>
          <Button
            style={{ textTransform: 'none' }}
            variant='contained'
            color='primary'
            type='submit'
          >
            Submit
          </Button>
        </FormControl>
      </form>
    </Box>
  )
}

export default CreateVideoForm
