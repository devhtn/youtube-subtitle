import { toast } from 'react-toastify'

const defaultToastConfig = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: true,
  closeButton: true,
  theme: 'light',
  style: {
    fontSize: '14px'
  }
}

const success = (message = 'Success!') => {
  toast.success(message, defaultToastConfig)
}

const warning = (message = 'Warning!') => {
  toast.warn(message, defaultToastConfig)
}

const error = (message = 'Error!') => {
  toast.error(message, defaultToastConfig)
}

const loading = (message = 'Please wait...') => {
  const id = toast.loading(message, {
    ...defaultToastConfig,
    autoClose: false,
    hideProgressBar: false
  })

  return id
}

const update = (id, message, type = 'success') => {
  toast.update(id, {
    render: message,
    type: type,
    isLoading: false,
    ...defaultToastConfig
  })
}

const stop = (id) => {
  toast.dismiss(id) // Đóng toast dựa trên ID
}

const customToast = {
  success,
  warning,
  error,
  loading,
  update,
  stop
}
export default customToast
