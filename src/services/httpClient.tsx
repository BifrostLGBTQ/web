import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

class HttpClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor (örneğin token ekleme)
    this.instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("auth_token");
      if (token) config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    });

    // Response interceptor (örneğin 401 yakalama)
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn("Unauthorized — redirecting to login.");
          localStorage.removeItem("auth_token");
          // window.location.href = "/login"; // istersen aktif et
        }
        return Promise.reject(error);
      }
    );
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

export const httpClient = new HttpClient("http://localhost:3001/").getInstance();