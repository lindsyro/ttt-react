import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useGameStore } from "../store/useGameStore";
import { useUiStore } from "../store/useUiStore";

export const useGamePolling = (uuid?: string) => {
  const navigate = useNavigate();
  const { currentGame, getGameById } = useGameStore();
  const { setError } = useUiStore();

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRedirecting = useRef(false);

  const isWaitingForMoveRef = useRef(false);

  const stopTimer = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const handleCriticalError = useCallback(
    (msg: string) => {
      stopTimer();
      if (!isRedirecting.current) {
        isRedirecting.current = true;
        setError(msg);
        setTimeout(() => {
          navigate("/games", { replace: true });
          isRedirecting.current = false;
          setError(null);
        }, 3000);
      }
    },
    [navigate, setError, stopTimer]
  );

  useEffect(() => {
    if (!uuid) return;

    useGameStore.setState({ currentGame: null });
    getGameById(uuid, false).catch((e) => handleCriticalError(e.message));
    return () => stopTimer();
  }, [uuid, getGameById, handleCriticalError, stopTimer]);

  useEffect(() => {
    const status = currentGame?.state.status;
    const isGameActive = status === "WAITING" || status === "PLAYING";
    const controller = new AbortController();

    if (isGameActive && !isRedirecting.current && uuid) {
      timer.current = setInterval(async () => {
        if (isWaitingForMoveRef.current) return;

        try {
          await getGameById(uuid, true, controller.signal);
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : "Ошибка обновления";
          handleCriticalError(message);
        }
      }, 1000);
    }

    return () => {
      controller.abort();
      stopTimer();
    };
  }, [
    uuid,
    currentGame?.state.status,
    getGameById,
    handleCriticalError,
    stopTimer,
  ]);

  const setWaitingForMove = useCallback((val: boolean) => {
    isWaitingForMoveRef.current = val;
  }, []);

  return {
    isWaitingForMoveRef,
    setWaitingForMove,
    stopTimer,
  };
};
