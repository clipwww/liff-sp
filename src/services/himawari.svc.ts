import { axiosInstace } from './base.svc';

import { ResultGenericVM, ResultListGenericVM } from '@/view-models/result.vm';

const baseURL = '/himawari'

interface QueryParams {
  sort?: string;
  cat?: string;
  keyword?: string;
  page?: number;
}

export function getList(params?: QueryParams) {
  return axiosInstace.get<ResultListGenericVM<any>>(baseURL, {
    params
  })
}

export function getDetails(id: string) {
  return axiosInstace.get<ResultGenericVM<any>>(`${baseURL}/${id}`)
}

export function getDanmaku(id: string) {
  return axiosInstace.get<ResultGenericVM<any>>(`${baseURL}/${id}/danmaku`)
}
