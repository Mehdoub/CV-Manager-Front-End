import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import ApiRequest from "src/helpers/ApiRequest"
import { clearStatesAction, createExtraReducers, popObjectItemByKey, sliceInitialStateWithData, sliceInitialStateWithStatus } from "src/helpers/functions"


export const createTag: any = createAsyncThunk('createTag', async (data: any, { rejectWithValue }) => {
  try {
    const response = await ApiRequest.builder().auth().request('post', 'tags', data)
    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const tagCreateSlice = createSlice({
  name: 'tagCreate',
  initialState: sliceInitialStateWithData,
  reducers: {
    clearTagCreate: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, createTag, true, true)
  }
})


export const getTags: any = createAsyncThunk('getTags', async (data: any = { query: '' }, { rejectWithValue }) => {
  try {
    const response = await ApiRequest.builder().auth().query(data?.query).request('get', 'tags')

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const tagsSlice = createSlice({
  name: 'tags',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    createExtraReducers(builder, getTags, true, true)
  }
})


export const { clearTagCreate } = tagCreateSlice.actions

export const tagCreateReducer = tagCreateSlice.reducer
export const tagsReducer = tagsSlice.reducer
