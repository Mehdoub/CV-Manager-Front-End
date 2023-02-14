import { isFulfilled } from "@reduxjs/toolkit";
import { toastSuccess } from "src/helpers/functions";


const successHandler = ({ }) => (next: any) => async (action: any) => {
  const showTypesArr = [
    'createCompany/fulfilled',
    'addCompanyManager/fulfilled',
    'removeCompanyManager/fulfilled',
    'editCompany/fulfilled',
    'createProject/fulfilled',
    'addProjectManager/fulfilled',
    'removeProjectManager/fulfilled',
    'createPosition/fulfilled',
    'addPositionManager/fulfilled',
    'removePositionManager/fulfilled',
  ]

  if (isFulfilled(action) && showTypesArr.includes(action.type)) {
    toastSuccess(action?.payload?.message)
  }

  return next(action)
}

export default successHandler
