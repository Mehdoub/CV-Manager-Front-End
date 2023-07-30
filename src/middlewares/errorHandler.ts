import { isRejected } from "@reduxjs/toolkit";
import { toastError } from "src/helpers/functions";


const errorHandler = ({ }) => (next: any) => async (action: any) => {
  const showTypesArr = [
    'checkUsername/rejected',
  ]

  const excludeMessages = [
    'jwt expired'
  ]

  const message = action?.payload?.data?.message

  if (isRejected(action) && !showTypesArr.includes(action.type) && !excludeMessages.includes(message)) {
    // if (action?.payload?.status == 404) location.href = '/404'
    toastError(message)
  }

  return next(action)
}

export default errorHandler
