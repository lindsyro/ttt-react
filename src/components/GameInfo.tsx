import React, { useEffect } from "react";

import { GameModel } from "../models/game.model";
import { LeaderboardEntity } from "../models/models-types";

import { useGameStore } from "../store/useGameStore";

interface GameInfoProps {
  game: GameModel;
  onClose: () => void;
}

export const GameInfo: React.FC<GameInfoProps> = ({ game, onClose }) => {
  const { leaderboard, fetchLeaderboard } = useGameStore();

  useEffect(() => {
    fetchLeaderboard(20);
  }, [fetchLeaderboard]);

  const getWinRate = (uuid?: string) => {
    if (!uuid) return "";
    const stats = leaderboard.find(
      (e: LeaderboardEntity) => e.userUUID === uuid
    );
    return stats ? `WR: ${(stats.winRate * 100).toFixed(1)}%` : "WR: 0%";
  };

  const translateStatus = (status: string) => {
    const map: Record<string, string> = {
      WAITING: "Ожидание игрока",
      PLAYING: "Идет сражение",
      WON: "Игра завершена",
      DRAW: "Ничья",
    };
    return map[status] || status;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "WAITING":
        return "bg-[#fff4e5] text-[#b7791f]";
      case "PLAYING":
        return "bg-[#e3f2fd] text-[#1976d2]";
      default:
        return "bg-[#e6f4ea] text-[#1e7e34]";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[450px]">
      {/* Backdrop (Задний фон) */}
      <div
        className="animate-fade-in fixed inset-0 z-[101] cursor-pointer bg-white/85"
        onClick={onClose}
      />

      {/* Panel (Сама карточка) */}
      <div className="animate-slide-up relative z-[101] w-full max-w-[400px] rounded-xl border border-[#eee] bg-white p-[25px] shadow-[0_4px_25px_rgba(0,0,0,0.15)]">
        <div className="mb-5 text-center">
          <span
            className={`rounded-md px-3.5 py-1.5 text-[12px] font-bold uppercase ${getStatusBadgeClass(game.state.status)}`}
          >
            {translateStatus(game.state.status)}
          </span>
        </div>

        <div className="mb-6 flex items-center justify-between py-2.5">
          {/* Создатель */}
          <div className="flex flex-1 flex-col text-center">
            <span className="mb-1.5 text-[10px] tracking-widest text-[#aaa] uppercase">
              Создатель
            </span>
            <strong className="text-[18px] leading-tight break-all text-[#333]">
              {game.creator.login}
            </strong>
            <span className="mt-1 text-[13px] font-semibold text-[#2078cb]">
              {getWinRate(game.creator.uuid)}
            </span>
          </div>

          <div className="px-5 text-[20px] font-black text-[#eee] italic">
            VS
          </div>

          {/* Оппонент */}
          <div className="flex flex-1 flex-col text-center">
            <span className="mb-1.5 text-[10px] tracking-widest text-[#aaa] uppercase">
              Оппонент
            </span>
            <strong className="text-[18px] leading-tight break-all text-[#333]">
              {game.opponent?.login || "Ожидание..."}
            </strong>
            <span className="mt-1 text-[13px] font-semibold text-[#2078cb]">
              {getWinRate(game.opponent?.uuid)}
            </span>
          </div>
        </div>

        <div className="border-t border-[#f5f5f5] pt-4 text-center">
          <code className="font-mono text-[10px] text-[#ccc]">
            ID: {game.uuid}
          </code>
        </div>
      </div>
    </div>
  );
};
