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

    if (resumeFiles?.length && newResumeId) {
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


export const editResume: any = createAsyncThunk('editResume', async (data: any, { rejectWithValue }) => {
  try {
    const resumeAvatar = popObjectItemByKey(data, 'avatar')
    const resumeId = popObjectItemByKey(data, 'resumeId')

    const response = await ApiRequest.builder().auth().request('patch', `resumes/${resumeId}`, data)

    const newResumeId = response?.data?.data[0]?.id

    if (resumeAvatar && newResumeId) {
      await ApiRequest.builder()
        .auth()
        .contentType('multipart/form-data')
        .request('patch', `resumes/${newResumeId}/avatar`, { avatar: resumeAvatar })
    }

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const resumeEditSlice = createSlice({
  name: 'resumeEdit',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearEditResume: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, editResume)
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


export const updateResumeStatus: any = createAsyncThunk('updateResumeStatus', async (data: { resumeId: string, status: string, index: number }, { rejectWithValue }) => {
  try {
    const resumeId = popObjectItemByKey(data, 'resumeId')
    const response = await ApiRequest.builder().auth().request('patch', `resumes/${resumeId}/status`, data)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const resumeUpdateStatusSlice = createSlice({
  name: 'resumeUpdateStatus',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearResumeUpdateStatus: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, updateResumeStatus)
  }
})


export const addCallHistoryToResume: any = createAsyncThunk('addCallHistoryToResume', async (data: any, { rejectWithValue }) => {
  try {
    const resumeId = popObjectItemByKey(data, 'resumeId')
    const response = await ApiRequest.builder().auth().request('patch', `resumes/${resumeId}/call-history`, data)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const resumeAddCallHistorySlice = createSlice({
  name: 'resumeAddCallHistory',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearResumeAddCallHistory: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, addCallHistoryToResume)
  }
})

export const addInterviewToResume: any = createAsyncThunk('addInterviewToResume', async (data: any, { rejectWithValue }) => {
  try {
    const resumeId = popObjectItemByKey(data, 'resumeId')
    const response = await ApiRequest.builder().auth().request('post', `resumes/${resumeId}/interviews`, data)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const resumeAddInterviewSlice = createSlice({
  name: 'resumeAddInterview',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearResumeAddInterview: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, addInterviewToResume)
  }
})


export const hireResume: any = createAsyncThunk('hireResume', async (data: any, { rejectWithValue }) => {
  try {
    const resumeId = popObjectItemByKey(data, 'resumeId')
    const response = await ApiRequest.builder().auth().request('patch', `resumes/${resumeId}/hired`, data)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const resumeHireSlice = createSlice({
  name: 'resumeHire',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearResumeHire: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, hireResume)
  }
})


export const rejectResume: any = createAsyncThunk('rejectResume', async (data: any, { rejectWithValue }) => {
  try {
    const resumeId = popObjectItemByKey(data, 'resumeId')
    const response = await ApiRequest.builder().auth().request('patch', `resumes/${resumeId}/reject`, data)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const resumeRejectSlice = createSlice({
  name: 'resumeReject',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearResumeReject: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, rejectResume)
  }
})


export const addTagToResume: any = createAsyncThunk('addTagToResume', async (data: any, { rejectWithValue }) => {
  try {
    const { resumeId, tagId } = data
    const response = await ApiRequest.builder().auth().request('patch', `resumes/${resumeId}/tags`, { tag_id: tagId })

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const resumeAddTagSlice = createSlice({
  name: 'resumeAddTag',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearResumeAddTag: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, addTagToResume)
  }
})


export const removeTagFromResume: any = createAsyncThunk('removeTagFromResume', async (data: any, { rejectWithValue }) => {
  try {
    const { resumeId, tagId } = data
    const response = await ApiRequest.builder().auth().request('delete', `resumes/${resumeId}/tags`, { tag_id: tagId })

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const resumeRemoveTagSlice = createSlice({
  name: 'resumeRemoveTag',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearResumeRemoveTag: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, removeTagFromResume)
  }
})


export const addAssigneeToResume: any = createAsyncThunk('addAssigneeToResume', async (data: any, { rejectWithValue }) => {
  try {
    const { resumeId, userId } = data
    const response = await ApiRequest.builder().auth().request('patch', `resumes/${resumeId}/assigners`, { user_id: userId })

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const resumeAddAssigneeSlice = createSlice({
  name: 'resumeAddAssignee',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearResumeAddAssignee: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, addAssigneeToResume)
  }
})


export const removeAssigneeFromResume: any = createAsyncThunk('removeAssigneeFromResume', async (data: any, { rejectWithValue }) => {
  try {
    const { resumeId, userId } = data
    const response = await ApiRequest.builder().auth().request('delete', `resumes/${resumeId}/assigners`, { user_id: userId })

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const resumeRemoveAssigneeSlice = createSlice({
  name: 'resumeRemoveAssignee',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearResumeRemoveAssignee: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, removeAssigneeFromResume)
  }
})


export const endWorkResume: any = createAsyncThunk('endWorkResume', async (data: any, { rejectWithValue }) => {
  try {
    const resumeId = popObjectItemByKey(data, 'resumeId')
    const response = await ApiRequest.builder().auth().request('patch', `resumes/${resumeId}/end-cooperation`, data)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const resumeEndWorkSlice = createSlice({
  name: 'resumeEndWork',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearResumeEndWork: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, endWorkResume)
  }
})


export const addCommentToResume: any = createAsyncThunk('addCommentToResume', async (data: any, { rejectWithValue }) => {
  try {
    const { resumeId, body } = data
    const response = await ApiRequest.builder().auth().request('patch', `resumes/${resumeId}/comments`, { body })

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const resumeAddCommentSlice = createSlice({
  name: 'resumeAddComment',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearResumeAddComment: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, addCommentToResume)
  }
})


export const getResumes: any = createAsyncThunk('getResumes', async (query: string = '', { rejectWithValue }) => {
  try {
    const searchQuery = query ? '?query=' + query : ''
    const response = await ApiRequest.builder().auth().request('get', `resumes${searchQuery}`)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const resumesListSlice = createSlice({
  name: 'resumesList',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    createExtraReducers(builder, getResumes, true)
  }
})


export const { clearCreateResume } = resumeCreateSlice.actions
export const { clearEditResume } = resumeEditSlice.actions
export const { clearResumeAddFiles } = resumeAddFilesSlice.actions
export const { clearResumeUpdateStatus } = resumeUpdateStatusSlice.actions
export const { clearResumeAddCallHistory } = resumeAddCallHistorySlice.actions
export const { clearResumeAddInterview } = resumeAddInterviewSlice.actions
export const { clearResumeHire } = resumeHireSlice.actions
export const { clearResumeReject } = resumeRejectSlice.actions
export const { clearResumeAddTag } = resumeAddTagSlice.actions
export const { clearResumeRemoveTag } = resumeRemoveTagSlice.actions
export const { clearResumeAddAssignee } = resumeAddAssigneeSlice.actions
export const { clearResumeRemoveAssignee } = resumeRemoveAssigneeSlice.actions
export const { clearResumeEndWork } = resumeEndWorkSlice.actions
export const { clearResumeAddComment } = resumeAddCommentSlice.actions

export const resumeCreateReducer = resumeCreateSlice.reducer
export const resumeEditReducer = resumeEditSlice.reducer
export const resumeAddFilesReducer = resumeAddFilesSlice.reducer
export const resumeReducer = resumeSlice.reducer
export const resumeUpdateStatusReducer = resumeUpdateStatusSlice.reducer
export const resumeAddCallHistoryReducer = resumeAddCallHistorySlice.reducer
export const resumeAddInterviewReducer = resumeAddInterviewSlice.reducer
export const resumeHireReducer = resumeHireSlice.reducer
export const resumeRejectReducer = resumeRejectSlice.reducer
export const resumeAddTagReducer = resumeAddTagSlice.reducer
export const resumeRemoveTagReducer = resumeRemoveTagSlice.reducer
export const resumeAddAssigneeReducer = resumeAddAssigneeSlice.reducer
export const resumeRemoveAssigneeReducer = resumeRemoveAssigneeSlice.reducer
export const resumeEndWorkReducer = resumeEndWorkSlice.reducer
export const resumeAddCommentReducer = resumeAddCommentSlice.reducer
export const resumesListReducer = resumesListSlice.reducer

export const selectResume = (state: any) => state.resume
export const selectResumeAddComment = (state: any) => state.resumeAddComment
