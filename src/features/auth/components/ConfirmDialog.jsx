import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography
} from '@mui/material'

const ConfirmDialog = ({
  open,
  content = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  onConfirm,
  onClose,
  icon
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='confirm-dialog-title'
    >
      <DialogTitle id='confirm-dialog-title'>
        <Stack justifyContent='center' direction='row'>
          {icon}
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ maxWidth: '500px', minWidth: '300px' }}>
        <Typography textAlign='center'>{content}</Typography>
      </DialogContent>
      <DialogActions>
        {onClose && (
          <Button onClick={onClose} variant='outlined'>
            Hủy
          </Button>
        )}
        <Button onClick={onConfirm} color='error' variant='contained'>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
