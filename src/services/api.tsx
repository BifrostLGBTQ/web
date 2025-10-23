import { ActionType } from "./actions";
import { httpClient } from "./httpClient";

interface ApiRequestOptions {
  method?: "GET" | "POST";
  params?: Record<string, any>;
  body?: Record<string, any>;
}

class ApiService {
  async call<T = any>(
    action: ActionType,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const method = options.method ?? "GET";

    if (method === "GET") {
      const response = await httpClient.get("/", {
        params: { action, ...options.params },
      });
      return response.data as T;
    }

    const response = await httpClient.post("/", {
      action,
      ...options.body,
    });
    return response.data as T;
  }
}

export const api = new ApiService();