import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import ApiRequest from "src/helpers/ApiRequest"
import { createExtraReducers, sliceInitialStateWithData } from "src/helpers/functions"

export const getProvinces: any = createAsyncThunk('getProvinces', async (_, { rejectWithValue }) => {
  try {
    const response = await ApiRequest.builder().auth().request('get', 'provinces')

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const provincesSlice = createSlice({
  name: 'provinces',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    createExtraReducers(builder, getProvinces, true)
  }
})

export const getCitiesByProvince: any = createAsyncThunk('getCitiesByProvince', async (provinceId: string, { rejectWithValue }) => {
  try {
    const response = await ApiRequest.builder().auth().request('get', `provinces/${provinceId}/cities`)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const citiesByProvinceSlice = createSlice({
  name: 'citiesByProvince',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    createExtraReducers(builder, getCitiesByProvince, true)
  }
})


export const provincesReducer = provincesSlice.reducer
export const citiesByProvinceReducer = citiesByProvinceSlice.reducer
