import axios, { AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios'
import authConfig from 'src/configs/auth'
import { toastError } from './functions'

interface RequestConfig {
  header: {
    'Content-Type': string
    authorization?: string | null
  }
}

interface PendingRequest {
  name: string
  cancelToken: CancelTokenSource
}

let pendingRequestsStack: Array<PendingRequest> = []

export default class ApiRequest {
  private accessToken: string
  private refreshToken: string
  private baseUrl: string
  private defaultConf: RequestConfig
  private needAuth: boolean = false
  private pageNumber: number | null = null
  private responseSize: number | null = null
  private querySearch: string = ''

  public constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ''
    this.accessToken = localStorage.getItem('accessToken') ?? ''
    this.refreshToken = localStorage.getItem('refreshToken') ?? ''
    this.defaultConf = {
      header: {
        'Content-Type': 'application/json'
      }
    }
  }

  static builder(): ApiRequest {
    return new ApiRequest()
  }

  private getUrl(url: string) {
    let params = []
    let paramsString = ''

    this.pageNumber && params.push(`page=${this.pageNumber}`)
    this.responseSize && params.push(`size=${this.responseSize}`)
    this.querySearch && params.push(`query=${this.querySearch}`)


    if (params.length > 0) {
      paramsString = '?'
      params.map(item => {
        paramsString += item + '&'
      })
      paramsString = paramsString.substring(0, paramsString.length - 1)
    }

    return this.baseUrl + url + paramsString
  }

  private responseError = (err: any) => {
    const msg = err?.response?.data?.message

    if (msg) toastError(msg)
    else if (!msg && !['CanceledError'].includes(err?.name)) toastError('Something Went Wrong!')

    throw err
  }

  private async responseHandler(requestMethod: any): Promise<AxiosResponse> {
    try {
      return await requestMethod()

    } catch (err: any) {
      if (err?.response?.status == 401) {

        try {
          const response = await this.refreshJwtToken()
          return await requestMethod(response.data.data[0].access_token)

        } catch (err: any) {
          if (err?.response?.status == 400) {

            try {
              return await requestMethod(localStorage.getItem(authConfig.storageTokenKeyName))

            } catch (err: any) {
              return this.responseError(err)

            }
          }
          return this.responseError(err)

        }
      }
      return this.responseError(err)

    }
  }

  private async refreshJwtToken(): Promise<AxiosResponse> {
    try {
      const response = await axios.post(
        this.baseUrl + 'auth/refresh',
        { token: this.refreshToken },
        this.defaultConf as AxiosRequestConfig
      )

      this.accessToken = response.data.data[0].access_token
      this.refreshToken = response.data.data[0].refresh_token
      localStorage.setItem(authConfig.storageTokenKeyName, this.accessToken)
      localStorage.setItem(authConfig.refreshTokenKeyName, this.refreshToken)

      return response
    } catch (err: any) {
      throw err
    }
  }

  private cancelSimilarPendingRequest(requestName: string, cancelToken: CancelTokenSource) {
    pendingRequestsStack?.length > 0 && pendingRequestsStack.map((request: PendingRequest, index: number) => {
      if (request.name == requestName) {
        request.cancelToken.cancel('Previous Request Was Canceled Due To The New Request!')
        pendingRequestsStack.splice(index, 1)
      }
    })

    pendingRequestsStack.push({ name: requestName, cancelToken })
  }

  private removeDoneRequestFromStack(requestName: string) {
    pendingRequestsStack.map((request: PendingRequest, index: number) => {
      if (request.name == requestName) {
        pendingRequestsStack.splice(index, 1)
      }
    })
  }

  public auth(): ApiRequest {
    this.needAuth = true

    return this
  }

  public page(value: number): ApiRequest {
    this.pageNumber = value

    return this
  }

  public size(value: number): ApiRequest {
    this.responseSize = value

    return this
  }

  public query(value: string): ApiRequest {
    this.querySearch = value

    return this
  }

  public contentType = (newContentType: string): ApiRequest => {
    this.defaultConf.header['Content-Type'] = newContentType

    return this
  }

  public async request(method: string, url: string, data: any = {}) {
    const cancelToken = axios.CancelToken.source()
    const requestName = `${method}/${url}`

    for (const [key, value] of Object.entries(data)) {
      if (typeof value == 'string') data[key] = value.trim()
    }

    const requestMethod = (accessToken = '') =>
      axios.request({
        method,
        url: this.getUrl(url),
        data,
        baseURL: this.baseUrl,
        cancelToken: cancelToken.token,
        headers: {
          ...this.defaultConf.header,
          authorization: this.needAuth && accessToken
            ? `Bearer ${accessToken}`
            : this.accessToken
              ? `Bearer ${this.accessToken}`
              : undefined
        }
      })

    this.cancelSimilarPendingRequest(requestName, cancelToken)

    const response = await this.responseHandler(requestMethod)

    this.removeDoneRequestFromStack(requestName)

    return response
  }
}
