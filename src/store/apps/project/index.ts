// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// interface DataParams {
//   q: string
//   role: string
//   status: string
//   currentPlan: string
// }

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Users
export const fetchData = createAsyncThunk('appUsers/fetchData', async () => {
  // const response = await axios.get('/apps/users/list', {
  //   params
  // })
  const data = {
    users: [
      {
        id: 1,
        project_id: 'Galen Slixby',
        company: 'Yotz PVT LTD',
        role: 'editor',
        username: 'gslixby0',
        country: 'El Salvador',
        contact: '(479) 232-9151',
        email: 'gslixby0@abc.net.au',
        time_created: '21 Dec 2022',
        logoGroup: [
          '/images/logos/asana.png',
          '/images/logos/chrome.png',
          '/images/logos/dribbble.png',
          '/images/logos/reddit.png'
        ],
        avatarGroup: [
          '/images/avatars/1.png',
          '/images/avatars/2.png',
          '/images/avatars/3.png',
          '/images/avatars/4.png'
        ],
        currentPlan: 'enterprise',
        status: 'inactive',
        avatar: '',
        avatarColor: 'primary',
        logo: '/images/logos/twitter.png',
      },
      {
        id: 2,
        project_id: 'Halsey Redmore',
        company: 'Skinder PVT LTD',
        role: 'author',
        username: 'hredmore1',
        country: 'Albania',
        contact: '(472) 607-9137',
        email: 'hredmore1@imgur.com',
        time_created: '30 Nov 2021',
        logoGroup: [
          '/images/logos/asana.png',
          '/images/logos/chrome.png',
          '/images/logos/dribbble.png',
          '/images/logos/reddit.png'
        ],
        avatarGroup: [],
        currentPlan: 'team',
        status: 'pending',
        avatar: '/images/avatars/3.png',
        logo: '/images/logos/slack.png',
      },
      {
        id: 3,
        project_id: 'Marjory Sicely',
        company: 'Oozz PVT LTD',
        role: 'maintainer',
        username: 'msicely2',
        country: 'Russia',
        contact: '(321) 264-4599',
        email: 'msicely2@who.int',
        time_created: '10 Jun 2020',
        logoGroup: [
          '/images/logos/asana.png',
          '/images/logos/chrome.png',
          '/images/logos/dribbble.png',
          '/images/logos/reddit.png'
        ],
        avatarGroup: [
          '/images/avatars/1.png',
          '/images/avatars/2.png',
          '/images/avatars/3.png',
          '/images/avatars/3.png',
          '/images/avatars/3.png',
          '/images/avatars/3.png',
          '/images/avatars/3.png',
          '/images/avatars/3.png',
          '/images/avatars/3.png',
          '/images/avatars/4.png'
        ],
        currentPlan: 'enterprise',
        status: 'active',
        avatar: '/images/avatars/1.png',
        logo: '/images/logos/facebook-round.png',
      },
      {
        id: 4,
        project_id: 'Cyrill Risby',
        company: 'Oozz PVT LTD',
        role: 'maintainer',
        username: 'crisby3',
        country: 'China',
        contact: '(923) 690-6806',
        email: 'crisby3@wordpress.com',
        time_created: '05 Oct 2023',
        logoGroup: [
          '/images/logos/asana.png',
          '/images/logos/chrome.png',
          '/images/logos/dribbble.png',
          '/images/logos/reddit.png'
        ],
        avatarGroup: [
          '/images/avatars/1.png',
          '/images/avatars/2.png',
          '/images/avatars/3.png',
          '/images/avatars/4.png'
        ],
        currentPlan: 'team',
        status: 'inactive',
        avatar: '/images/avatars/3.png',
        logo: '/images/logos/asana.png',
      },
      {
        id: 5,
        project_id: 'Maggy Hurran',
        company: 'Aimbo PVT LTD',
        role: 'subscriber',
        username: 'mhurran4',
        country: 'Pakistan',
        contact: '(669) 914-1078',
        email: 'mhurran4@yahoo.co.jp',
        time_created: '21 Dec 2022',
        logoGroup: [
          '/images/logos/asana.png',
          '/images/logos/chrome.png',
          '/images/logos/dribbble.png',
          '/images/logos/dribbble.png',
          '/images/logos/reddit.png',
          '/images/logos/reddit.png',
        ],
        avatarGroup: [
          '/images/avatars/1.png',
          '/images/avatars/2.png',
          '/images/avatars/3.png',
          '/images/avatars/4.png'
        ],
        currentPlan: 'enterprise',
        status: 'pending',
        avatar: '/images/avatars/1.png',
        logo: '/images/logos/google.png',
      }
    ]
  }

  return data
})

// ** Add User
export const addUser = createAsyncThunk(
  'appUsers/addUser',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    const response = await axios.post('/apps/users/add-user', {
      data
    })
    dispatch(fetchData(getState().user.params))

    return response.data
  }
)

// ** Delete User
export const deleteUser = createAsyncThunk(
  'appUsers/deleteUser',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axios.delete('/apps/users/delete', {
      data: id
    })
    dispatch(fetchData(getState().user.params))

    return response.data
  }
)

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.users
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appUsersSlice.reducer
