import type { AxiosRequestConfig, AxiosResponse, Canceler } from 'axios'
import axios from 'axios'
import { Toast } from 'vant'

import type { ResultVM } from '@/view-models/result.vm'
import { ResultCode } from '@/view-models/result.vm'

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  ignoreErrorMessage?: boolean
  ignoreLoader?: boolean
}

export interface CustomAxiosResponse extends AxiosResponse {
  config: CustomAxiosRequestConfig
}

export function createAxiosInstance(baseURL: string) {
  console.log('createAxiosInstance')
  const axiosInstace = axios.create({
    baseURL,
    timeout: 60000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  let requestList: Array<{
    url: string
    method: string
    cancelFn: Canceler
  }> = []

  function addRequest(url: string = '', method: string = '', cancelFn: Canceler): void {
    requestList.push({
      url,
      method,
      cancelFn,
    })
  }

  function removeRequest(url: string = '', method: string = ''): void {
    requestList = requestList.filter((item) => {
      if (item.url === url && item.method === method) {
        item.cancelFn('Request Canceled')
        return false
      }
      return true
    })
  }

  axiosInstace.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
      const { url, method } = config

      removeRequest(url, method)
      config.cancelToken = new axios.CancelToken((c) => {
        addRequest(url, method, c)
      })

      return config
    },
    (err) => {
      console.error(err)
      return Promise.reject(err)
    },
  )

  axiosInstace.interceptors.response.use(
    (response: CustomAxiosResponse) => {
      const {
        url,
        method,
      } = response.config

      removeRequest(url, method)

      return response
    },
    (err) => {
      console.error(err)
      return Promise.reject(err)
    },
  )

  async function request<T>(config: CustomAxiosRequestConfig): Promise<T> {
    return axiosInstace
      .request(config)
      .then(res => res.data)
      .catch((err) => {
        console.error(err)
        return {
          code: ResultCode.clientError,
          message: err.message,
        }
      })
  }

  async function get<T = ResultVM>(url: string, config?: CustomAxiosRequestConfig): Promise<T> {
    return request<T>({
      method: 'GET',
      url,
      ...config,
    })
  }

  async function post<T = ResultVM>(url: string, data?: any, config?: CustomAxiosRequestConfig): Promise<T> {
    return request<T>({
      method: 'POST',
      url,
      data,
      ...config,
    })
  }

  async function put<T = ResultVM>(url: string, data?: any, config?: CustomAxiosRequestConfig): Promise<T> {
    return request<T>({
      method: 'PUT',
      url,
      data,
      ...config,
    })
  }

  async function del<T = ResultVM>(url: string, config?: CustomAxiosRequestConfig): Promise<T> {
    return request<T>({
      method: 'DELETE',
      url,
      ...config,
    })
  }

  return {
    request,
    get,
    post,
    put,
    delete: del,
    interceptors: axiosInstace.interceptors,
  }
}

export const axiosInstace = createAxiosInstance(import.meta.env.VUE_APP_API_URL)

axiosInstace.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const { ignoreLoader = true, url, method } = config
    console.log(url, method)

    if (!ignoreLoader) {
      Toast.loading({
        forbidClick: true,
      })
    }

    return config
  },
  (err) => {
    console.error(err)
    Toast.clear()
    return Promise.reject(err)
  },
)

axiosInstace.interceptors.response.use(
  (response: CustomAxiosResponse) => {
    const {
      ignoreLoader = true,
    } = response.config
    const { success, resultMessage } = response.data as ResultVM

    if (!ignoreLoader) {
      Toast.clear()
    }

    if (!success) {
      Toast.fail(resultMessage)
    }

    return response
  },
  (err) => {
    console.error(err)
    Toast.clear()
    if (err.message !== 'Request Canceled') {
      Toast.fail(err.message)
    }
    return Promise.reject(err)
  },
)
