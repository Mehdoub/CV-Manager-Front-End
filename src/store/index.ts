// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import project from 'src/store/apps/project'
import user from 'src/store/apps/user'
import { companiesListReducer, companyManagersReducer, companyReducer, createCompanyReducer } from './company'
import { createProjectReducer, projectReducer, projectsListReducer } from './project'
import { usersListReducer } from './user'

export const store = configureStore({
  reducer: {
    project,
    user,

    companiesList: companiesListReducer,
    company: companyReducer,
    companyManagers: companyManagersReducer,
    createCompany: createCompanyReducer,

    projectsList: projectsListReducer,
    projectFind: projectReducer,
    createProject: createProjectReducer,

    usersList: usersListReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
