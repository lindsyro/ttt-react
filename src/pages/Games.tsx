import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { GameModel } from "../models/game.model";

import { GameList } from "../components/GameList";

import { useAuthStore } from "../store/useAuthStore";
import { useGameStore } from "../store/useGameStore";
import { useUiStore } from "../store/useUiStore";

const BTN_BASE =
  "flex-1 cursor-pointer rounded-[5px] px-[10px] py-[12px] text-[14px] text-white transition-colors border-none whitespace-nowrap";

export const Games = () => {
  const navigate = useNavigate();
  const [failedGameId, setFailedGameId] = useState<string | null>(null);

  const { games, isLoading, loadingMessage, fetchGames, joinGame, clearData } =
    useGameStore();
  const { user, logout } = useAuthStore();
  const { globalError, setError } = useUiStore();

  const sessionUserId = user?.uuid;

  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;
    const controller = new AbortController();

    const poll = async (isBackground: boolean) => {
      await fetchGames(isBackground, controller.signal);

      if (isMounted) {
        timeoutId = setTimeout(() => poll(true), 5000);
      }
    };

    poll(false);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      controller.abort();
      setError(null);
    };
  }, [fetchGames, setError]);

  const handleFullReset = async () => {
    if (window.confirm("Вы уверены? Все ваши игры будут удалены!")) {
      const isSuccess = await clearData();

      if (isSuccess) {
        logout();
        navigate("/login");
      }
    }
  };

  const join = useCallback(
    async (game: GameModel) => {
      const isParticipant =
        game.creator.uuid === sessionUserId ||
        game.opponent?.uuid === sessionUserId;

      if (isParticipant) {
        navigate(`/games/${game.uuid}`);
        return;
      }

      const joinedGame = await joinGame(game.uuid);

      if (joinedGame) {
        navigate(`/games/${joinedGame.uuid}`);
      } else {
        setFailedGameId(game.uuid);
        setTimeout(() => {
          fetchGames(true);
          setFailedGameId(null);
        }, 2000);
      }
    },
    [sessionUserId, navigate, joinGame, fetchGames]
  );

  return (
    <div className="flex min-h-screen items-start justify-center pt-10">
      <div className="w-[500px] max-w-[95vw] rounded-[10px] bg-white p-[30px] shadow-[0_0_15px_rgba(0,0,0,0.1)]">
        <div className="flex w-full gap-[10px]">
          <button
            className={`${BTN_BASE} bg-[#808284] hover:bg-[#575656]`}
            onClick={() => navigate("/create")}
          >
            Создать игру
          </button>
          <button
            onClick={handleFullReset}
            className={`${BTN_BASE} bg-[#d9534f] hover:bg-[#c9302c]`}
          >
            Удалить все
          </button>
        </div>

        <h1 className="my-[30px] text-center text-[22px] font-bold">
          Доступные игры
        </h1>

        {globalError && (
          <div className="mb-4 rounded-[4px] bg-[#f2dede] p-[10px] text-center text-[#d9534f]">
            {globalError}
          </div>
        )}

        {isLoading ? (
          <div className="my-[5px] animate-pulse text-center font-bold text-[#808284]">
            {loadingMessage}
          </div>
        ) : (
          <>
            {games.length > 0 ? (
              <GameList
                games={games}
                onJoin={join}
                failedGameId={failedGameId}
                sessionUserId={sessionUserId}
              />
            ) : (
              <div className="animate-in fade-in text-center text-gray-400 duration-1000">
                Нет игр для подключения
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// нужно решить с нет игр