// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import project from 'src/store/apps/project'
import user from 'src/store/apps/user'
import { addCompanyManagerReducer, companiesListReducer, companyManagersReducer, companyProjectsReducer, companyReducer, companyResumesReducer, createCompanyReducer, editCompanyReducer, removeCompanyManagerReducer } from './company'
import { createProjectReducer, projectReducer, projectsListReducer } from './project'
import { usersListReducer } from './user'
import successHandler from 'src/middlewares/successHandler'
import { usernameCheckReducer } from './auth'
import errorHandler from 'src/middlewares/errorHandler'

export const store = configureStore({
  reducer: {
    project,
    user,

    companiesList: companiesListReducer,
    company: companyReducer,
    companyManagers: companyManagersReducer,
    companyProjects: companyProjectsReducer,
    companyResumes: companyResumesReducer,
    createCompany: createCompanyReducer,
    editCompany: editCompanyReducer,
    addCompanyManager: addCompanyManagerReducer,
    removeCompanyManager: removeCompanyManagerReducer,

    projectsList: projectsListReducer,
    projectFind: projectReducer,
    createProject: createProjectReducer,

    usersList: usersListReducer,

    usernameCheck: usernameCheckReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat([successHandler, errorHandler])
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
