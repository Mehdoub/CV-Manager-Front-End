import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import ApiRequest from "src/helpers/ApiRequest"
import { clearStatesAction, createExtraReducers, popObjectItemByKey, sliceInitialStateWithStatus } from "src/helpers/functions"
import { ResumeFormData } from "src/views/pages/position/view/AddResumeDialog"



export const createResume: any = createAsyncThunk('createResume', async (data: ResumeFormData, { rejectWithValue }) => {
  try {
    const resumeAvatar = popObjectItemByKey(data, 'avatar')
    const resumeFiles = popObjectItemByKey(data, 'resumeFiles')

    data.work_city = '643402d32a0d82fd4b1a4273'
    data.residence_city = '643402d32a0d82fd4b1a4273'

    const response = await ApiRequest.builder().auth().request('post', 'resumes', data)

    const newResumeId = response?.data?.data[0]?.id

    if (resumeAvatar && newResumeId) {
      await ApiRequest.builder()
        .auth()
        .contentType('multipart/form-data')
        .request('patch', `resumes/${newResumeId}/avatar`, { avatar: resumeAvatar })
    }

    if (resumeFiles.length > 0 && newResumeId) {
      await ApiRequest.builder()
        .auth()
        .contentType('multipart/form-data')
        .request('patch', `resumes/${newResumeId}/file`, { file: resumeFiles[0] })
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
