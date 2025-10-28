import { Actions, ActionType } from "./actions";
import { httpClient } from "./httpClient";



interface ApiRequestOptions {
  method?: "GET" | "POST";
  params?: Record<string, any>;
  body?: Record<string, any> | any; // array veya nested objelere izin verir
}

export class ApiService {

 
  async handleRegister(user: Record<string, any>) {
    return this.call(Actions.AUTH_REGISTER, {
      method: "POST",
      body: user,
    });
  }

  async handleCreatePost(data: Record<string, any>){

    return this.call(Actions.POST_CREATE, {
      method: "POST",
      body: data,
    });
    console.log("handleCreatePost",data)
  }

  async handleLogin(credentials: { nickname: string; password: string }) {
    return this.call(Actions.AUTH_LOGIN, {
      method: "POST",
      body: credentials,
    });
  }


  async fetchTimeline({ limit = 10, cursor = "" }: { limit?: number; cursor?: string }) {
    return this.call(Actions.POST_TIMELINE, {
      method: "POST",
      body: { limit, cursor }, // doğru değişkenler gönderiliyor
    });
  }
 
 
  async call<T = any>(
    action: ActionType,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const method = options.method ?? "GET";

    console.log("GIDEN DATA",options)

    if (method === "GET") {
      const response = await httpClient.get("/", {
        params: { action, ...options.params },
      });
      return response.data as T;
    }
    const token = localStorage.getItem("authToken"); // direkt al

    const response = await httpClient.post("/", {
      action: action,    // opsiyonel, backend handlePacket için
      ...options.body, // body tek objeye sarılıyor
    }, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": token,
      }
    });


    return response.data as T;
  }
}

export const api = new ApiService();