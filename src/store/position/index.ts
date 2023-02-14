import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiRequest from "src/helpers/ApiRequest";


export const getPositions: any = createAsyncThunk(
  'getPositions',
  async (params:
    { page: number, size: number, query: string } = { page: 1, size: 10, query: '' },
    { rejectWithValue }) => {
    try {
      const { page, size, query } = params
      const response = await ApiRequest.builder().auth().page(page).size(size).query(query).request('get', 'positions')

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const positionsListSlice = createSlice({
  name: 'positionsList',
  initialState: {
    loading: false,
    errors: {},
    data: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPositions.pending, state => {
      state.loading = true
    })
    builder.addCase(getPositions.fulfilled, (state, action) => {
      state.loading = false
      state.errors = []
      state.data = action.payload.data.data[0]
    })
    builder.addCase(getPositions.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.data = {}
    })
  }
})


export const getPosition: any = createAsyncThunk(
  'getPosition',
  async (positionId: string,
    { rejectWithValue }) => {
    try {
      const response = await ApiRequest.builder().auth().request('get', `positions/${positionId}`)

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const positionSlice = createSlice({
  name: 'position',
  initialState: {
    loading: false,
    errors: {},
    data: {},
    managers: [] as any,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPosition.pending, state => {
      state.loading = true
      state.errors = []
      state.data = {}
      state.managers = []
    })
    builder.addCase(getPosition.fulfilled, (state, action) => {
      state.loading = false
      state.errors = []
      state.data = action.payload.data.data[0]
      state.managers = [{ ...action?.payload?.data[0]?.created_by, type: 'owner' }]
    })
    builder.addCase(getPosition.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.data = {}
      state.managers = []
    })
  }
})

export const createPosition: any = createAsyncThunk(
  'createPosition',
  async (data: any,
    { rejectWithValue }) => {
    try {
      const response = await ApiRequest.builder().auth().request('post', 'positions', data)

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const positionCreateSlice = createSlice({
  name: 'positionCreate',
  initialState: {
    loading: false,
    errors: {},
    status: false,
  },
  reducers: {
    clearPositionCreate: (state) => {
      state.loading = false
      state.status = false
      state.errors = []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createPosition.pending, state => {
      state.loading = true
      state.status = false
      state.errors = []
    })
    builder.addCase(createPosition.fulfilled, (state) => {
      state.loading = false
      state.status = true
      state.errors = []
    })
    builder.addCase(createPosition.rejected, (state, action) => {
      state.loading = false
      state.status = false
      state.errors = action.payload
    })
  }
})

export const deactivePosition: any = createAsyncThunk(
  'deactivePosition',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { position: { data } } = getState() as any
      const response = await ApiRequest.builder().auth().request('patch', `positions/${data?.id}/deactive`)

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const positionDeactiveSlice = createSlice({
  name: 'positionDeactive',
  initialState: {
    loading: false,
    errors: {},
    status: false,
  },
  reducers: {
    clearPositionDeactive: (state) => {
      state.loading = false
      state.status = false
      state.errors = {}
    }
  },
  extraReducers: (builder) => {
    builder.addCase(deactivePosition.pending, state => {
      state.loading = true
      state.status = false
      state.errors = {}
    })
    builder.addCase(deactivePosition.fulfilled, (state) => {
      state.loading = false
      state.errors = {}
      state.status = true
    })
    builder.addCase(deactivePosition.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.status = false
    })
  }
})

export const activePosition: any = createAsyncThunk(
  'activePosition',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { position: { data } } = getState() as any
      const response = await ApiRequest.builder().auth().request('patch', `positions/${data?.id}/active`)

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const positionActiveSlice = createSlice({
  name: 'positionActive',
  initialState: {
    loading: false,
    errors: {},
    status: false,
  },
  reducers: {
    clearPositionActive: (state) => {
      state.loading = false
      state.status = false
      state.errors = {}
    }
  },
  extraReducers: (builder) => {
    builder.addCase(activePosition.pending, state => {
      state.loading = true
      state.status = false
      state.errors = {}
    })
    builder.addCase(activePosition.fulfilled, (state) => {
      state.loading = false
      state.errors = {}
      state.status = true
    })
    builder.addCase(activePosition.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.status = false
    })
  }
})

export const getPositionManagers: any = createAsyncThunk(
  'getPositionManagers',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { position: { data } } = getState() as any
      const response = await ApiRequest.builder().auth().request('get', `positions/${data?.id}/managers`)

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const positionManagersSlice = createSlice({
  name: 'positionManagers',
  initialState: {
    loading: false,
    errors: {},
    data: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPositionManagers.pending, state => {
      state.loading = true
      state.errors = []
      state.data = {}
    })
    builder.addCase(getPositionManagers.fulfilled, (state, action) => {
      state.loading = false
      state.errors = []
      state.data = action.payload.data.data
    })
    builder.addCase(getPositionManagers.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.data = {}
    })
  }
})

export const addPositionManager: any = createAsyncThunk(
  'addPositionManager',
  async (manager_id: string,
    { rejectWithValue, getState }) => {
    try {
      const { position: { data } } = getState() as any
      const response = await ApiRequest.builder().auth().request('patch', `positions/${data?.id}/manager`, { manager_id })

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const positionManagerAddSlice = createSlice({
  name: 'positionManagerAdd',
  initialState: {
    loading: false,
    errors: [],
    status: false,
  },
  reducers: {
    clearPositionManagerAdd: (state) => {
      state.loading = false
      state.status = false
      state.errors = []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addPositionManager.pending, state => {
      state.loading = true
      state.status = false
      state.errors = []
    })
    builder.addCase(addPositionManager.fulfilled, (state) => {
      state.loading = false
      state.errors = []
      state.status = true
    })
    builder.addCase(addPositionManager.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.status = false
    })
  }
})

export const removePositionManager: any = createAsyncThunk(
  'removePositionManager',
  async (manager_id: string,
    { rejectWithValue, getState }) => {
    try {
      const { position: { data } } = getState() as any
      const response = await ApiRequest.builder().auth().request('delete', `positions/${data?.id}/manager`, { manager_id })

      return response
    } catch (err: any) {
      return rejectWithValue(err?.response)
    }
  })

const positionManagerRemoveSlice = createSlice({
  name: 'positionManagerRemove',
  initialState: {
    loading: false,
    errors: [],
    status: false,
  },
  reducers: {
    clearPositionManagerRemove: (state) => {
      state.loading = false
      state.status = false
      state.errors = []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(removePositionManager.pending, state => {
      state.loading = true
      state.status = false
      state.errors = []
    })
    builder.addCase(removePositionManager.fulfilled, (state) => {
      state.loading = false
      state.errors = []
      state.status = true
    })
    builder.addCase(removePositionManager.rejected, (state, action) => {
      state.loading = false
      state.errors = action.payload
      state.status = false
    })
  }
})



export const { clearPositionCreate } = positionCreateSlice.actions
export const { clearPositionDeactive } = positionDeactiveSlice.actions
export const { clearPositionActive } = positionActiveSlice.actions
export const { clearPositionManagerRemove } = positionManagerRemoveSlice.actions
export const { clearPositionManagerAdd } = positionManagerAddSlice.actions
export const positionsListReducer = positionsListSlice.reducer
export const positionReducer = positionSlice.reducer
export const positionCreateReducer = positionCreateSlice.reducer
export const positionDeactiveReducer = positionDeactiveSlice.reducer
export const positionActiveReducer = positionActiveSlice.reducer
export const positionManagersReducer = positionManagersSlice.reducer
export const positionManagerAddReducer = positionManagerAddSlice.reducer
export const positionManagerRemoveReducer = positionManagerRemoveSlice.reducer
