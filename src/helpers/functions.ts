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
  0: 'No Rating',
  1: 'Useless',
  2: 'Poor',
  3: 'Ok',
  4: 'Good',
  5: 'Excellent!',
}

export const allowedFormats = {
  image: [".png", ".jpg", ".jpeg", ".gif", ".svg"],
  file: [".pdf"],
}

export const toastError = (msg: string, duration: number = 7000, position: ToastPosition = 'bottom-left') => {
  if (msg?.length > 0) toast.error(uppercaseFirstLetters(msg), { duration, position, style: { maxWidth: '650px' } })
}

export const toastSuccess = (msg: string, duration: number = 7000, position: ToastPosition = 'bottom-left') => {
  const textMsg = msg?.length > 0 ? msg : 'Successfully Done!'
  toast.success(uppercaseFirstLetters(textMsg), { duration, position, style: { maxWidth: '650px' } })
}

export const getImagePath = (imgAddress: string): string => {
  const rootUrl = process.env.NEXT_PUBLIC_API_URL?.split('/api/v1/')[0]
  return rootUrl + imgAddress
}

export const getFullName = (item: any): string => {
  return uppercaseFirstLetters(item?.firstname + ' ' + item?.lastname)
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

export const showDate = (date: string, showTime: boolean = false) => {
  let returnVal = ''
  const lang = Language.builder().getLanguage()
  if (lang == 'fa') {
    returnVal = new Date(date).toLocaleString('fa-IR')
  } else {
    returnVal = new Date(date).toDateString()
    if (showTime) returnVal += ' ' + new Date(date).toLocaleTimeString()
  }

  return returnVal
}

export const uppercaseFirstLetters = (text: any, removeUnderLines: boolean = false) => {
  let returnVal = ''
  let modifiedText = text
  if (removeUnderLines && text?.includes('_')) {
    modifiedText = ''
    text?.split('_').map((word: string) => modifiedText += word + ' ')
  }
  const textArr = modifiedText?.split(' ')
  textArr?.map((item: string, index: number) => {
    const extraSpace = textArr?.length - 1 == index ? '' : ' '
    returnVal += item.substring(0, 1).toUpperCase() + item.substring(1) + extraSpace
  })

  return returnVal.trimStart()
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
  const dots = text?.length > maxLen ? '...' : ''
  return uppercaseFirstLetters(text?.substring(0, maxLen) + dots)
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

export const roundNumber = (num: number) => {
  const decimal = num % 1
  return decimal >= 0.5 ? Math.ceil(num) : Math.floor(num)
}

export const mobileHandler = (mobileValue: string, value: string, setValue: any, fieldName: string = 'mobile') => {
  mobileValue = mobileValue.substring(0, 1) == '0' ? mobileValue.substring(1) : mobileValue
  mobileValue = mobileValue.substring(0, 2) == '98' ? mobileValue.substring(2) : mobileValue
  mobileValue = mobileValue.length > 10 ? value : mobileValue
  setValue(fieldName, mobileValue)
}

export const getTimeText = (time: string, hasRange: boolean = false) => {
  const dateObj: any = new Date(time)
  const now: any = new Date()
  const diffDays: number = Math.floor((dateObj - now) / (1000 * 60 * 60 * 24))
  let dateText = ''
  let dateColor = ''
  const halfHourLater = new Date(dateObj.getTime() + 30 * 60000)

  if (diffDays > 0) {
    dateText = diffDays + ' Day(s) Later'
    dateColor = 'success'
  } else if (diffDays < 0 && diffDays !== -1) {
    dateText = Math.abs(diffDays) + ' Day(s) Ago'
    dateColor = 'warning'
  } else {
    if (hasRange && dateObj.getTime() < now.getTime() && now.getTime() < halfHourLater.getTime()
    ) {
      dateText = 'right now'
      dateColor = 'error'
    } else {
      const diffHours = Math.ceil((dateObj - now) / (1000 * 60 * 60))
      if (diffHours > 0 && diffHours !== 1) {
        dateText = diffHours + ' Hour(s) Later'
        dateColor = 'primary'
      } else if (diffHours < 0) {
        dateText = Math.abs(diffHours) + ' Hour(s) Ago'
        dateColor = 'secondary'
      } else {
        const diffMinutes = Math.ceil((dateObj - now) / (1000 * 60))
        if (diffMinutes > 0) {
          dateText = Math.abs(diffMinutes) + ' Minute(s) Later'
          dateColor = 'primary'
        } else {
          dateText = Math.abs(diffMinutes) + ' Minute(s) Ago'
          dateColor = 'secondary'
        }
      }
    }
  }
  const dateString = dateObj.toDateString() + ' ' + dateObj.toLocaleTimeString()

  return [dateText, dateColor, dateString]
}

export const getAllowedFormats = (type: 'image' | 'file' = 'image', asArray: boolean = false) => {
  const formats = {
    image: allowedFormats.image,
    file: allowedFormats.file,
  }
  return !asArray ? ' ' + formats[type].map(
    (item: string) => ` *${item} `
  ) : formats[type]
}

export const getIsoTime = (unixTime: number) => {
  return new Date(unixTime * 1000).toISOString()
}

export const isForbiddenState = (state: string) => ['hired', 'rejected', 'end_cooperation'].includes(state)

async function copyTextToClipboard(text: string) {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text)
  } else {
    return document.execCommand('copy', true, text)
  }
}

export const handleCopyClick = (copyText: string, setCopyText: any) => {
  copyTextToClipboard(copyText)
    .then(() => {
      setCopyText('Copied!');
      setTimeout(() => {
        setCopyText('Copy Link');
      }, 1500);
    })
    .catch(() => {
      toastError('an error occurred while copying the link!')
    });
}

const
  persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
  arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g]
export const convertPersianNumsToEnglish = (str: string) => {
  for (let i: number = 0; i < 10; i++) {
    str = str?.replace(persianNumbers[i], i?.toString())?.replace(arabicNumbers[i], i?.toString());
  }
  return str;
};
