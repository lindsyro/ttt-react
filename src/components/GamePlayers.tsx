import { memo } from "react";

import { GameModel } from "../models/game.model";

interface GamePlayersProps {
  game: GameModel;
}

export const GamePlayers = memo(({ game }: GamePlayersProps) => {
  const currentPlayerUUID = game.state.playerUUID;

  return (
    <div className="mb-2.5 flex items-center gap-[30px]">
      <div
        className={`flex items-center gap-2.5 rounded-lg border px-5 py-2.5 transition-colors ${
          currentPlayerUUID === game.creator.uuid
            ? "border-[#ccc] bg-gray-50 shadow-sm"
            : "border-transparent"
        }`}
      >
        <span className="flex size-[30px] items-center justify-center rounded bg-[#d9534f] font-bold text-white">
          {game.creator.icon}
        </span>
        <span className="font-medium text-gray-700">{game.creator.login}</span>
      </div>

      <div className="font-bold text-[#999]">VS</div>

      <div
        className={`flex items-center gap-2.5 rounded-lg border px-5 py-2.5 transition-colors ${
          currentPlayerUUID === game.opponent?.uuid
            ? "border-[#ccc] bg-gray-50 shadow-sm"
            : "border-transparent"
        }`}
      >
        <span className="flex size-[30px] items-center justify-center rounded bg-[#2078cb] font-bold text-white">
          {game.opponent?.icon || "O"}
        </span>
        {game.opponent ? (
          <span className="font-medium text-gray-700">
            {game.opponent.login}
          </span>
        ) : (
          <span className="animate-pulse text-gray-400 italic">
            Ожидание...
          </span>
        )}
      </div>
    </div>
  );
});
