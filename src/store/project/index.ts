import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiRequest from "src/helpers/ApiRequest";
import { createExtraReducers, defaultFulfilledStatesValue, defaultPendingStatesValue, defaultRejectedStatesValue, popObjectItemByKey, sliceInitialStateWithData, sliceInitialStateWithStatus } from "src/helpers/functions";
import { ProjectEditData } from "src/views/pages/project/view/ProjectEditDialog";

export const getProjects: any = createAsyncThunk(
  'getProjects',
  async (params:
    { page: number, size: number, query: string } = { page: 1, size: 10, query: '' },
    { rejectWithValue }) => {
    try {
      const { page, size, query } = params
      const response = await ApiRequest.builder().auth().page(page).size(size).query(query).request('get', 'projects')

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const projectsListSlice = createSlice({
  name: 'projectsList',
  initialState: {
    loading: false,
    errors: {},
    data: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjects.pending, state => {
      state.loading = true
    })
    builder.addCase(getProjects.fulfilled, (state, action) => {
      state.loading = false
      state.errors = []
      state.data = action.payload.data.data[0]
    })
    builder.addCase(getProjects.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.data = {}
    })
  }
})

export const getProjectsForSearch: any = createAsyncThunk(
  'getProjectsForSearch',
  async (params:
    { page: number, size: number, query: string } = { page: 1, size: 10, query: '' },
    { rejectWithValue }) => {
    try {
      const { page, size, query } = params
      const response = await ApiRequest.builder().auth().page(page).size(size).query(query).request('get', 'projects')

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const projectsListForSearchSlice = createSlice({
  name: 'projectsListForSearchForSearch',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    createExtraReducers(builder, getProjectsForSearch, true, true)
  }
})


export const getProject: any = createAsyncThunk(
  'getProject',
  async (projectId: string,
    { rejectWithValue }) => {
    try {
      const response = await ApiRequest.builder().auth().request('get', `projects/${projectId}`)

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const projectSlice: any = createSlice({
  name: 'project',
  initialState: {
    loading: false,
    errors: {},
    data: {},
    managers: [] as any,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProject.pending, state => {
      state.loading = true
      state.errors = []
      state.data = {}
      state.managers = []
    })
    builder.addCase(getProject.fulfilled, (state, action) => {
      state.loading = false
      state.errors = []
      state.data = action.payload.data.data[0]
      state.managers = [{ ...action?.payload?.data[0]?.created_by, type: 'owner' }]
    })
    builder.addCase(getProject.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.data = {}
      state.managers = []
    })
  }
})

export const createProject: any = createAsyncThunk(
  'createProject',
  async (data: any,
    { rejectWithValue }) => {
    try {
      const projectLogo = popObjectItemByKey(data, 'logo')

      const response = await ApiRequest.builder().auth().request('post', 'projects', data)

      const newProjectId = response?.data?.data[0]?.id

      if (projectLogo && newProjectId) {
        await ApiRequest.builder()
          .auth()
          .contentType('multipart/form-data')
          .request('patch', `projects/${newProjectId}/logo`, { logo: projectLogo })
      }

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const createProjectSlice = createSlice({
  name: 'createProject',
  initialState: {
    loading: false,
    errors: {},
    status: false,
  },
  reducers: {
    clearCreateProject: (state) => {
      state.loading = false
      state.status = false
      state.errors = []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createProject.pending, state => {
      state.loading = true
      state.status = false
      state.errors = []
    })
    builder.addCase(createProject.fulfilled, (state) => {
      state.loading = false
      state.status = true
      state.errors = []
    })
    builder.addCase(createProject.rejected, (state, action) => {
      state.loading = false
      state.status = false
      state.errors = action.payload
    })
  }
})

export const deactiveProject: any = createAsyncThunk(
  'deactiveProject',
  async (projectId: string,
    { rejectWithValue }) => {
    try {
      const response = await ApiRequest.builder().auth().request('patch', `projects/${projectId}/deactive`)

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const projectDeactiveSlice = createSlice({
  name: 'projectDeactive',
  initialState: {
    loading: false,
    errors: {},
    status: false,
  },
  reducers: {
    clearDeactiveProject: (state) => {
      state.loading = false
      state.status = false
      state.errors = {}
    }
  },
  extraReducers: (builder) => {
    builder.addCase(deactiveProject.pending, state => {
      state.loading = true
      state.status = false
      state.errors = {}
    })
    builder.addCase(deactiveProject.fulfilled, (state) => {
      state.loading = false
      state.errors = {}
      state.status = true
    })
    builder.addCase(deactiveProject.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.status = false
    })
  }
})

export const activeProject: any = createAsyncThunk(
  'activeProject',
  async (projectId: string,
    { rejectWithValue }) => {
    try {
      const response = await ApiRequest.builder().auth().request('patch', `projects/${projectId}/active`)

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const projectActiveSlice = createSlice({
  name: 'projectActive',
  initialState: {
    loading: false,
    errors: {},
    status: false,
  },
  reducers: {
    clearActiveProject: (state) => {
      state.loading = false
      state.status = false
      state.errors = {}
    }
  },
  extraReducers: (builder) => {
    builder.addCase(activeProject.pending, state => {
      state.loading = true
      state.status = false
      state.errors = {}
    })
    builder.addCase(activeProject.fulfilled, (state) => {
      state.loading = false
      state.errors = {}
      state.status = true
    })
    builder.addCase(activeProject.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.status = false
    })
  }
})

export const getProjectManagers: any = createAsyncThunk(
  'getProjectManagers',
  async (projectId: string,
    { rejectWithValue }) => {
    try {
      const response = await ApiRequest.builder().auth().request('get', `projects/${projectId}/managers`)

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const projectManagersSlice = createSlice({
  name: 'projectManagers',
  initialState: {
    loading: false,
    errors: {},
    data: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectManagers.pending, state => {
      state.loading = true
      state.errors = []
      state.data = {}
    })
    builder.addCase(getProjectManagers.fulfilled, (state, action) => {
      state.loading = false
      state.errors = []
      state.data = action.payload.data.data
    })
    builder.addCase(getProjectManagers.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.data = {}
    })
  }
})

export interface AddProjectManagerParams {
  projectId: string
  manager_id: string
}

export const addProjectManager: any = createAsyncThunk(
  'addProjectManager',
  async (data: AddProjectManagerParams,
    { rejectWithValue }) => {
    try {
      const { manager_id } = data
      const response = await ApiRequest.builder().auth().request('patch', `projects/${data?.projectId}/manager`, { manager_id })

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const addProjectManagerSlice = createSlice({
  name: 'addProjectManager',
  initialState: {
    loading: false,
    errors: [],
    status: false,
  },
  reducers: {
    clearAddProjectManager: (state) => {
      state.loading = false
      state.status = false
      state.errors = []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addProjectManager.pending, state => {
      state.loading = true
      state.status = false
      state.errors = []
    })
    builder.addCase(addProjectManager.fulfilled, (state, action) => {
      state.loading = false
      state.errors = []
      state.status = true
    })
    builder.addCase(addProjectManager.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.status = false
    })
  }
})


export interface RemoveProjectManagerParams {
  projectId: string
  manager_id: string
}

export const removeProjectManager: any = createAsyncThunk(
  'removeProjectManager',
  async (data: RemoveProjectManagerParams,
    { rejectWithValue }) => {
    try {
      const { manager_id } = data
      const response = await ApiRequest.builder().auth().request('delete', `projects/${data?.projectId}/manager`, { manager_id })

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const removeProjectManagerSlice = createSlice({
  name: 'removeProjectManager',
  initialState: {
    loading: false,
    errors: [],
    status: false,
  },
  reducers: {
    clearRemoveProjectManager: (state) => {
      state.loading = false
      state.status = false
      state.errors = []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(removeProjectManager.pending, state => {
      state.loading = true
      state.status = false
      state.errors = []
    })
    builder.addCase(removeProjectManager.fulfilled, (state, action) => {
      state.loading = false
      state.errors = []
      state.status = true
    })
    builder.addCase(removeProjectManager.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.status = false
    })
  }
})

export const getProjectPositions: any = createAsyncThunk(
  'getProjectPositions',
  async (projectId: string | undefined = undefined, { rejectWithValue, getState }) => {
    try {
      const { project: { data } } = getState() as any
      const project = projectId ?? data?.id
      const response = await ApiRequest.builder().auth().request('get', `projects/${project}/positions`)

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const projectPositionsSlice = createSlice({
  name: 'projectPositions',
  initialState: {
    loading: false,
    errors: {},
    data: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectPositions.pending, state => {
      state.loading = true
      state.errors = []
      state.data = {}
    })
    builder.addCase(getProjectPositions.fulfilled, (state, action) => {
      state.loading = false
      state.errors = []
      state.data = action.payload.data.data
    })
    builder.addCase(getProjectPositions.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.data = {}
    })
  }
})

export const getProjectResumes: any = createAsyncThunk(
  'getProjectResumes',
  async (_,
    { rejectWithValue, getState }) => {
    try {
      const { project: { data } } = getState() as any
      const response = await ApiRequest.builder().auth().request('get', `projects/${data?.id}/resumes`)

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const projectResumesSlice = createSlice({
  name: 'projectResumes',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectResumes.pending, state => {
      defaultPendingStatesValue(state)
    })
    builder.addCase(getProjectResumes.fulfilled, (state, action) => {
      defaultFulfilledStatesValue(state, action)
    })
    builder.addCase(getProjectResumes.rejected, (state, action) => {
      defaultRejectedStatesValue(state, action)
    })
  }
})


export const editProject: any = createAsyncThunk(
  'editProject',
  async (data: ProjectEditData,
    { rejectWithValue }) => {
    try {
      const projectId = popObjectItemByKey(data, 'projectId')
      const projectLogo = popObjectItemByKey(data, 'logo')

      const response = await ApiRequest.builder().auth().request('patch', `projects/${projectId}`, data)

      if (projectLogo) {
        await ApiRequest.builder()
          .auth()
          .contentType('multipart/form-data')
          .request('patch', `projects/${projectId}/logo`, { logo: projectLogo })
      }

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const projectEditSlice = createSlice({
  name: 'projectEdit',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearProjectEdit: (state) => {
      state.loading = false
      state.status = false
      state.errors = []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(editProject.pending, state => {
      defaultPendingStatesValue(state)
    })
    builder.addCase(editProject.fulfilled, (state) => {
      defaultFulfilledStatesValue(state)
    })
    builder.addCase(editProject.rejected, (state, action) => {
      defaultRejectedStatesValue(state, action)
    })
  }
})


export const getProjectStatisticsResumeByStates: any = createAsyncThunk('getProjectStatisticsResumeByStates', async (projectId: string, { rejectWithValue }) => {
  try {
    const response = await ApiRequest.builder().auth().request('get', `projects/${projectId}/statistics/resume-by-states`)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const projectStatisticsResumeByStatesSlice = createSlice({
  name: 'projectStatisticsResumeByStates',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    createExtraReducers(builder, getProjectStatisticsResumeByStates, true)
  }
})


export const getProjectStatisticsResumeStatesInLastMonth: any = createAsyncThunk('getProjectStatisticsResumeStatesInLastMonth', async (projectId: string, { rejectWithValue }) => {
  try {
    const response = await ApiRequest.builder().auth().request('get', `projects/${projectId}/statistics/resume-state-in-last-month`)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const projectStatisticsResumeStatesInLastMonthSlice = createSlice({
  name: 'projectStatisticsResumeStatesInLastMonth',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    createExtraReducers(builder, getProjectStatisticsResumeStatesInLastMonth, true, true)
  }
})


export const getProjectStatisticsResumeCountByPositions: any = createAsyncThunk('getProjectStatisticsResumeCountByPositions', async (projectId: string, { rejectWithValue }) => {
  try {
    const response = await ApiRequest.builder().auth().request('get', `projects/${projectId}/statistics/resume-count-by-positions`)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const projectStatisticsResumeCountByPositionsSlice = createSlice({
  name: 'projectStatisticsResumeCountByPositions',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    createExtraReducers(builder, getProjectStatisticsResumeCountByPositions, true)
  }
})


export const getProjectStatisticsResumeCountFromMonth: any = createAsyncThunk('getProjectStatisticsResumeCountFromMonth', async (projectId: string, { rejectWithValue }) => {
  try {
    const response = await ApiRequest.builder().auth().request('get', `projects/${projectId}/statistics/resume-count-from-month`)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const projectStatisticsResumeCountFromMonthSlice = createSlice({
  name: 'projectStatisticsResumeCountFromMonth',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    createExtraReducers(builder, getProjectStatisticsResumeCountFromMonth, true, true)
  }
})


export const { clearCreateProject } = createProjectSlice.actions
export const { clearDeactiveProject } = projectDeactiveSlice.actions
export const { clearActiveProject } = projectActiveSlice.actions
export const { clearRemoveProjectManager } = removeProjectManagerSlice.actions
export const { clearAddProjectManager } = addProjectManagerSlice.actions
export const { clearProjectEdit } = projectEditSlice.actions
export const projectDeactiveReducer = projectDeactiveSlice.reducer
export const projectsListReducer = projectsListSlice.reducer
export const projectsListForSearchReducer = projectsListForSearchSlice.reducer
export const projectReducer = projectSlice.reducer
export const createProjectReducer = createProjectSlice.reducer
export const projectActiveReducer = projectActiveSlice.reducer
export const projectManagersReducer = projectManagersSlice.reducer
export const addProjectManagerReducer = addProjectManagerSlice.reducer
export const removeProjectManagerReducer = removeProjectManagerSlice.reducer
export const projectPositionsReducer = projectPositionsSlice.reducer
export const projectResumesReducer = projectResumesSlice.reducer
export const projectEditReducer = projectEditSlice.reducer
export const projectStatisticsResumeByStatesReducer = projectStatisticsResumeByStatesSlice.reducer
export const projectStatisticsResumeStatesInLastMonthReducer = projectStatisticsResumeStatesInLastMonthSlice.reducer
export const projectStatisticsResumeCountByPositionsReducer = projectStatisticsResumeCountByPositionsSlice.reducer
export const projectStatisticsResumeCountFromMonthReducer = projectStatisticsResumeCountFromMonthSlice.reducer
