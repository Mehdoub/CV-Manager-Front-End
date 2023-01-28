import { isRejected } from "@reduxjs/toolkit";
import { toastError } from "src/helpers/functions";


const errorHandler = ({ }) => (next: any) => async (action: any) => {
  const showTypesArr = [
    'checkUsername/rejected',
  ]

  if (isRejected(action) && !showTypesArr.includes(action.type)) {
    toastError(action?.payload?.data?.message)
  }

  return next(action)
}

export default errorHandler
