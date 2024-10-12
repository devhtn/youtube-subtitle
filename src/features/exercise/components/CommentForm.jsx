import { useEffect, useRef, useState } from 'react'
import ReactAvatar from 'react-avatar'
import { useForm } from 'react-hook-form'

import { Close } from '@mui/icons-material'
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  Stack,
  Typography
} from '@mui/material'

import TextField from '~/components/fields/TextField'

import exerciseApi from '../exerciseApi'
import authApi from '~/features/auth/authApi'

const CommentForm = ({
  exerciseId,
  reply,
  setReply,
  parentId = null,
  setComments,
  subReply = false,
  replyName = null,
  setIsShowReplies
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
    try {
      const newComment = await exerciseApi.createComment(exerciseId, data)
      console.log(newComment)
      if (newComment.parentId === null)
        setComments((prev) => [newComment, ...prev])
      else
        setComments((prev) =>
          prev.map((comment) => {
            if (comment.id === newComment.parentId) {
              return {
                ...comment,
                replies: [newComment, ...comment.replies] // Thêm vào đầu mảng replies
              }
            }
            return comment
          })
        )
      if (reply) {
        setReply(false)
        setIsShowReplies(true)
      }
      setOpen(false)
      reset()
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Stack direction='row' spacing={2} alignItems='center'>
          <Box>
            <ReactAvatar size='40' round name={user.name} />
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
