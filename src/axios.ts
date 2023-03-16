import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL: "http://84.201.175.11/api",
});

const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  config.headers.Authorization = window.localStorage.getItem("token");
  console.info(`[request] [${JSON.stringify(config)}]`);
  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  console.error(`[request error] [${JSON.stringify(error)}]`);
  return Promise.reject(error);
};

instance.interceptors.request.use(onRequest, onRequestError);

const config: AxiosRequestConfig = {};

axios(config);

export default instance;
