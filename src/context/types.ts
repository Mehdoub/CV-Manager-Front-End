export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  mobile: number
  password: string
  rememberMe?: boolean
}

export type RegisterParams = {
  firstname: string,
  lastname: string,
  mobile: number,
  password: string,
  repeatpassword: string,
}

export type UserDataType = {
  _id: string
  role: string
  avatar: string | null
  banned_at: string | null
  banned_by: string | null
  createdAt: string
  deleted: boolean
  email: string | null
  firstname: string
  is_banned: null
  lastname: string
  mobile: number
  mobile_verified_at: string | null
  updatedAt: string | null
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
}
