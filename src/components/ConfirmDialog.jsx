import { useEffect, useState } from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography
} from '@mui/material'

import util from '~/utils'

const ConfirmDialog = ({
  open = false,
  content = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  onConfirm = () => {},
  onClose = () => {},
  icon = <></>
}) => {
  const [openDialog, setOpenDialog] = useState(false)
  const handleClose = () => {
    setOpenDialog(false)
    onClose() // Call the onClose function if provided
  }
  const handleConfirm = () => {
    setOpenDialog(false)
    onConfirm() // Call the onClose function if provided
  }

  useEffect(() => {
    setOpenDialog(open)
  }, [open])
  return (
    <Dialog
      open={openDialog}
      onClose={onClose}
      aria-labelledby='confirm-dialog-title'
    >
      <DialogTitle id='confirm-dialog-title'>
        <Stack justifyContent='center' direction='row'>
          {icon}
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ maxWidth: '600px', minWidth: '400px' }}>
        <Typography textAlign='center'>{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant='outlined'>
          Đóng
        </Button>
        {!util.isEmptyFunction(onConfirm) && (
          <Button onClick={handleConfirm} variant='contained'>
            Xác nhận
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
