import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import ApiRequest from "src/helpers/ApiRequest"
import { clearStatesAction, createExtraReducers, popObjectItemByKey, sliceInitialStateWithData, sliceInitialStateWithStatus } from "src/helpers/functions"
import { ResumeFormData } from "src/views/pages/position/view/AddResumeDialog"



export const createResume: any = createAsyncThunk('createResume', async (data: ResumeFormData, { rejectWithValue }) => {
  try {
    const resumeAvatar = popObjectItemByKey(data, 'avatar')
    const resumeFiles = popObjectItemByKey(data, 'resumeFiles')

    const response = await ApiRequest.builder().auth().request('post', 'resumes', data)

    const newResumeId = response?.data?.data[0]?.id

    if (resumeAvatar && newResumeId) {
      await ApiRequest.builder()
        .auth()
        .contentType('multipart/form-data')
        .request('patch', `resumes/${newResumeId}/avatar`, { avatar: resumeAvatar })
    }

    if (resumeFiles.length && newResumeId) {
      for (const resumeFile of resumeFiles) {
        await ApiRequest.builder()
          .auth()
          .contentType('multipart/form-data')
          .request('patch', `resumes/${newResumeId}/file`, { file: resumeFile })
      }
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


export const addResumeFiles: any = createAsyncThunk('addResumeFiles', async (data: { resumeId: string, resumeFiles: Array<any> }, { rejectWithValue }) => {
  try {
    let response
    const { resumeId, resumeFiles } = data

    if (resumeFiles.length && resumeId) {
      for (const resumeFile of resumeFiles) {
        response = await ApiRequest.builder()
          .auth()
          .contentType('multipart/form-data')
          .request('patch', `resumes/${resumeId}/file`, { file: resumeFile })
      }
    }

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const resumeAddFilesSlice = createSlice({
  name: 'resumeAddFiles',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearResumeAddFiles: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, addResumeFiles)
  }
})


export const getResume: any = createAsyncThunk('getResume', async (resumeId: string, { rejectWithValue }) => {
  try {
    const response = await ApiRequest.builder().auth().request('get', `resumes/${resumeId}`)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const resumeSlice = createSlice({
  name: 'resume',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    createExtraReducers(builder, getResume, true, true)
  }
})


export const { clearCreateResume } = resumeCreateSlice.actions
export const { clearResumeAddFiles } = resumeAddFilesSlice.actions

export const resumeCreateReducer = resumeCreateSlice.reducer
export const resumeAddFilesReducer = resumeAddFilesSlice.reducer
export const resumeReducer = resumeSlice.reducer
