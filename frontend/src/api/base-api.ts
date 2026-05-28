import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export abstract class BaseApi {
    protected axiosInstance: AxiosInstance;

    constructor(baseUrl: string) {
        this.axiosInstance = axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.initializeRequestInterceptor();
        this.initializeResponseInterceptor();
    }

    private initializeRequestInterceptor() {
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    private initializeResponseInterceptor() {
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    const refreshToken = localStorage.getItem('refreshToken');
                    
                    if (!refreshToken) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        window.location.href = '/signin';
                        return Promise.reject(error);
                    }

                    try {
                        const refreshResponse = await axios.post<{ accessToken: string }>(
                            `${this.axiosInstance.defaults.baseURL || ''}/refresh`,
                            { refreshToken }
                        );

                        if (refreshResponse.status === 200) {
                            const newAccessToken = refreshResponse.data.accessToken;
                            localStorage.setItem('token', newAccessToken);
                            
                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                            }
                            
                            return this.axiosInstance(originalRequest);
                        }
                    } catch (refreshError) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        window.location.href = '/signin';
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
        return response.data;
    }

    protected async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
        return response.data;
    }
}
