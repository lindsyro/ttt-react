import React, { useEffect, useMemo } from "react";

import { useAuthStore } from "../store/useAuthStore";
import { useGameStore } from "../store/useGameStore";
import { useUiStore } from "../store/useUiStore";

export const Leaderboard: React.FC = () => {
  const {
    leaderboard,
    users,
    isLoading,
    loadingMessage,
    fetchLeaderboard,
    fetchUsers,
  } = useGameStore();
  const setError = useUiStore((state) => state.setError);
  const globalError = useUiStore((state) => state.globalError);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchUsers();
    fetchLeaderboard(20);

    return () => setError(null);
  }, [fetchLeaderboard, fetchUsers, setError]);

  const usersMap = useMemo(() => {
    return new Map(users.map((u) => [u.uuid, u.login]));
  }, [users]);

  const getWinRateClass = (rate: number) => {
    if (rate >= 0.6) return "bg-[#e6f4ea] text-[#1e7e34]"; // win
    if (rate <= 0.4 && rate > 0) return "bg-[#fce8e6] text-[#c53929]"; // loss
    return "bg-[#f1f3f4] text-[#5f6368]"; // draw
  };

  return (
    <div className="flex min-h-screen items-start justify-center pt-10">
      <div className="w-[500px] max-w-[95vw] rounded-[10px] bg-white p-[30px] shadow-[0_0_15px_rgba(0,0,0,0.1)]">
        <h1 className="mb-2.5 text-center text-[22px] font-bold text-[#444]">
          Рейтинг игроков
        </h1>

        {globalError && (
          <div className="status-message error">{globalError}</div>
        )}

        {isLoading ? (
          <div className="animate-pulse py-10 text-center font-bold text-[#808284]">
            {loadingMessage}
          </div>
        ) : (
          <ul className="custom-scrollbar m-[20px_0px] max-h-[75vh] list-none overflow-y-scroll rounded-[4px] border border-[#eee] p-0">
            {leaderboard.length > 0 ? (
              leaderboard.map((entity) => (
                <li
                  key={entity.userUUID}
                  className={`flex items-center justify-between border-b border-[#eee] p-[15px_20px] last:border-b-0 ${entity.userUUID === user.uuid ? "bg-[#e3f2fd]" : ""}`}
                >
                  <div className="flex items-center gap-2.5 text-[14px] text-[#333]">
                    <span className="w-[100px] text-[#999]">
                      ID: {entity.userUUID.substring(0, 8)}
                    </span>
                    <span>
                      Игрок:{" "}
                      <strong>
                        {usersMap.get(entity.userUUID) || "Загрузка..."}
                      </strong>
                    </span>
                  </div>

                  <div>
                    <span
                      className={
                        getWinRateClass(entity.winRate) +
                        ` inline-block min-w-[90px] rounded-[4px] px-3 py-1 text-center text-[12px] font-bold`
                      }
                    >
                      WR: {(entity.winRate * 100).toFixed(1)}%
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <div className="py-5 text-center text-gray-500">
                Рейтинг пока пуст
              </div>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
