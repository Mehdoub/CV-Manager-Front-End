import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

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

  public auth(): ApiRequest {
    this.defaultConf.header.authorization = this.accessToken

    return this
  }

  private async responseHandler(requestMethod: () => Promise<AxiosResponse>): Promise<AxiosResponse> {
    try {
      return await requestMethod()
    } catch (err: any) {
      if (err?.response?.status == 401) {
        await this.refreshJwtToken()

        return await requestMethod()
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
      localStorage.setItem('accessToken', this.accessToken)
      localStorage.setItem('refreshToken', this.refreshToken)

      return response
    } catch (err: any) {
      throw err
    }
  }

  public async request(method = 'get', url: string, data = {}) {
    const requestMethod = () =>
      axios.request({
        method,
        url,
        data,
        baseURL: this.baseUrl,
        headers: this.defaultConf.header
      })
    const response = await this.responseHandler(requestMethod)

    return response
  }
}
