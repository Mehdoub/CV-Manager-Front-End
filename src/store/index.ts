// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import project from 'src/store/apps/project'
import user from 'src/store/apps/user'

export const store = configureStore({
  reducer: {
    project,
    user,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
