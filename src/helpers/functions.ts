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

export const ratingTextsObj: any = {
  1: 'Useless',
  2: 'Poor',
  3: 'Ok',
  4: 'Good',
  5: 'Excellent!',
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

export const shuffle = (array: any): any => {
  let currentIndex = array.length,
    randomIndex

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}

export const getEntityIcon = (entity: string) => {
  const entityIcons: any = {
    companies: 'carbon:location-company',
    projects: 'pajamas:project',
    positions: 'ic:baseline-work-outline',
    users: 'mdi:users-outline',
    interviews: 'mdi:virtual-meeting',
    resumes: 'pepicons-pop:cv',
  }

  return Object.keys(entityIcons).includes(entity) ? entityIcons[entity] : 'mdi:shield-outline'
}

export const getColorCodes = (color: string) => {
  const colorCodes: any = {
    success: '#72E128',
    error: '#FF4D49',
    info: '#26C6F9',
    warning: '#FDB528',
    primary: '#666CFF',
    secondary: '#6D788D',
  }

  return colorCodes[color] ?? colorCodes.error
}

export const getMaxTextLen = (text: string, maxLen = 15): string => {
  const dots = text.length > maxLen ? '...' : ''
  return text.substring(0, maxLen) + dots
}

export const popObjectItemByKey = (subjectObj: any, key: string) => {
  const value = subjectObj[key]
  delete subjectObj[key]
  return value
}

Number.prototype.format = function (n: number) {
  var re = '\\d(?=(\\d{3})+' + (n > 0 ? '\\.' : '$') + ')';
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

export const mobileHandler = (mobileValue: string, value: string, setValue: any, fieldName: string = 'mobile') => {
  mobileValue = mobileValue.substring(0, 1) == '0' ? mobileValue.substring(1) : mobileValue
  mobileValue = mobileValue.substring(0, 2) == '98' ? mobileValue.substring(2) : mobileValue
  mobileValue = mobileValue.length > 10 ? value : mobileValue
  setValue(fieldName, mobileValue)
}

export const calcInterviewRemainingTime = (startDate: any, endDate: any) => {
  const interviewStartDate: any = new Date(startDate)
  const interviewEndDate: any = new Date(endDate)
  const now: any = new Date()
  const diffDays: number = Math.floor((interviewStartDate - now) / (1000 * 60 * 60 * 24))

  let interviewDateText = ''
  let interviewColor = ''

  if (diffDays > 0) {
    interviewDateText = diffDays + ' Day(s) Later'
    interviewColor = 'success'
  } else if (diffDays < 0 && diffDays !== -1) {
    interviewDateText = Math.abs(diffDays) + ' Day(s) Ago'
    interviewColor = 'warning'
  } else {
    if (now.getTime() > interviewStartDate.getTime() && now.getTime() < interviewEndDate.getTime()) {
      interviewDateText = 'right now'
      interviewColor = 'error'
    } else {
      const diffHours = Math.ceil((interviewStartDate - now) / (1000 * 60 * 60))
      if (diffHours > 0 && diffHours !== 1) {
        interviewDateText = diffHours + ' Hour(s) Later'
        interviewColor = 'primary'
      } else if (diffHours < 0) {
        interviewDateText = Math.abs(diffHours) + ' Hour(s) Ago'
        interviewColor = 'secondary'
      } else {
        const diffMinutes = Math.ceil((interviewStartDate - now) / (1000 * 60))
        interviewDateText = Math.abs(diffMinutes) + ' Minute(s) Later'
        interviewColor = 'primary'
      }
    }
  }

  const interviewDateString =
    interviewStartDate.toDateString() +
    ' , ' +
    interviewStartDate.toLocaleTimeString() +
    ' To ' +
    interviewEndDate.toLocaleTimeString()

  return [interviewDateText, interviewColor, interviewDateString]
}

export const getAllowedFormats = (type: 'image' | 'file' = 'image', asArray: boolean = false) => {
  const formats = {
    image: JSON.parse(process.env.NEXT_PUBLIC_ALLOWED_UPLOAD_IMAGES_FORMATS as string),
    file: JSON.parse(process.env.NEXT_PUBLIC_ALLOWED_UPLOAD_FILES_FORMATS as string),
  }
  return !asArray ? ' ' + formats[type].map(
    (item: string) => ` *${item} `
  ) : formats[type]
}
