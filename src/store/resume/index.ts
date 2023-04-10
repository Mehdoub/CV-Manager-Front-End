import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import ApiRequest from "src/helpers/ApiRequest"
import { clearStatesAction, createExtraReducers, popObjectItemByKey, sliceInitialStateWithStatus } from "src/helpers/functions"
import { ResumeFormData } from "src/views/pages/position/view/AddResumeDialog"



export const createResume: any = createAsyncThunk('createResume', async (data: ResumeFormData, { rejectWithValue }) => {
  try {
    let resumeLogo = popObjectItemByKey(data, 'avatar')

    data.work_city = '6433ca19792cf4bad82360be'
    data.residence_city = '6433ca19792cf4bad82360be'

    const response = await ApiRequest.builder().auth().request('post', 'resumes', data)

    const newResumeId = response?.data?.data[0]?.id

    if (resumeLogo && newResumeId) {
      await ApiRequest.builder()
        .auth()
        .contentType('multipart/form-data')
        .request('patch', `resumes/${newResumeId}/avatar`, { avatar: resumeLogo })
    }

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const resumeCreateSlice = createSlice({
  name: 'resumeCreate',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearCreateResume: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, createResume)
  }
})

export const { clearCreateResume } = resumeCreateSlice.actions

export const resumeCreateReducer = resumeCreateSlice.reducer
