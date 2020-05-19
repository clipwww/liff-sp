import { Toast } from 'vant';

import { createAxiosInstance, CustomAxiosResponse } from './base.svc';

const axiosInstance = createAxiosInstance(process.env.VUE_APP_ACNH_API_URL);

axiosInstance.interceptors.response.use((response: CustomAxiosResponse) => {
  return response;
}, err => {
  if (err.message !== 'Request Canceled') {
    Toast.fail(err.message);
  }
  return Promise.reject(err);
})

export function getList(type: string) {
  return axiosInstance.get(`/${type}`)
}

export function getById(id: string, type: string) {
  return axiosInstance.get(`/${type}/${id}`);
}