import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiRequest from "src/helpers/ApiRequest";
import { clearStatesAction, createExtraReducers, sliceInitialStateWithData, sliceInitialStateWithStatus } from "src/helpers/functions";


export const getRoles: any = createAsyncThunk('getRoles', async (_, { rejectWithValue }) => {
  try {
    const response = await ApiRequest.builder().auth().request('get', 'roles')

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const rolesSlice = createSlice({
  name: 'roles',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    createExtraReducers(builder, getRoles, true, true)
  }
})


export const createRole: any = createAsyncThunk('createRole', async (data: any, { rejectWithValue }) => {
  try {
    const response = await ApiRequest.builder().auth().request('post', 'roles', data)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const roleCreateSlice = createSlice({
  name: 'roleCreate',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearCreateRole: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, createRole)
  }
})


export const editRole: any = createAsyncThunk('editRole', async (data: any, { rejectWithValue }) => {
  try {
    const response = await ApiRequest.builder().auth().request('patch', `roles/${data?.id}`, data)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const roleEditSlice = createSlice({
  name: 'roleEdit',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearEditRole: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, editRole)
  }
})

export const { clearCreateRole } = roleCreateSlice.actions
export const { clearEditRole } = roleEditSlice.actions

export const rolesReducer = rolesSlice.reducer
export const roleCreateReducer = roleCreateSlice.reducer
export const roleEditReducer = roleEditSlice.reducer
