import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import ApiRequest from "src/helpers/ApiRequest"

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

export const usersListReducer = usersListSlice.reducer
