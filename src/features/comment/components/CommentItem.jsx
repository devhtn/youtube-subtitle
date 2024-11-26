import { useState } from 'react'

import { ExpandLess, ExpandMore, ThumbUpAltOutlined } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Collapse,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import _ from 'lodash'

import CommentForm from './CommentForm'

import commentApi from '~/features/comment/commentApi'
import useAuth from '~/hooks/useAuth'
import util from '~/utils'

const CommentItem = ({
  comment,
  subReply = false,
  handleCreate,
  handleLikeChange,
  onToggleLike
}) => {
  const [reply, setReply] = useState(false)
  const [isShowReplies, setIsShowReplies] = useState(false)
  const auth = useAuth()
  const [isLiked, setIsLiked] = useState(comment.likes?.includes(auth.id))

  const handleToggleLike = async () => {
    try {
      const updateComment = await commentApi.toggleLikeComment({
        commentId: comment.id
      })
      setIsLiked(updateComment.likes.includes(auth.id))
      onToggleLike(updateComment)
    } catch (error) {}
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction='row' spacing={2} sx={{ width: '100%' }}>
        <Avatar
          size='40'
          name={comment.userId?.name}
          src={
            !_.isEmpty(comment.userId)
              ? util.getRoboHashUrl(comment.userId.id)
              : ''
          }
        />
        <Box width={'100%'}>
          <Box display={'flex'} gap={1}>
            <Typography fontSize={'13px'} fontWeight={'600'}>
              {comment.userId?.name}
            </Typography>
            <Typography fontSize={'12px'}>
              {util.getTimeSince(comment.createdAt)}
            </Typography>
          </Box>
          <Typography variant='body2'>
            {comment.mentionUserId?.name && (
              <Typography variant='span' color={'text.hightlight'}>
                @{comment.mentionUserId?.name}{' '}
              </Typography>
            )}
            {comment.content}
          </Typography>
          <Box display='flex' gap={2}>
            <Box display='flex' alignItems='center' gap={1}>
              {/* Like comment */}
              <IconButton onClick={handleToggleLike} size='small'>
                <ThumbUpAltOutlined
                  sx={{ color: isLiked ? 'primary.main' : '' }}
                />
              </IconButton>
              <Typography variant='body2'>{comment.likes?.length}</Typography>
            </Box>
            <Button
              onClick={() => setReply(true)}
              sx={{ textTransform: 'none', fontSize: '13px' }}
            >
              Trả lời
            </Button>
          </Box>
          {/* reply form */}
          {reply && (
            <CommentForm
              reply={reply}
              setReply={setReply}
              exerciseId={comment.exerciseId}
              parentId={comment.id}
              subReply={subReply}
              replyName={comment.userId?.name}
              setIsShowReplies={setIsShowReplies}
              onCreate={handleCreate}
            />
          )}
          {/* show replies */}
          {comment.replies?.length > 0 && (
            <Button
              onClick={() => setIsShowReplies(!isShowReplies)}
              startIcon={!isShowReplies ? <ExpandMore /> : <ExpandLess />}
              sx={{ textTransform: 'none', fontSize: '13px' }}
            >
              {`${comment.replies.length} trả lời`}
            </Button>
          )}
          <Collapse in={isShowReplies}>
            <Box sx={{ mt: 2, pl: 2 }}>
              {comment.replies?.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  subReply={true}
                  handleCreate={handleCreate}
                  onToggleLike={handleLikeChange}
                />
              ))}
            </Box>
          </Collapse>
        </Box>
      </Stack>
    </Box>
  )
}

export default CommentItem
