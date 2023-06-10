import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import ApiRequest from "src/helpers/ApiRequest"
import { clearStatesAction, createExtraReducers, popObjectItemByKey, sliceInitialStateWithData, sliceInitialStateWithStatus } from "src/helpers/functions"


export const editProfile: any = createAsyncThunk(
  'editProfile',
  async (data: any,
    { rejectWithValue }) => {
    try {
      const avatar = popObjectItemByKey(data, 'avatar')

      const response = await ApiRequest.builder().auth().request('patch', `profile`, data)

      if (avatar) {
        await ApiRequest.builder()
          .auth()
          .contentType('multipart/form-data')
          .request('patch', `profile/avatar`, { avatar })
      }

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const profileEditSlice = createSlice({
  name: 'profileEdit',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearProfileEdit: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, editProfile)
  }
})


export const getNotifications: any = createAsyncThunk('getNotifications', async (params: { page: number, size: number, state: string }, { rejectWithValue }) => {
  try {
    const { page, size, state } = params
    const response = await ApiRequest.builder().auth().request('get', `profile/notifications?state=${state}&page=${page}&size=${size}`)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const profileNotificationsSlice = createSlice({
  name: 'profileNotifications',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    createExtraReducers(builder, getNotifications, true, true)
  }
})


export const seenNotifications: any = createAsyncThunk('seenNotifications', async (_, { rejectWithValue }) => {
  try {
    const response = await ApiRequest.builder().auth().request('patch', 'profile/observed-notifications')

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const profileNotificationsSeenSlice = createSlice({
  name: 'profileNotificationsSeen',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearProfileNotificationsSeen: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, seenNotifications)
  }
})


export const { clearProfileEdit } = profileEditSlice.actions
export const { clearProfileNotificationsSeen } = profileNotificationsSeenSlice.actions

export const profileEditReducer = profileEditSlice.reducer
export const profileNotificationsReducer = profileNotificationsSlice.reducer
export const profileNotificationsSeenReducer = profileNotificationsSeenSlice.reducer
