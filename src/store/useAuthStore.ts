import axios from "axios";
import { create } from "zustand";

import api from "../api";

interface AuthState {
  user: {
    uuid: string | null;
    login: string | null;
  };
  loadingMessage: string | null;

  login: (credentials: { login: string; password: string }) => Promise<void>;
  signup: (credentials: { login: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    uuid: localStorage.getItem("userId"),
    login: localStorage.getItem("username"),
  },
  loadingMessage: null,

  login: async ({ login, password }) => {
    set({loadingMessage: "Вход в систему..."});
    try {
      const response = await api.post("auth/login", { login, password });
      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const userRes = await api.get("auth/me");
      const uuid = userRes.data.uuid;

      localStorage.setItem("userId", uuid);
      localStorage.setItem("username", login);

      set({ user: { uuid, login }});
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Ошибка авторизации");
      }

      throw new Error("Произошла неизвестная ошибка");
    }
  },

  signup: async ({ login, password }) => {
    set({loadingMessage: "Регистрация..."});
    try {
      const response = await api.post("auth/signup", { login, password });
      if (response.data === true) {
        localStorage.setItem("username", login);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Ошибка регистрации");
      }

      throw new Error("Произошла неизвестная ошибка");
    }
  },

  logout: () => {
    localStorage.clear();
    set({ user: { uuid: null, login: null } });
  },
}));
