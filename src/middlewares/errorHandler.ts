import { isRejected } from "@reduxjs/toolkit";
import { toastError } from "src/helpers/functions";


const errorHandler = ({ }) => (next: any) => async (action: any) => {
  const showTypesArr = [
    'checkUsername/rejected',
  ]

  if (isRejected(action) && !showTypesArr.includes(action.type)) {
    // if (action?.payload?.status == 404) location.href = '/404'
    toastError(action?.payload?.data?.message)
  }

  return next(action)
}

export default errorHandler
