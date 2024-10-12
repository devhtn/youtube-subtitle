import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Close } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Stack,
  Typography
} from '@mui/material'

import Segment from './Segment'
import TextField from '~/components/fields/TextField'

import exerciseApi from '../exerciseApi'
import customToast from '~/config/toast'

const SegmentNoteForm = ({
  open,
  setOpen,
  selectedSegment,
  dictation,
  setDictation,
  segmentNote,
  setSegmentNote,
  resultSegment
}) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { note: '' }
  })

  const onSubmit = async (data) => {
    const id = customToast.loading()
    const resp = await exerciseApi
      .updateDictationSegmentNote(dictation.id, selectedSegment.id, data)
      .catch(() => customToast.error('Lỗi server'))
    customToast.stop(id)
    if (resp) {
      setDictation(resp)
      setSegmentNote(data.note)
      customToast.success('Bạn đã tạo ghi chú thành công')
      setOpen(false)
      reset()
    }
  }

  // Cập nhật giá trị form khi segmentNote thay đổi
  useEffect(() => {
    if (segmentNote) {
      reset({ note: segmentNote }) // Cập nhật giá trị ghi chú mặc định
    } else {
      reset({ note: '' }) // Trường hợp không có ghi chú
    }
  }, [segmentNote, reset])

  return (
    <Dialog maxWidth='sm' fullWidth open={open} aria-labelledby='auth dialog'>
      <Box mt={2} pl={3}>
        <Segment isCheck={true} segment={resultSegment} />
      </Box>
      <Typography pl={3} mt={3} >
        {selectedSegment.transText}
      </Typography>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormLabel>Ghi chú</FormLabel>
          <TextField
            name='note'
            placeholder='Nhập nội dung ghi chú ở đây'
            control={control}
            rules={{
              required: 'Nội dung ghi chú là bắt buộc'
            }}
            multiline
            minRows={5}
          />
          <Stack direction='row' justifyContent='space-between'>
            <FormControl margin='normal'>
              <Button
                style={{ textTransform: 'none' }}
                variant='contained'
                fullWidth
                type='submit'
              >
                Lưu ghi chú vào subtitle
              </Button>
            </FormControl>
            <FormControl margin='normal'>
              <Button variant='outlined' onClick={() => setOpen(false)}>
                <Close />
              </Button>
            </FormControl>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default SegmentNoteForm
