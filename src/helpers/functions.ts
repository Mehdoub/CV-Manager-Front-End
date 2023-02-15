import { ToastPosition, toast } from "react-hot-toast"

export const sliceInitialStateWithData = {
  loading: false,
  errors: [],
  data: {}
}

export const sliceInitialStateWithStatus = {
  loading: false,
  errors: [],
  status: false
}

export const statusColors: any = {
  active: 'success',
  inactive: 'error'
}


export const toastError = (msg: string, duration: number = 5000, position: ToastPosition = 'bottom-left') => {
  if (msg?.length > 0) toast.error(msg, { duration, position, style: { maxWidth: '650px' } })
}

export const toastSuccess = (msg: string, duration: number = 5000, position: ToastPosition = 'bottom-left') => {
  const textMsg = msg?.length > 0 ? msg : 'Successfully Done!'
  toast.success(textMsg, { duration, position, style: { maxWidth: '650px' } })
}

export const getImagePath = (imgAddress: string): string => {
  const rootUrl = process.env.NEXT_PUBLIC_API_URL?.split('/api/v1/')[0]
  return rootUrl + imgAddress
}

export const getFullName = (item: any): string => {
  return item?.firstname + ' ' + item?.lastname
}

export const showIsActiveColor = (isActive: boolean) => {
  return isActive ? 'success' : 'error'
}

export const setServerValidationErrors = (errors: object, setError: any) => {
  if (errors) {
    for (const [key, value] of Object.entries(errors)) {
      setError(key, {
        type: 'manual',
        message: value
      })
    }
  }
}

export const defaultPendingStatesValue = (state: any) => {
  state.loading = true
  state.status = false
  state.errors = {}
}

export const defaultFulfilledStatesValue = (state: any, action: any = {}, zeroIndex: boolean = false) => {
  state.loading = false
  state.errors = {}
  if (action)
    if (zeroIndex) state.data = action.payload.data.data[0]
    else state.data = action.payload.data.data
  else state.status = true
}

export const defaultRejectedStatesValue = (state: any, action: any) => {
  state.loading = false
  state.errors = action.payload
  state.status = false
}
