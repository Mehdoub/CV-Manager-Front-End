import { ToastPosition, toast } from "react-hot-toast"

export const toastError = (msg: string, duration: number = 5000, position: ToastPosition = 'bottom-left') => {
  const textMsg = msg.length > 0 ? msg : 'Something Went Wrong!'
  toast.error(textMsg, { duration, position, style: { maxWidth: '650px' } })
}

export const toastSuccess = (msg: string, duration: number = 5000, position: ToastPosition = 'bottom-left') => {
  const textMsg = msg.length > 0 ? msg : 'Successfully Done!'
  toast.success(textMsg, { duration, position, style: { maxWidth: '650px' } })
}
