import { useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Close } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  FormControl,
  InputAdornment,
  Stack,
  Typography
} from '@mui/material'
import _ from 'lodash'

import TextField from '~/components/fields/TextField'

import authApi from '~/features/auth/authApi'
import commentApi from '~/features/comment/commentApi'
import util from '~/utils'

const CommentForm = ({
  exerciseId,
  reply,
  setReply,
  parentId = null,
  subReply = false,
  replyName = null,
  setIsShowReplies,
  onCreate
}) => {
  const [user, setUser] = useState({})
  const [open, setOpen] = useState(false)
  const inputRef = useRef()
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { content: '' }
  })
  // Hàm xử lý khi gửi comment
  const onSubmit = async (data) => {
    data.parentId = parentId
    data.exerciseId = exerciseId
    try {
      const newComment = await commentApi.createComment(data)
      if (reply) {
        setReply(false)
        setIsShowReplies(true)
      }
      setOpen(false)
      reset()
      onCreate(newComment)
    } catch (error) {}
  }

  useEffect(() => {
    ;(async () => {
      await authApi.getUser().then((user) => setUser(user))
    })()
    if (inputRef.current && reply) {
      inputRef.current.focus() // Tự động focus vào TextField
    }
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)} onFocus={() => setOpen(true)}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        <Stack direction='row' spacing={2} alignItems='center'>
          <Box>
            <Avatar
              name={user.name}
              src={
                !_.isEmpty(user) &&
                (user.picture || util.getRoboHashUrl(user.id))
              }
            />
          </Box>

          {/* Sử dụng Controller để kết nối TextField với React Hook Form */}
          <TextField
            name='content'
            placeholder='Thêm một bình luận...'
            control={control}
            rules={{
              required: 'Nội dùng comment là bắt buộc'
            }}
            variant='standard'
            multiline
            inputRef={inputRef}
            InputProps={{
              sx: { fontSize: '14px' },
              startAdornment: subReply ? (
                <InputAdornment position='start'>
                  <Typography
                    variant='span'
                    fontWeight={'bold'}
                    color={'text.hightlight'}
                  >
                    @{replyName}
                  </Typography>
                </InputAdornment>
              ) : null
            }}
          />
        </Stack>

        {(open || reply) && (
          <Stack direction='row' spacing={2} justifyContent='flex-end'>
            <FormControl margin='normal'>
              <Button
                variant='outlined'
                onClick={() => {
                  setOpen(false)
                  if (reply) setReply(false)
                  reset()
                }}
              >
                <Close />
              </Button>
            </FormControl>
            <FormControl margin='normal'>
              <Button
                style={{ textTransform: 'none' }}
                variant='contained'
                fullWidth
                type='submit'
              >
                {reply ? 'Trả lời' : 'Bình luận'}
              </Button>
            </FormControl>
          </Stack>
        )}
      </Box>
    </form>
  )
}

export default CommentForm
