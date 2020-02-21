import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
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
    timeout: 60000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  axiosInstace.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
      const { ignoreErrorMessage = false, ignoreLoader = false } = config;

      if (!ignoreLoader) {
        store.dispatch('updateLoading', true);
      }

      return config;
    },
    err => {
      console.error(err);
      store.dispatch('updateLoading', false);
    }
  );

  axiosInstace.interceptors.response.use(
    (response: CustomAxiosResponse) => {
      const {
        ignoreErrorMessage = false,
        ignoreLoader = false
      } = response.config;
      const { success, resultCode, resultMessage } = response.data as ResultVM;

      if (!ignoreLoader) {
        store.dispatch('updateLoading', false);
      }

      if (!success && !ignoreErrorMessage) {
        Toast.fail(resultMessage);
      }

      return response;
    },
    err => {
      console.error(err);
      store.dispatch('updateLoading', false);
      Toast.fail(err.message);
    }
  );

  async function request<T>(config: AxiosRequestConfig): Promise<T> {
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
