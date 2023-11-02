import axios from "axios";
import { ResponseData } from "./index.type";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { setting } from "@/tools/setting/setting";
import { ElMessage } from "element-plus";

class Request {
  instance: AxiosInstance;
  baseConfig: AxiosRequestConfig = { timeout: 60000 };

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(Object.assign(this.baseConfig, config));
    this.instance.interceptors.request.use(
      (config) => {
        return config;
      },
      (err: any) => {
        return Promise.reject(err);
      }
    );
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        const err =
          setting.request.status.error[
            res.status as keyof typeof setting.request.status.error
          ];
        if (err) {
          ElMessage.error(err);
        }
        return res.data;
      },
      (err: any) => {
        return Promise.reject(err.response);
      }
    );
  }

  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config);
  }

  public get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ResponseData<T>> {
    return this.instance.get(url, config);
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ResponseData<T>> {
    return this.instance.post(url, data, config);
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ResponseData<T>> {
    return this.instance.put(url, data, config);
  }

  public delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ResponseData<T>> {
    return this.instance.delete(url, config);
  }
}

export const request = new Request({});
