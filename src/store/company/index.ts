import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiRequest from "src/helpers/ApiRequest";
import { createExtraReducers, defaultFulfilledStatesValue, defaultPendingStatesValue, defaultRejectedStatesValue, sliceInitialStateWithData, sliceInitialStateWithStatus } from "src/helpers/functions";
import { CompanyFormData } from "src/views/pages/company/list/AddCompanyDrawer";
import { CompanyEditData } from "src/views/pages/company/view/CompanyEditDialog";


export const getCompanies: any = createAsyncThunk(
  'getCompanies',
  async (params:
    { page: number, size: number, query: string } = { page: 1, size: 10, query: '' },
    { rejectWithValue }) => {
    try {
      const { page, size, query } = params
      const response = await ApiRequest.builder().auth().page(page).size(size).query(query).request('get', 'companies')

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const companiesListSlice = createSlice({
  name: 'companiesList',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCompanies.pending, state => {
      defaultPendingStatesValue(state)
    })
    builder.addCase(getCompanies.fulfilled, (state, action) => {
      defaultFulfilledStatesValue(state, action, true)
    })
    builder.addCase(getCompanies.rejected, (state, action) => {
      defaultRejectedStatesValue(state, action)
    })
  }
})


export const getCompany: any = createAsyncThunk(
  'getCompany',
  async (companyId: string,
    { rejectWithValue }) => {
    try {
      const response = await ApiRequest.builder().auth().request('get', `companies/${companyId}`)

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const companySlice = createSlice({
  name: 'company',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCompany.pending, state => {
      defaultPendingStatesValue(state)
    })
    builder.addCase(getCompany.fulfilled, (state, action) => {
      defaultFulfilledStatesValue(state, action, true)
    })
    builder.addCase(getCompany.rejected, (state, action) => {
      defaultRejectedStatesValue(state, action)
    })
  }
})


export const getCompanyManagers: any = createAsyncThunk(
  'getCompanyManagers',
  async (companyId: string,
    { rejectWithValue }) => {
    try {
      const response = await ApiRequest.builder().auth().request('get', `companies/${companyId}/managers`)

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const companyManagersSlice = createSlice({
  name: 'companyManagers',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCompanyManagers.pending, state => {
      defaultPendingStatesValue(state)
    })
    builder.addCase(getCompanyManagers.fulfilled, (state, action) => {
      defaultFulfilledStatesValue(state, action)
    })
    builder.addCase(getCompanyManagers.rejected, (state, action) => {
      defaultRejectedStatesValue(state, action)
    })
  }
})


export const getCompanyProjects: any = createAsyncThunk(
  'getCompanyProjects',
  async (companyId: string,
    { rejectWithValue }) => {
    try {
      const response = await ApiRequest.builder().auth().request('get', `companies/${companyId}/projects`)

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const companyProjectsSlice = createSlice({
  name: 'companyProjects',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCompanyProjects.pending, state => {
      defaultPendingStatesValue(state)
    })
    builder.addCase(getCompanyProjects.fulfilled, (state, action) => {
      defaultFulfilledStatesValue(state, action)
    })
    builder.addCase(getCompanyProjects.rejected, (state, action) => {
      defaultRejectedStatesValue(state, action)
    })
  }
})

export const getCompanyResumes: any = createAsyncThunk(
  'getCompanyResumes',
  async (companyId: string,
    { rejectWithValue }) => {
    try {
      const response = await ApiRequest.builder().auth().request('get', `companies/${companyId}/resumes`)

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const companyResumesSlice = createSlice({
  name: 'companyResumes',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCompanyResumes.pending, state => {
      defaultPendingStatesValue(state)
    })
    builder.addCase(getCompanyResumes.fulfilled, (state, action) => {
      defaultFulfilledStatesValue(state, action)
    })
    builder.addCase(getCompanyResumes.rejected, (state, action) => {
      defaultRejectedStatesValue(state, action)
    })
  }
})

export interface AddCompanyManagerParams {
  companyId: string
  manager_id: string
}

export const addCompanyManager: any = createAsyncThunk(
  'addCompanyManager',
  async (data: AddCompanyManagerParams,
    { rejectWithValue }) => {
    try {
      const { manager_id } = data
      const response = await ApiRequest.builder().auth().request('patch', `companies/${data?.companyId}/manager`, { manager_id })

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const addCompanyManagerSlice = createSlice({
  name: 'addCompanyManager',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearAddCompanyManager: (state) => {
      state.loading = false
      state.status = false
      state.errors = []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addCompanyManager.pending, state => {
      defaultPendingStatesValue(state)
    })
    builder.addCase(addCompanyManager.fulfilled, (state) => {
      defaultFulfilledStatesValue(state)
    })
    builder.addCase(addCompanyManager.rejected, (state, action) => {
      defaultRejectedStatesValue(state, action)
    })
  }
})


export interface RemoveCompanyManagerParams {
  companyId: string
  manager_id: string
}

export const removeCompanyManager: any = createAsyncThunk(
  'removeCompanyManager',
  async (data: RemoveCompanyManagerParams,
    { rejectWithValue }) => {
    try {
      const { manager_id } = data
      const response = await ApiRequest.builder().auth().request('delete', `companies/${data?.companyId}/manager`, { manager_id })

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const removeCompanyManagerSlice = createSlice({
  name: 'removeCompanyManager',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearRemoveCompanyManager: (state) => {
      state.loading = false
      state.status = false
      state.errors = []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(removeCompanyManager.pending, state => {
      defaultPendingStatesValue(state)
    })
    builder.addCase(removeCompanyManager.fulfilled, (state, action) => {
      defaultFulfilledStatesValue(state)
    })
    builder.addCase(removeCompanyManager.rejected, (state, action) => {
      defaultRejectedStatesValue(state, action)
    })
  }
})


export const createCompany: any = createAsyncThunk(
  'createCompany',
  async (data: CompanyFormData,
    { rejectWithValue }) => {
    try {
      let companyLogo: any

      if (data?.logo) {
        companyLogo = data?.logo
        delete data.logo
      }

      const response = await ApiRequest.builder().auth().request('post', 'companies', data)

      const newCompanyId = response?.data?.data[0]?.id

      if (companyLogo && newCompanyId) {
        await ApiRequest.builder()
          .auth()
          .contentType('multipart/form-data')
          .request('patch', `companies/${newCompanyId}/logo`, { logo: companyLogo })
      }

      return response?.data
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const createCompanySlice = createSlice({
  name: 'createCompany',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearCreateCompany: (state) => {
      state.loading = false
      state.status = false
      state.errors = []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createCompany.pending, state => {
      defaultPendingStatesValue(state)
    })
    builder.addCase(createCompany.fulfilled, (state) => {
      defaultFulfilledStatesValue(state)
    })
    builder.addCase(createCompany.rejected, (state, action) => {
      defaultRejectedStatesValue(state, action)
    })
  }
})


export const editCompany: any = createAsyncThunk(
  'editCompany',
  async (data: CompanyEditData,
    { rejectWithValue }) => {
    try {
      const { companyId } = data
      delete data.companyId
      let companyLogo: any

      if (data?.logo) {
        companyLogo = data?.logo
        delete data.logo
      }

      const response = await ApiRequest.builder().auth().request('patch', `companies/${companyId}`, data)

      if (companyLogo) {
        await ApiRequest.builder()
          .auth()
          .contentType('multipart/form-data')
          .request('patch', `companies/${companyId}/logo`, { logo: companyLogo })
      }

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const editCompanySlice = createSlice({
  name: 'editCompany',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearEditCompany: (state) => {
      state.loading = false
      state.status = false
      state.errors = []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(editCompany.pending, state => {
      defaultPendingStatesValue(state)
    })
    builder.addCase(editCompany.fulfilled, (state) => {
      defaultFulfilledStatesValue(state)
    })
    builder.addCase(editCompany.rejected, (state, action) => {
      defaultRejectedStatesValue(state, action)
    })
  }
})

export const deactiveCompany: any = createAsyncThunk(
  'deactiveCompany',
  async (companyId: string,
    { rejectWithValue }) => {
    try {
      const response = await ApiRequest.builder().auth().request('patch', `companies/${companyId}/deactive`)

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const companyDeactiveSlice = createSlice({
  name: 'companyDeactive',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearDeactiveCompany: (state) => {
      state.loading = false
      state.status = false
      state.errors = []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(deactiveCompany.pending, state => {
      defaultPendingStatesValue(state)
    })
    builder.addCase(deactiveCompany.fulfilled, (state) => {
      defaultFulfilledStatesValue(state)
    })
    builder.addCase(deactiveCompany.rejected, (state, action) => {
      defaultRejectedStatesValue(state, action)
    })
  }
})

export const activeCompany: any = createAsyncThunk(
  'activeCompany',
  async (companyId: string,
    { rejectWithValue }) => {
    try {
      const response = await ApiRequest.builder().auth().request('patch', `companies/${companyId}/active`)

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const companyActiveSlice = createSlice({
  name: 'companyActive',
  initialState: sliceInitialStateWithStatus,
  reducers: {
    clearActiveCompany: (state) => {
      state.loading = false
      state.status = false
      state.errors = []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(activeCompany.pending, state => {
      defaultPendingStatesValue(state)
    })
    builder.addCase(activeCompany.fulfilled, (state) => {
      defaultFulfilledStatesValue(state)
    })
    builder.addCase(activeCompany.rejected, (state, action) => {
      defaultRejectedStatesValue(state, action)
    })
  }
})


export const getCompanyStatisticsResumeByStates: any = createAsyncThunk('getCompanyStatisticsResumeByStates', async (_, { rejectWithValue, getState }) => {
  try {
    const { company: { data } } = getState() as any
    const response = await ApiRequest.builder().auth().request('get', `companies/${data?.id}/statistics/resume-by-states`)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const companyStatisticsResumeByStatesSlice = createSlice({
  name: 'companyStatisticsResumeByStates',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    createExtraReducers(builder, getCompanyStatisticsResumeByStates, true)
  }
})


export const getCompanyStatisticsResumeStatesInLastMonth: any = createAsyncThunk('getCompanyStatisticsResumeStatesInLastMonth', async (_, { rejectWithValue, getState }) => {
  try {
    const { company: { data } } = getState() as any
    const response = await ApiRequest.builder().auth().request('get', `companies/${data?.id}/statistics/resume-state-in-last-month`)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const companyStatisticsResumeStatesInLastMonthSlice = createSlice({
  name: 'companyStatisticsResumeStatesInLastMonth',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    createExtraReducers(builder, getCompanyStatisticsResumeStatesInLastMonth, true, true)
  }
})


export const getCompanyStatisticsResumeCountByProjects: any = createAsyncThunk('getCompanyStatisticsResumeCountByProjects', async (_, { rejectWithValue, getState }) => {
  try {
    const { company: { data } } = getState() as any
    const response = await ApiRequest.builder().auth().request('get', `companies/${data?.id}/statistics/resume-count-by-projects`)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const companyStatisticsResumeCountByProjectsSlice = createSlice({
  name: 'companyStatisticsResumeCountByProjects',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    createExtraReducers(builder, getCompanyStatisticsResumeCountByProjects, true, true)
  }
})


export const getCompanyStatisticsResumeCountFromMonth: any = createAsyncThunk('getCompanyStatisticsResumeCountFromMonth', async (_, { rejectWithValue, getState }) => {
  try {
    const { company: { data } } = getState() as any
    const response = await ApiRequest.builder().auth().request('get', `companies/${data?.id}/statistics/resume-count-from-month`)

    return response
  } catch (err: any) {
    return rejectWithValue(err?.response)
  }
})

const companyStatisticsResumeCountFromMonthSlice = createSlice({
  name: 'companyStatisticsResumeCountFromMonth',
  initialState: sliceInitialStateWithData,
  reducers: {},
  extraReducers: (builder) => {
    createExtraReducers(builder, getCompanyStatisticsResumeCountFromMonth, true, true)
  }
})

export const { clearCreateCompany } = createCompanySlice.actions
export const { clearEditCompany } = editCompanySlice.actions
export const { clearRemoveCompanyManager } = removeCompanyManagerSlice.actions
export const { clearAddCompanyManager } = addCompanyManagerSlice.actions
export const { clearDeactiveCompany } = companyDeactiveSlice.actions
export const { clearActiveCompany } = companyActiveSlice.actions
export const companiesListReducer = companiesListSlice.reducer
export const companyReducer = companySlice.reducer
export const companyManagersReducer = companyManagersSlice.reducer
export const companyProjectsReducer = companyProjectsSlice.reducer
export const companyResumesReducer = companyResumesSlice.reducer
export const createCompanyReducer = createCompanySlice.reducer
export const editCompanyReducer = editCompanySlice.reducer
export const addCompanyManagerReducer = addCompanyManagerSlice.reducer
export const removeCompanyManagerReducer = removeCompanyManagerSlice.reducer
export const companyDeactiveReducer = companyDeactiveSlice.reducer
export const companyActiveReducer = companyActiveSlice.reducer
export const companyStatisticsResumeByStatesReducer = companyStatisticsResumeByStatesSlice.reducer
export const companyStatisticsResumeStatesInLastMonthReducer = companyStatisticsResumeStatesInLastMonthSlice.reducer
export const companyStatisticsResumeCountByProjectsReducer = companyStatisticsResumeCountByProjectsSlice.reducer
export const companyStatisticsResumeCountFromMonthReducer = companyStatisticsResumeCountFromMonthSlice.reducer
