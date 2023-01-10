import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiRequest from "src/helpers/ApiRequest";

export const getCompanies: any = createAsyncThunk(
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


export const getCompany: any = createAsyncThunk(
  'getCompany',
  async (companyId: string,
    { rejectWithValue }) => {
    try {
      const response = await ApiRequest.builder().auth().request('get', `companies/${companyId}`)

      return response.data
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const companySlice = createSlice({
  name: 'company',
  initialState: {
    loading: false,
    errors: {},
    data: {},
    managers: [] as any,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCompany.pending, state => {
      state.loading = true
      state.errors = []
      state.data = {}
      state.managers = []
    })
    builder.addCase(getCompany.fulfilled, (state, action) => {
      state.loading = false
      state.errors = []
      state.data = action.payload.data[0]
      state.managers = [{...action?.payload?.data[0]?.created_by, type: 'owner'}]
    })
    builder.addCase(getCompany.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.data = {}
      state.managers = []
    })
  }
})

export const companiesListReducer = companiesListSlice.reducer
export const companyReducer = companySlice.reducer
