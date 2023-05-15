import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import ApiRequest from "src/helpers/ApiRequest"
import { clearStatesAction, createExtraReducers, popObjectItemByKey, sliceInitialStateWithData, sliceInitialStateWithStatus } from "src/helpers/functions"

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

export const permitUser = createAsyncThunk(
  'permitUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { user: { data: user } } = getState() as any
      const response = await ApiRequest.builder().auth().request('post', `users/${user?.id}/unban`)

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const userPermitSlice = createSlice({
  name: 'userPermit',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearUserPermit: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, permitUser)
  }
})


export interface ChangePasswordParams {
  user_id: string
  old_password: string
  password: string
}
export const changePassword: any = createAsyncThunk('changePassword', async (data: ChangePasswordParams, { rejectWithValue }) => {
  try {
    const response = await ApiRequest.builder().auth().request('patch', 'users/change-password', data)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const userChangePasswordSlice = createSlice({
  name: 'userChangePassword',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearChangePassword: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, changePassword)
  }
})


export const getUserLoginHistory: any = createAsyncThunk('getUserLoginHistory', async (_, { rejectWithValue, getState }) => {
  try {
    const { user: { data: user } } = getState() as any
    const response = await ApiRequest.builder().auth().request('get', `users/${user?.id}/login-history`)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const userLoginHistorySlice = createSlice({
  name: 'userLoginHistory',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: builder => {
    createExtraReducers(builder, getUserLoginHistory, true, true)
  }
})

export const editUser: any = createAsyncThunk(
  'editUser',
  async (data: any,
    { rejectWithValue }) => {
    try {
      const avatar = popObjectItemByKey(data, 'avatar')
      const userId = popObjectItemByKey(data, 'userId')

      const response = await ApiRequest.builder().auth().request('patch', `users/${userId}`, data)

      if (avatar) {
        await ApiRequest.builder()
          .auth()
          .contentType('multipart/form-data')
          .request('patch', `users/${userId}/avatar`, { avatar })
      }

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const userEditSlice = createSlice({
  name: 'userEdit',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearUserEdit: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, editUser)
  }
})

export const { clearUserBan } = userBanSlice.actions
export const { clearUserPermit } = userPermitSlice.actions
export const { clearChangePassword } = userChangePasswordSlice.actions
export const { clearUserEdit } = userEditSlice.actions
export const usersListReducer = usersListSlice.reducer
export const userReducer = userSlice.reducer
export const userBanReducer = userBanSlice.reducer
export const userPermitReducer = userPermitSlice.reducer
export const userChangePasswordReducer = userChangePasswordSlice.reducer
export const userLoginHistoryReducer = userLoginHistorySlice.reducer
export const userEditReducer = userEditSlice.reducer
