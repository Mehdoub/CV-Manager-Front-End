import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiRequest from "src/helpers/ApiRequest";


export const checkUsername = createAsyncThunk('checkUsername', async (username: string, { rejectWithValue }) => {
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

export const { clearUsernameCheck } = usernameCheckSlice.actions
export const usernameCheckReducer = usernameCheckSlice.reducer
