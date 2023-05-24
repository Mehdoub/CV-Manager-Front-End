import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiRequest from "src/helpers/ApiRequest";
import { clearStatesAction, createExtraReducers, sliceInitialStateWithStatus } from "src/helpers/functions";


export const checkUsername: any = createAsyncThunk('checkUsername', async (username: string, { rejectWithValue }) => {
  try {
    const response = await ApiRequest.builder().request('post', 'auth/username-isavailable', { username })

    return response
  } catch (err: any) {
    return rejectWithValue(err.response)
  }
})

const usernameCheckSlice = createSlice({
  name: 'usernameCheck',
  initialState: {
    loading: false,
    isAvailable: null,
    errors: {},
  },
  reducers: {
    clearUsernameCheck: (state) => {
      state.isAvailable = null
      state.loading = false
      state.errors = {}
    }
  },
  extraReducers: builder => {
    builder.addCase(checkUsername.pending, state => {
      state.loading = true
      state.isAvailable = null
      state.errors = {}
    })
    builder.addCase(checkUsername.fulfilled, state => {
      state.loading = false
      state.isAvailable = true
      state.errors = {}
    })
    builder.addCase(checkUsername.rejected, (state, action) => {
      state.loading = false
      state.isAvailable = false
      state.errors = action.payload
    })
  }
})


export const sendVerificationCode: any = createAsyncThunk('sendVerificationCode', async (data: any, { rejectWithValue }) => {
  try {
    const response = await ApiRequest.builder().auth().request('post', `auth/send-verify`)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const verificationCodeSendSlice = createSlice({
  name: 'verificationCodeSend',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearVerificationCodeSend: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, sendVerificationCode)
  }
})


export const checkVerificationCode: any = createAsyncThunk('checkVerificationCode', async (verificationCode: string, { rejectWithValue }) => {
  try {
    const response = await ApiRequest.builder().auth().request('post', `auth/check-verify`, { 'verify_code': verificationCode })

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const verificationCodeCheckSlice = createSlice({
  name: 'verificationCodeCheck',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearVerificationCodeCheck: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, checkVerificationCode)
  }
})

export const { clearUsernameCheck } = usernameCheckSlice.actions
export const { clearVerificationCodeSend } = verificationCodeSendSlice.actions
export const { clearVerificationCodeCheck } = verificationCodeCheckSlice.actions
export const usernameCheckReducer = usernameCheckSlice.reducer
export const verificationCodeSendReducer = verificationCodeSendSlice.reducer
export const verificationCodeCheckReducer = verificationCodeCheckSlice.reducer
