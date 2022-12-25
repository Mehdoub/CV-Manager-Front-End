import { configureStore, createSlice } from '@reduxjs/toolkit'

const initialState = {
  userLogin: {
    status: false,
    message: '',
    loading: false,
    userInfo: {},
    error: null,
    isAuthorized: false,
    loadingVerify: true
  }
}

const userLoginSlice = createSlice({
  name: 'userLogin',
  initialState: {
    status: false,
    message: '',
    loading: false,
    userInfo: {},
    error: null,
    isAuthorized: false,
    loadingVerify: true
  },
  reducers: {}
})
export const store = configureStore({
  reducer: {
    userLogin: userLoginSlice.reducer
  },
  preloadedState: initialState,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
