import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiRequest from "src/helpers/ApiRequest";

export const getProjects: any = createAsyncThunk(
  'getProjects',
  async (params:
    { page: number, size: number, query: string } = { page: 1, size: 10, query: '' },
    { rejectWithValue }) => {
    try {
      const { page, size, query } = params
      const response = await ApiRequest.builder().auth().page(page).size(size).query(query).request('get', 'projects')

      return response.data
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
      state.data = action.payload.data[0]
    })
    builder.addCase(getProjects.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.data = {}
    })
  }
})


export const getProject: any = createAsyncThunk(
  'getProject',
  async (projectId: string,
    { rejectWithValue }) => {
    try {
      const response = await ApiRequest.builder().auth().request('get', `projects/${projectId}`)

      return response.data
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const projectSlice = createSlice({
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
      state.data = action.payload.data[0]
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
      const response = await ApiRequest.builder().auth().request('post', 'projects', data)

      return response.data
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

export const { clearCreateProject } = createProjectSlice.actions

export const projectsListReducer = projectsListSlice.reducer
export const projectReducer = projectSlice.reducer
export const createProjectReducer = createProjectSlice.reducer
