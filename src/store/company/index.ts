import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiRequest from "src/helpers/ApiRequest";
import { CompanyFormData } from "src/views/pages/company/list/AddCompanyDrawer";

export const getCompanies: any = createAsyncThunk(
  'getCompanies',
  async (params:
    { page: number, size: number, query: string } = { page: 1, size: 10, query: '' },
    { rejectWithValue }) => {
    try {
      const { page, size, query } = params
      const response = await ApiRequest.builder().auth().page(page).size(size).query(query).request('get', 'companies')

      return response.data
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const companiesListSlice = createSlice({
  name: 'companiesList',
  initialState: {
    loading: false,
    errors: {},
    data: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCompanies.pending, state => {
      state.loading = true
    })
    builder.addCase(getCompanies.fulfilled, (state, action) => {
      state.loading = false
      state.errors = []
      state.data = action.payload.data[0]
    })
    builder.addCase(getCompanies.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.data = {}
    })
  }
})


export const getCompany: any = createAsyncThunk(
  'getCompany',
  async (companyId: string,
    { rejectWithValue }) => {
    try {
      const response = await ApiRequest.builder().auth().request('get', `companies/${companyId}`)

      return response.data
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const companySlice = createSlice({
  name: 'company',
  initialState: {
    loading: false,
    errors: {},
    data: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCompany.pending, state => {
      state.loading = true
      state.errors = []
      state.data = {}
    })
    builder.addCase(getCompany.fulfilled, (state, action) => {
      state.loading = false
      state.errors = []
      state.data = action.payload.data[0]
    })
    builder.addCase(getCompany.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.data = {}
    })
  }
})


export const getCompanyManagers: any = createAsyncThunk(
  'getCompanyManagers',
  async (companyId: string,
    { rejectWithValue }) => {
    try {
      const response = await ApiRequest.builder().auth().request('get', `companies/${companyId}/managers`)

      return response.data
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const companyManagersSlice = createSlice({
  name: 'companyManagers',
  initialState: {
    loading: false,
    errors: {},
    data: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCompanyManagers.pending, state => {
      state.loading = true
      state.errors = []
      state.data = {}
    })
    builder.addCase(getCompanyManagers.fulfilled, (state, action) => {
      state.loading = false
      state.errors = []
      state.data = action.payload.data
    })
    builder.addCase(getCompanyManagers.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.data = {}
    })
  }
})


export const getCompanyProjects: any = createAsyncThunk(
  'getCompanyProjects',
  async (companyId: string,
    { rejectWithValue }) => {
    try {
      const response = await ApiRequest.builder().auth().request('get', `companies/${companyId}/projects`)

      return response.data
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const companyProjectsSlice = createSlice({
  name: 'companyProjects',
  initialState: {
    loading: false,
    errors: {},
    data: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCompanyProjects.pending, state => {
      state.loading = true
      state.errors = []
      state.data = {}
    })
    builder.addCase(getCompanyProjects.fulfilled, (state, action) => {
      state.loading = false
      state.errors = []
      state.data = action.payload.data
    })
    builder.addCase(getCompanyProjects.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.data = {}
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

      return response.data
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const addCompanyManagerSlice = createSlice({
  name: 'addCompanyManager',
  initialState: {
    loading: false,
    errors: {},
    status: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addCompanyManager.pending, state => {
      state.loading = true
      state.status = false
      state.errors = []
    })
    builder.addCase(addCompanyManager.fulfilled, (state, action) => {
      state.loading = false
      state.errors = []
      state.status = true
    })
    builder.addCase(addCompanyManager.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.status = false
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

      return response.data
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const removeCompanyManagerSlice = createSlice({
  name: 'removeCompanyManager',
  initialState: {
    loading: false,
    errors: {},
    status: false,
  },
  reducers: {
    clearRemoveCompany: (state) => {
      state.loading = false
      state.status = false
      state.errors = []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(removeCompanyManager.pending, state => {
      state.loading = true
      state.status = false
      state.errors = []
    })
    builder.addCase(removeCompanyManager.fulfilled, (state, action) => {
      state.loading = false
      state.errors = []
      state.status = true
    })
    builder.addCase(removeCompanyManager.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.status = false
    })
  }
})



export const createCompany: any = createAsyncThunk(
  'createCompany',
  async (data: CompanyFormData,
    { rejectWithValue }) => {
    try {
      const response = await ApiRequest.builder().auth().request('post', 'companies', data)

      return response.data
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const createCompanySlice = createSlice({
  name: 'createCompany',
  initialState: {
    loading: false,
    errors: {},
    status: false,
  },
  reducers: {
    clearCreateCompany: (state) => {
      state.loading = false
      state.status = false
      state.errors = []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createCompany.pending, state => {
      state.loading = true
      state.status = false
      state.errors = []
    })
    builder.addCase(createCompany.fulfilled, (state) => {
      state.loading = false
      state.status = true
      state.errors = []
    })
    builder.addCase(createCompany.rejected, (state, action) => {
      state.loading = false
      state.status = false
      state.errors = action.payload
    })
  }
})

export const { clearCreateCompany } = createCompanySlice.actions
export const { clearRemoveCompany } = removeCompanyManagerSlice.actions
export const companiesListReducer = companiesListSlice.reducer
export const companyReducer = companySlice.reducer
export const companyManagersReducer = companyManagersSlice.reducer
export const companyProjectsReducer = companyProjectsSlice.reducer
export const createCompanyReducer = createCompanySlice.reducer
export const addCompanyManagerReducer = addCompanyManagerSlice.reducer
export const removeCompanyManagerReducer = removeCompanyManagerSlice.reducer
