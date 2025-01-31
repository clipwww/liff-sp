import moment from 'moment'

import { axiosInstace } from './base.svc'

const baseURL = '/movie'

export function getMovieList() {
  return axiosInstace.request({
    method: 'GET',
    url: `${baseURL}/list`,
  })
}

export function getMovieListGroupByDate() {
  return axiosInstace.request({
    method: 'GET',
    url: `${baseURL}/list-group-by-date`,
  })
}

export function getMovieNextList() {
  return axiosInstace.request({
    method: 'GET',
    url: `${baseURL}/next`,
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

export function getTheaterById(theaterId: string, cityId: string = '', date?: string) {
  const isToday = moment().isSame(date, 'day')
  return axiosInstace.request({
    method: 'GET',
    url: `${baseURL}/theater/${theaterId}`,
    params: {
      cityId,
      date: isToday ? null : date,
    },
  })
}

export function getMovieTimesById(movieId: string, cityId: string = '') {
  return axiosInstace.request({
    method: 'GET',
    url: `${baseURL}/times/${movieId}`,
    params: {
      cityId,
    },
  })
}

export function getMovieVieshowShowTimes(cinemaCode: string) {
  return axiosInstace.request({
    method: 'POST',
    url: 'https://www.vscinemas.com.tw/ShowTimes/ShowTimes/GetShowTimes',
    params: {
      CinemaCode: cinemaCode,
    },
    ignoreErrorMessage: true,
  })
}
