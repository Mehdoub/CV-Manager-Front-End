// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import project from 'src/store/apps/project'
import user from 'src/store/apps/user'
import {
  companyDeactiveReducer,
  addCompanyManagerReducer,
  companiesListReducer,
  companyManagersReducer,
  companyProjectsReducer,
  companyReducer,
  companyResumesReducer,
  createCompanyReducer,
  editCompanyReducer,
  removeCompanyManagerReducer,
  companyActiveReducer,
  companyStatisticsResumeByStatesReducer,
  companyStatisticsResumeStatesInLastMonthReducer,
  companyStatisticsResumeCountByProjectsReducer,
  companyStatisticsResumeCountFromMonthReducer
} from './company'
import {
  addProjectManagerReducer,
  createProjectReducer,
  projectActiveReducer,
  projectDeactiveReducer,
  projectEditReducer,
  projectManagersReducer,
  projectPositionsReducer,
  projectReducer,
  projectResumesReducer,
  projectsListReducer,
  removeProjectManagerReducer
} from './project'
import { userBanReducer, userChangePasswordReducer, userEditReducer, userLoginHistoryReducer, userPermitReducer, userReducer, usersListReducer } from './user'
import successHandler from 'src/middlewares/successHandler'
import { usernameCheckReducer, verificationCodeCheckReducer, verificationCodeSendReducer } from './auth'
import errorHandler from 'src/middlewares/errorHandler'
import { positionActiveReducer, positionCreateReducer, positionDeactiveReducer, positionEditReducer, positionManagerAddReducer, positionManagerRemoveReducer, positionManagersReducer, positionReducer, positionResumesReducer, positionsListReducer } from './position'
import { constantsReducer } from './common'
import { roleCreateReducer, roleEditReducer, rolesReducer } from './role'
import { permissionsGroupedReducer } from './permission'
import { resumeAddCallHistoryReducer, resumeAddAssigneeReducer, resumeAddFilesReducer, resumeAddInterviewReducer, resumeAddTagReducer, resumeCreateReducer, resumeEditReducer, resumeEndWorkReducer, resumeHireReducer, resumeReducer, resumeRejectReducer, resumeRemoveAssigneeReducer, resumeRemoveTagReducer, resumeUpdateStatusReducer, resumeAddCommentReducer } from './resume'
import { citiesByProvinceReducer, provincesReducer } from './province'
import { tagCreateReducer, tagsReducer } from './tag'

export const store = configureStore({
  reducer: {
    project,
    userfind: user,

    companiesList: companiesListReducer,
    company: companyReducer,
    companyManagers: companyManagersReducer,
    companyProjects: companyProjectsReducer,
    companyResumes: companyResumesReducer,
    createCompany: createCompanyReducer,
    editCompany: editCompanyReducer,
    addCompanyManager: addCompanyManagerReducer,
    removeCompanyManager: removeCompanyManagerReducer,
    companyDeactive: companyDeactiveReducer,
    companyActive: companyActiveReducer,
    companyStatisticsResumeByStates: companyStatisticsResumeByStatesReducer,
    companyStatisticsResumeStatesInLastMonth: companyStatisticsResumeStatesInLastMonthReducer,
    companyStatisticsResumeCountByProjects: companyStatisticsResumeCountByProjectsReducer,
    companyStatisticsResumeCountFromMonth: companyStatisticsResumeCountFromMonthReducer,

    projectsList: projectsListReducer,
    projectFind: projectReducer,
    createProject: createProjectReducer,
    projectDeactive: projectDeactiveReducer,
    projectActive: projectActiveReducer,
    projectManagers: projectManagersReducer,
    addProjectManager: addProjectManagerReducer,
    removeProjectManager: removeProjectManagerReducer,
    projectPositions: projectPositionsReducer,
    projectResumes: projectResumesReducer,
    projectEdit: projectEditReducer,

    positionsList: positionsListReducer,
    position: positionReducer,
    positionCreate: positionCreateReducer,
    positionDeactive: positionDeactiveReducer,
    positionActive: positionActiveReducer,
    positionManagers: positionManagersReducer,
    positionManagerAdd: positionManagerAddReducer,
    positionManagerRemove: positionManagerRemoveReducer,
    positionEdit: positionEditReducer,
    positionResumes: positionResumesReducer,

    usersList: usersListReducer,
    user: userReducer,
    userBan: userBanReducer,
    userPermit: userPermitReducer,
    userChangePassword: userChangePasswordReducer,
    userLoginHistory: userLoginHistoryReducer,
    userEdit: userEditReducer,

    usernameCheck: usernameCheckReducer,
    verificationCodeSend: verificationCodeSendReducer,
    verificationCodeCheck: verificationCodeCheckReducer,

    constants: constantsReducer,

    roles: rolesReducer,
    roleCreate: roleCreateReducer,
    roleEdit: roleEditReducer,

    permissionsGrouped: permissionsGroupedReducer,

    resumeCreate: resumeCreateReducer,
    resumeEdit: resumeEditReducer,
    resumeAddFiles: resumeAddFilesReducer,
    resume: resumeReducer,
    resumeUpdateStatus: resumeUpdateStatusReducer,
    resumeAddCallHistory: resumeAddCallHistoryReducer,
    resumeAddInterview: resumeAddInterviewReducer,
    resumeHire: resumeHireReducer,
    resumeReject: resumeRejectReducer,
    resumeAddTag: resumeAddTagReducer,
    resumeRemoveTag: resumeRemoveTagReducer,
    resumeAddAssignee: resumeAddAssigneeReducer,
    resumeRemoveAssignee: resumeRemoveAssigneeReducer,
    resumeEndWork: resumeEndWorkReducer,
    resumeAddComment: resumeAddCommentReducer,

    provinces: provincesReducer,
    citiesByProvince: citiesByProvinceReducer,

    tagCreate: tagCreateReducer,
    tags: tagsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat([successHandler, errorHandler])
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
