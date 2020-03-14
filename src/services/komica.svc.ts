import { axiosInstace, CustomAxiosRequestConfig } from './base.svc';

import { ResultGenericVM, ResultListGenericVM } from '@/view-models/result.vm';

const baseURL = '/komica'

export function getList(type: string, p = 1) {
  return axiosInstace.request<ResultListGenericVM<any>>({
    method: 'GET',
    url: `${baseURL}/${type}`,
    params: {
      p,
    }
  })
}

export function getAllList(type: string) {
  return axiosInstace.request<ResultListGenericVM<any>>({
    method: 'GET',
    url: `${baseURL}/${type}?mode=all`,
  })
}

export function getDetails(type: string, id: string) {
  return axiosInstace.request<ResultGenericVM<any>>({
    method: 'GET',
    url: `${baseURL}/${type}/${id}`
  })
}
