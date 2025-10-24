import { ActionType } from "./actions";
import { httpClient } from "./httpClient";



interface ApiRequestOptions {
  method?: "GET" | "POST";
  params?: Record<string, any>;
  body?: Record<string, any> | any; // array veya nested objelere izin verir
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
  action: action,    // opsiyonel, backend handlePacket için
  body: options.body, // body tek objeye sarılıyor
}, {
    headers: {
    "Content-Type": "multipart/form-data"
  }
});

 
    return response.data as T;
  }
}

export const api = new ApiService();