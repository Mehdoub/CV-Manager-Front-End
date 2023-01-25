import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { toast } from 'react-hot-toast'
import authConfig from 'src/configs/auth'

interface requestConfig {
  header: {
    'Content-Type': string
    authorization?: string | null
  }
}

export default class ApiRequest {
  private accessToken: string
  private refreshToken: string
  private baseUrl: string
  private defaultConf: requestConfig
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

  private async responseHandler(requestMethod: any): Promise<AxiosResponse> {
    try {
      return await requestMethod()
    } catch (err: any) {
      if (err?.response?.status == 401) {
        const response = await this.refreshJwtToken()

        return await requestMethod(response.data.data[0].access_token)
      }
      const textMessage = err?.response?.data?.message?.length > 0? err?.response?.data?.message: 'Server Is Not Reachable!'

      toast.error(textMessage, { position: 'bottom-left', duration: 5000 })
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

  public async request(method: string, url: string, data = {}) {
    const requestMethod = (accessToken = '') =>
      axios.request({
        method,
        url: this.getUrl(url),
        data,
        baseURL: this.baseUrl,
        headers: {
          ...this.defaultConf.header,
          authorization: this.needAuth && accessToken
            ? `Bearer ${accessToken}`
            : this.accessToken
              ? `Bearer ${this.accessToken}`
              : undefined
        }
      })
    const response = await this.responseHandler(requestMethod)

    return response
  }
}
