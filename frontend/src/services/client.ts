import { ApiErrorResponse } from './interfaces';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSession, signOut } from 'next-auth/react';

class ApiService {
  private api: AxiosInstance;

  constructor(entity: string) {
    this.api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/${entity}`,
      timeout: 100000,
    });

    this.api.interceptors.request.use(async (config) => {
      const session = await getSession();
      const token = session?.accessToken;

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          signOut();
        }
        return Promise.reject(error);
      }
    );
  }

  public get = async <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return await this.api.get<T>(url, config);
  };

  public post = async <T>(
    url: string,
    data: object,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return await this.api.post<T>(url, data, config);
  };

  public patch = async <T>(
    url: string,
    data: object,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return await this.api.patch<T>(url, data, config);
  };

  public put = async <T>(
    url: string,
    data: object,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return await this.api.put<T>(url, data, config);
  };

  public delete = async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return await this.api.delete<T>(url, config);
  };

  public static isApiError(error: unknown): error is AxiosError<ApiErrorResponse> {
    return axios.isAxiosError(error) && !!error.response?.data?.statusCode;
  }
}

const ApiServiceInstance = new ApiService('');

export { ApiService, ApiServiceInstance };
