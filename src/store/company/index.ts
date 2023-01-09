import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiRequest from "src/helpers/ApiRequest";

export const getCompanies : any = createAsyncThunk(
  'getCompanies',
  async (params:
    { page: number, size: number, query: string } = { page: 1, size: 10, query: '' },
    { rejectWithValue }) => {
    try {
      const { page, size, query } = params
      const response = await ApiRequest.builder().auth().page(page).size(size).query(query).request('get', 'companies')

      return response.data
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const companiesListSlice = createSlice({
  name: 'companiesList',
  initialState: {
    loading: false,
    errors: {},
    data: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCompanies.pending, state => {
      state.loading = true
    })
    builder.addCase(getCompanies.fulfilled, (state, action) => {
      state.loading = false
      state.errors = []
      state.data = action.payload.data[0]
    })
    builder.addCase(getCompanies.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.data = {}
    })
  }
})

export const companiesListReducer = companiesListSlice.reducer
