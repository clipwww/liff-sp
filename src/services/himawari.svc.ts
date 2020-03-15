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
  return axiosInstace.request<ResultListGenericVM<any>>({
    method: 'GET',
    url: `${baseURL}/list`,
    params,
  })
}

export function getDetails(id: string) {
  return axiosInstace.request<ResultGenericVM<any>>({
    method: 'GET',
    url: `${baseURL}/douga/${id}`,
  })
}
