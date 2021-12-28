import Axios from 'axios';
import storage from '../utils/storage';

const authRequestInterceptor = (config) => {
  const token = storage.getToken();

  if (token) {
    config.headers.authorization = token;
  }
  config.headers.Accept = 'application/json';

  return config;
};

export const axios = Axios.create({
  baseURL: '92.168.5.164:8000',
})

axios.interceptors.request.use(authRequestInterceptor);
