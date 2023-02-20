import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiRequest from "src/helpers/ApiRequest";
import { createExtraReducers, sliceInitialStateWithData } from "src/helpers/functions";

export const getConstants : any = createAsyncThunk('getConstants', async (_, { rejectWithValue }) => {
  try {
    const response = await ApiRequest.builder().auth().request('get', 'constant')

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const constantsSlice = createSlice({
  name: 'constants',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    createExtraReducers(builder, getConstants, true, true)
  }
})

export const constantsReducer = constantsSlice.reducer
