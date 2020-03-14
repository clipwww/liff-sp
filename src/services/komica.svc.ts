import { axiosInstace, CustomAxiosRequestConfig } from './base.svc';

import { ResultGenericVM } from '@/view-models/result.vm';

const baseURL = '/komica'

export function getList(type: string, p = 1) {
  return axiosInstace.request<ResultGenericVM<any>>({
    method: 'GET',
    url: `${baseURL}/${type}`,
    params: {
      p,
    }
  })
}

export function getDetails(type: string, id: string) {
  return axiosInstace.request<ResultGenericVM<any>>({
    method: 'GET',
    url: `${baseURL}/${type}/${id}`
  })
}
