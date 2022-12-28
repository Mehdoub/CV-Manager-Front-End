import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import authConfig from 'src/configs/auth'

interface requestConfig {
  header: {
    'Content-Type': string
    authorization?: string | null
  }
}

export default class ApiRequest {
  public accessToken: string
  public refreshToken: string
  public baseUrl: string
  public defaultConf: requestConfig

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

  private async responseHandler(requestMethod: any): Promise<AxiosResponse> {
    try {
      return await requestMethod()
    } catch (err: any) {
      if (err?.response?.status == 401) {
        const response = await this.refreshJwtToken()

        return await requestMethod(response.data.data[0].access_token)
      }
      throw err
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

  public async request(method: string, url: string, data = {}) {
    const requestMethod = (accessToken = '') =>
      axios.request({
        method,
        url,
        data,
        baseURL: this.baseUrl,
        headers: {
            'Content-Type': 'application/json',
            authorization: accessToken ? `Bearer ${accessToken}` : `Bearer ${this.accessToken}`,
        }
      })
    const response = await this.responseHandler(requestMethod)

    return response
  }
}
