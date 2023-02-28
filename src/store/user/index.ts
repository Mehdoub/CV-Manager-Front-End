import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import ApiRequest from "src/helpers/ApiRequest"
import { clearStatesAction, createExtraReducers, sliceInitialStateWithData, sliceInitialStateWithStatus } from "src/helpers/functions"

export const getUsers: any = createAsyncThunk(
  'getUsers',
  async (params:
    { page: number, size: number, query: string } = { page: 1, size: 10, query: '' },
    { rejectWithValue }) => {
    try {
      const { page, size, query } = params
      const response = await ApiRequest.builder().auth().page(page).size(size).query(query).request('get', 'users')

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const usersListSlice = createSlice({
  name: 'usersList',
  initialState: {
    loading: false,
    errors: {},
    data: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, state => {
      state.loading = true
    })
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.loading = false
      state.errors = []
      state.data = action.payload.data.data[0]
    })
    builder.addCase(getUsers.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.data = {}
    })
  }
})

export const getUser: any = createAsyncThunk('getUser', async (userId: string, { rejectWithValue }) => {
  try {
    const response = await ApiRequest.builder().auth().request('get', `users/${userId}`)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const userSlice = createSlice({
  name: 'user',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    createExtraReducers(builder, getUser, true, true)
  }
})


export const banUser = createAsyncThunk(
  'banUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { user: { data: user } } = getState() as any
      const response = await ApiRequest.builder().auth().request('post', `users/${user?.id}/ban`)

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const userBanSlice = createSlice({
  name: 'userBan',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearUserBan: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, banUser)
  }
})

export const usersListReducer = usersListSlice.reducer
export const userReducer = userSlice.reducer
export const userBanReducer = userBanSlice.reducer
