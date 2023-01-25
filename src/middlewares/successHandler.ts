import { isFulfilled } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";


const successHandler = ({ }) => (next: any) => async (action: any) => {
  const showTypesArr = [
    'createCompany/fulfilled',
    'createProject/fulfilled',
    'addCompanyManager/fulfilled',
  ]

  if (isFulfilled(action) && showTypesArr.includes(action.type)) {
    const textMessage = action.payload.message ? action.payload.message : 'Successfully Done!'
    toast.success(textMessage, { duration: 5000, position: 'bottom-left', style: { maxWidth: '650px' } })
  }

  return next(action)
}

export default successHandler
