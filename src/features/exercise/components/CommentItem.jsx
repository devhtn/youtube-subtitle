import { useState } from 'react'
import ReactAvatar from 'react-avatar'

import { ExpandLess, ExpandMore, ThumbUpAltOutlined } from '@mui/icons-material'
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Stack,
  Typography
} from '@mui/material'

import CommentForm from './CommentForm'

import exerciseApi from '../exerciseApi'
import exerciseUtil from '../exerciseUtil'
import useAuth from '~/hooks/useAuth'

const CommentItem = ({ comment, setComments, subReply = false }) => {
  const [reply, setReply] = useState(false)
  const [isShowReplies, setIsShowReplies] = useState(false)
  const auth = useAuth()
  const [isLiked, setIsLiked] = useState(comment.likes?.includes(auth.id))

  const handleToggleLike = async () => {
    const updatedComment = await exerciseApi.toggleLikeComment({
      commentId: comment.id
    })

    if (updatedComment) {
      if (updatedComment.parentId === null) {
        // Cập nhật nếu comment gốc
        setComments((prevComments) =>
          prevComments.map((cmt) =>
            cmt.id === updatedComment.id ? updatedComment : cmt
          )
        )
      } else {
        // Cập nhật nếu comment là reply
        setComments((prevComments) =>
          prevComments.map((cmt) => {
            if (cmt.id === updatedComment.parentId) {
              return {
                ...cmt,
                replies: cmt.replies.map((reply) =>
                  reply.id === updatedComment.id ? updatedComment : reply
                )
              }
            }
            return cmt
          })
        )
      }
      // Cập nhật trạng thái like
      setIsLiked(updatedComment.likes.includes(auth.id))
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction='row' spacing={2} sx={{ width: '100%' }}>
        <ReactAvatar size='40' round name={comment.userId?.name} />
        <Box width={'100%'}>
          <Box display={'flex'} gap={1}>
            <Typography fontSize={'13px'} fontWeight={'600'}>
              {comment.userId?.name}
            </Typography>
            <Typography fontSize={'12px'}>
              {exerciseUtil.getTimeSince(comment.createdAt)}
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
              setComments={setComments}
              subReply={subReply}
              replyName={comment.userId?.name}
              setIsShowReplies={setIsShowReplies}
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
                  setComments={setComments}
                  subReply={true}
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
