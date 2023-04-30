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
    'editPosition/fulfilled',
    'addPositionManager/fulfilled',
    'removePositionManager/fulfilled',
    'editProject/fulfilled',
    'changePassword/fulfilled',
    'createRole/fulfilled',
    'editRole/fulfilled',
    'createResume/fulfilled',
    'editResume/fulfilled',
    'addResumeFiles/fulfilled',
    'editUser/fulfilled',
    'addCallHistoryToResume/fulfilled',
  ]

  if (isFulfilled(action) && showTypesArr.includes(action.type)) {
    toastSuccess(action?.payload?.data?.message)
  }

  return next(action)
}

export default successHandler
