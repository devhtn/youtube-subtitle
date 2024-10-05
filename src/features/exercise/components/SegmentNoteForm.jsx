import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel
} from '@mui/material'

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
  setSegmentNote
}) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { note: '' }
  })

  const onSubmit = async (data) => {
    const id = customToast.loading()
    const update = await exerciseApi
      .updateDictationSegmentNote(dictation.id, selectedSegment.id, data)
      .catch(() => customToast.error('Lỗi server'))
    customToast.stop(id)
    if (update) {
      setDictation(update)
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
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Đóng</Button>
      </DialogActions>
      <DialogTitle fontStyle={'italic'}>{selectedSegment.text}</DialogTitle>
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
          <FormControl margin='normal'>
            <Button
              style={{ textTransform: 'none' }}
              size='large'
              variant='contained'
              fullWidth
              type='submit'
            >
              Lưu ghi chú vào subtitle
            </Button>
          </FormControl>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default SegmentNoteForm
