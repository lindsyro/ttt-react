import axios from "axios";

import api from "../api";
import { GameStore, RequestConfig, RequestResult } from "./types";
import { useUiStore } from "./useUiStore";

export const performRequest = async <T>(
  config: RequestConfig,
  set: (state: Partial<GameStore>) => void
): Promise<RequestResult<T>> => {
  const {
    showLoading = true,
    loadingLabel = "Загрузка...",
    signal,
    resetState,
    ...axiosConfig
  } = config;

  if (showLoading) {
    set({ isLoading: true, loadingMessage: loadingLabel });
    if (resetState) resetState();
  }

  try {
    const response = await api({ ...axiosConfig, signal });
    return { data: response.data, error: null };
  } catch (error: unknown) {
    if (axios.isCancel(error)) {
      return { data: null, error: "canceled" };
    }

    let message = "Ошибка сервера";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    useUiStore.getState().setError(message);

    return { data: null, error: message };
  } finally {
    if (showLoading) set({ isLoading: false });
  }
};
