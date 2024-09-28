import React, { useEffect, useState } from 'react'
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
import _ from 'lodash'

import TextField from '~/components/fields/TextField'

import noteApi from '../noteApi'
import customToast from '~/config/toast'

const NoteSegmentForm = ({
  open,
  setOpen,
  selectedSegment,
  dictation,
  setDictation
}) => {
  const { control, handleSubmit, reset } = useForm({})

  const onSubmit = async (data) => {
    const id = customToast.loading()
    const newSegment = _.cloneDeep(selectedSegment)
    newSegment.note = data.note
    const updateDictation = await noteApi
      .updateSegment({
        segment: newSegment,
        id: dictation.id
      })
      .catch(() => customToast.error())
    customToast.stop(id)
    if (updateDictation) {
      setDictation(updateDictation)
      customToast.success('Bạn đã tạo ghi chú thành công')
      setOpen(false)
      reset()
    }
  }

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

export default NoteSegmentForm
