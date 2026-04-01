import { create } from "zustand";

interface UiState {
  globalError: string | null;
  globalSuccess: string | null;
  setError: (message: string | null, duration?: number) => void;
  setSuccess: (message: string | null, duration?: number) => void;
}

export const useUiStore = create<UiState>((set) => {
  let errorTimeout: ReturnType<typeof setTimeout> | null = null;
  let successTimeout: ReturnType<typeof setTimeout> | null = null;

  return {
    globalError: null,
    globalSuccess: null,

    setError: (message, duration = 5000) => {
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }
      set({ globalError: message, globalSuccess: null });
      if (message && duration > 0) {
        errorTimeout = setTimeout(() => {
          set({ globalError: null });
        }, duration);
      }
    },

    setSuccess: (message, duration = 5000) => {
      if (successTimeout) {
        clearTimeout(successTimeout);
      }
      set({ globalSuccess: message, globalError: null });
      if (message && duration > 0) {
        successTimeout = setTimeout(() => {
          set({ globalSuccess: null });
        }, duration);
      }
    },
  };
});
