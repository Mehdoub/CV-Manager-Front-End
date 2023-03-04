import { ToastPosition, toast } from "react-hot-toast"
import Language from "./Language"

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
  state.errors = []
}

export const defaultFulfilledStatesValue = (state: any, action: any = {}, zeroIndex: boolean = false) => {
  state.loading = false
  state.errors = {}
  if (action?.type && zeroIndex) state.data = action?.payload?.data?.data[0]
  else if (action?.type) state.data = action?.payload?.data?.data
  else state.status = true
}

export const defaultRejectedStatesValue = (state: any, action: any) => {
  state.loading = false
  state.errors = action?.payload
  state.status = false
}

export const createExtraReducers = (builder: any, actionFunc: any, hasData: boolean = false, zeroIndex: boolean = false) => {
  builder.addCase(actionFunc.pending, (state: any) => {
    defaultPendingStatesValue(state)
  })
  builder.addCase(actionFunc.fulfilled, (state: any, action: any) => {
    if (hasData) defaultFulfilledStatesValue(state, action, zeroIndex)
    else defaultFulfilledStatesValue(state)
  })
  builder.addCase(actionFunc.rejected, (state: any, action: any) => {
    defaultRejectedStatesValue(state, action)
  })
}

export const clearStatesAction = (state: any, hasData: boolean = false) => {
  state.loading = false
  if (hasData) state.data = {}
  else state.status = false
  state.errors = []
}

export const showDate = (date: string) => {
  let returnVal = ''
  const lang = Language.builder().getLanguage()
  if (lang == 'fa') returnVal = new Date(date).toLocaleString('fa-IR')
  else returnVal = new Date(date).toDateString()

  return returnVal
}

export const uppercaseFirstLetters = (text: string) => {
  let returnVal = ''
  text.split(' ').map((item: string) => returnVal += item.substring(0, 1).toUpperCase() + item.substring(1).toLowerCase() + ' ')
  return returnVal.trim()
}
