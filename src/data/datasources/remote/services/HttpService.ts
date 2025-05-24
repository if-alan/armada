import axios, { AxiosInstance, AxiosResponse } from 'axios';

export class HttpService {
  private axiosInstance: AxiosInstance;

  constructor() {
    const baseURL = 'https://api-v3.mbta.com/'
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log('API Request:', config);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error('HTTP Get Error:', error);
      throw error;
    }
  }
}
