import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import ApiRequest from "src/helpers/ApiRequest"
import { clearStatesAction, createExtraReducers, popObjectItemByKey, sliceInitialStateWithStatus } from "src/helpers/functions"


export const editProfile: any = createAsyncThunk(
  'editProfile',
  async (data: any,
    { rejectWithValue }) => {
    try {
      const avatar = popObjectItemByKey(data, 'avatar')

      const response = await ApiRequest.builder().auth().request('patch', `profile`, data)

      if (avatar) {
        await ApiRequest.builder()
          .auth()
          .contentType('multipart/form-data')
          .request('patch', `profile/avatar`, { avatar })
      }

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const profileEditSlice = createSlice({
  name: 'profileEdit',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearProfileEdit: (state) => {
      clearStatesAction(state)
    }
  },
  extraReducers: (builder) => {
    createExtraReducers(builder, editProfile)
  }
})


export const { clearProfileEdit } = profileEditSlice.actions

export const profileEditReducer = profileEditSlice.reducer
