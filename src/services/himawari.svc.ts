import type { ResultGenericVM, ResultListGenericVM } from '@/view-models/result.vm'

import { axiosInstace } from './base.svc'

const baseURL = '/himawari'

interface QueryParams {
  sort?: string
  cat?: string
  keyword?: string
  page?: number
}

export function getList(params?: QueryParams) {
  return axiosInstace.get<ResultListGenericVM<any>>(baseURL, {
    params,
  })
}

export function getDetails(id: string) {
  return axiosInstace.get<ResultGenericVM<any>>(`${baseURL}/${id}`)
}

export function getDanmaku(id: string) {
  return axiosInstace.get<ResultGenericVM<any>>(`${baseURL}/${id}/danmaku`)
}

/**
 * [GET] 取得彈幕列表
 */
export function getDanmakuList(keyword = '', page = 1) {
  return axiosInstace.get<ResultListGenericVM<{ group_id: string, title: string, count: string, source: string }>>(baseURL, {
    params: {
      mode: 'commentgroup',
      keyword,
      page,
    },
  })
}
