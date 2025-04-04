import { User } from "@/user/types";
import { apiClient } from "./commonApi";

export const authApi = {
  checkAuth: async (): Promise<User | null> => {
    try {
      const response = await apiClient.get("/user/");
      return response.data;
    } catch (error) {
      return null;
    }
  },

  login: async (username: string, password: string): Promise<User | null> => {
    const csrfResponse = await apiClient.get("/get-csrf-token/");
    const { csrfToken } = csrfResponse.data;

    const response = await apiClient.post(
      "/login/",
      { username, password },
      {
        headers: {
          "X-CSRFToken": csrfToken,
        },
      }
    );

    if (!response.data) throw new Error("ログインエラー");
    return authApi.checkAuth();
  },

  logout: async (): Promise<void> => {
    const csrfResponse = await apiClient.get("/get-csrf-token/");
    const { csrfToken } = csrfResponse.data;

    const response = await apiClient.post(
      "/logout/",
      {},
      {
        headers: {
          "X-CSRFToken": csrfToken,
        },
      }
    );

    if (!response.data) throw new Error("ログアウトエラー");
  },
};
