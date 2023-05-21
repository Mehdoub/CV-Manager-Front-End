import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiRequest from "src/helpers/ApiRequest";
import { createExtraReducers, sliceInitialStateWithData } from "src/helpers/functions";


export const getPermissionsGrouped: any = createAsyncThunk('getPermissionsGrouped', async (_, { rejectWithValue }) => {
  try {
    const response = await ApiRequest.builder().auth().request('get', 'permissions/entities/grouped/')

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const permissionsGroupedSlice = createSlice({
  name: 'permissionsGrouped',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    createExtraReducers(builder, getPermissionsGrouped, true)
  }
})


export const permissionsGroupedReducer = permissionsGroupedSlice.reducer
