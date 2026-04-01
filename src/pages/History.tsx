import { useEffect } from "react";

import { GameService } from "../services/game.service";

import { useAuthStore } from "../store/useAuthStore";
import { useGameStore } from "../store/useGameStore";
import { useUiStore } from "../store/useUiStore";

export const History = () => {
  const user = useAuthStore((state) => state.user);
  const { completedGames, isLoading, loadingMessage, fetchCompleted } =
    useGameStore();
  const setError = useUiStore((store) => store.setError);

  const userId = user?.uuid || "";

  useEffect(() => {
    fetchCompleted();

    return () => {
      setError(null);
    };
  }, [fetchCompleted, setError]);

  const getStatusClass = (status: string) => {
    if (status === "ПОБЕДА") return "bg-[#e6f4ea] text-[#1e7e34]";
    if (status === "ПОРАЖЕНИЕ") return "bg-[#fce8e6] text-[#c53929]";
    return "bg-[#f1f3f4] text-[#5f6368]";
  };

  return (
    <div className="flex min-h-screen items-start justify-center pt-10">
      <div className="w-[500px] max-w-[95vw] rounded-[10px] bg-white p-[30px] shadow-[0_0_15px_rgba(0,0,0,0.1)]">
        <h1 className="mb-2.5 text-center text-[22px] font-bold text-[#444]">
          Завершенные игры
        </h1>

        {isLoading ? (
          <div className="animate-pulse py-10 text-center font-bold text-[#808284]">
            {loadingMessage}
          </div>
        ) : (
          <ul className="custom-scrollbar my-5 max-h-[75vh] list-none overflow-y-scroll rounded-[4px] border border-[#eee] p-0">
            {completedGames.length > 0 ? (
              completedGames.map((game) => {
                const status = GameService.getHistoryStatus(game, userId);
                const opponent = GameService.getOpponentLogin(game, userId);

                return (
                  <li
                    key={game.uuid}
                    className="flex items-center justify-between border-b border-[#eee] p-[15px_20px] last:border-b-0"
                  >
                    <div className="flex items-center gap-2.5 text-[14px] text-[#333]">
                      <span className="w-[100px] text-[#999]">
                        ID: {game.uuid.substring(0, 8)}
                      </span>
                      <span>
                        Соперник: <strong>{opponent}</strong>
                      </span>
                    </div>

                    <div>
                      <span
                        className={`inline-block min-w-[90px] rounded-[4px] px-3 py-1 text-center text-[12px] font-bold ${getStatusClass(status)}`}
                      >
                        {status}
                      </span>
                    </div>
                  </li>
                );
              })
            ) : (
              <div className="py-5 text-center text-gray-500">
                У вас нет завершенных игр
              </div>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

// нужно проверить как влияет объявление через сте