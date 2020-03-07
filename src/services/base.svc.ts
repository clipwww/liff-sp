import axios, { AxiosRequestConfig, AxiosResponse, Canceler } from 'axios';
import { Toast } from 'vant';

import { ResultVM, ResultCode } from '@/view-models/result.vm';

import store from '@/store';

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  ignoreErrorMessage?: boolean;
  ignoreLoader?: boolean;
}

export interface CustomAxiosResponse extends AxiosResponse {
  config: CustomAxiosRequestConfig;
}

export const createAxiosInstance = () => {
  console.log('createAxiosInstance');
  const axiosInstace = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 60000,
    headers: {
      'Content-Type': 'application/json'
    },
  });

  let requestList: Array<{
    url: string;
    method: string;
    cancelFn: Canceler;
  }> = [];

  function addRequest(url: string = '', method: string = '', cancelFn: Canceler): void {
    requestList.push({
      url,
      method,
      cancelFn,
    });
  }

  function removeRequest(url: string = '', method: string = ''): void {
    requestList = requestList.filter(item => {
      if (item.url === url && item.method === method) {
        item.cancelFn('Request Canceled');
        return false;
      }
      return true;
    });
  }


  axiosInstace.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
      const { ignoreErrorMessage = false, ignoreLoader = true, url, method } = config;

      if (!ignoreLoader) {
        Toast.loading({
          forbidClick: true
        });
      }

      removeRequest(url, method);
      config.cancelToken = new axios.CancelToken(c => {
        addRequest(url, method, c);
      });


      return config;
    },
    err => {
      console.error(err);
      Toast.clear();
      return Promise.reject(err);
    }
  );

  axiosInstace.interceptors.response.use(
    (response: CustomAxiosResponse) => {
      const {
        ignoreErrorMessage = false,
        ignoreLoader = true,
        url,
        method
      } = response.config;
      const { success, resultCode, resultMessage } = response.data as ResultVM;
      
      removeRequest(url, method);

      if (!ignoreLoader) {
        Toast.clear();
      }

      if (!success && !ignoreErrorMessage) {
        Toast.fail(resultMessage);
      }

      return response;
    },
    err => {
      console.error(err);
      Toast.clear();
      if (err.message !== 'Request Canceled') {
        Toast.fail(err.message);
      }
      return Promise.reject(err);
    }
  );

  async function request<T>(config: CustomAxiosRequestConfig): Promise<T> {
    return axiosInstace
      .request(config)
      .then(res => res.data)
      .catch(err => {
        console.error(err);
        return {
          code: ResultCode.clientError,
          message: err.message
        };
      });
  }

  return {
    request
  };
};

export const axiosInstace = createAxiosInstance();
