import { isFulfilled } from "@reduxjs/toolkit";
import { toastSuccess } from "src/helpers/functions";


const successHandler = ({ }) => (next: any) => async (action: any) => {
  const showTypesArr = [
    'createCompany/fulfilled',
    'createProject/fulfilled',
    'addCompanyManager/fulfilled',
    'removeCompanyManager/fulfilled',
    'editCompany/fulfilled',
  ]

  if (isFulfilled(action) && showTypesArr.includes(action.type)) {
    toastSuccess(action?.payload?.message)
  }

  return next(action)
}

export default successHandler
