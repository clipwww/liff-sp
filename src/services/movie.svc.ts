import { axiosInstace, CustomAxiosRequestConfig } from './base.svc';

import { ResultListGenericVM } from '@/view-models/result.vm';

const baseURL = '/movie'

export function getMovieList() {
  return axiosInstace.request({
    method: 'GET',
    url: `${baseURL}/list`
  })
}

export function getCityList() {
  return axiosInstace.request({
    method: 'GET',
    url: `${baseURL}/city`,
  })
}

export function getTheaterList(cityId: string) {
  return axiosInstace.request({
    method: 'GET',
    url: `${baseURL}/theater`,
    params: {
      cityId,
    },
  })
}

export function getTheaterById(theaterId: string, cityId: string) {
  return axiosInstace.request({
    method: 'GET',
    url: `${baseURL}/theater/${theaterId}`,
    params: {
      cityId,
    }
  })
}

export function getMovieTimesById(movieId: string, cityId: string) {
  return axiosInstace.request({
    method: 'GET',
    url: `${baseURL}/times/${movieId}`,
    params: {
      cityId,
    }
  })
}