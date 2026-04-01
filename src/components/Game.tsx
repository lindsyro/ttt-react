import { useMemo, useState } from "react";

import { GameModel } from "../models/game.model";

import { GameService } from "../services/game.service";

import { useAuthStore } from "../store/useAuthStore";
import { useGameStore } from "../store/useGameStore";

import { GameBoard } from "./GameBoard";
import { GamePlayers } from "./GamePlayers";

interface GameProps {
  game: GameModel;
  onMoveStart?: () => void;
  onMoveEnd?: () => void;
}

export const Game: React.FC<GameProps> = ({ game, onMoveStart, onMoveEnd }) => {
  const { updateGameById } = useGameStore();
  const user = useAuthStore((state) => state.user);

  const [isPending, setIsPending] = useState(false);
  const userId = user?.uuid || "";

  const statusMessage = useMemo(() => {
    if (!game || !userId) return "Загрузка...";
    return GameService.getStatusLabel(game, userId);
  }, [game, userId]);

  const getStatusClass = () => {
    if (statusMessage === "Победа!") return "text-[#047458]";
    if (["Поражение", "Ничья"].includes(statusMessage)) return "text-[#d9534f]";
    return "text-gray-700";
  };

  const handleMove = async (coords: { row: number; col: number }) => {
    if (isPending) return;

    setIsPending(true);
    onMoveStart?.();

    await updateGameById(game.uuid, coords);

    setIsPending(false);
    onMoveEnd?.();
  };

  return (
    <div className="mt-10 flex flex-col items-center gap-4">
      <h2>Игра: {game?.uuid?.substring(0, 8)}</h2>

      <GamePlayers game={game} />

      <h2 className={`text-xl font-bold transition-colors ${getStatusClass()}`}>
        {statusMessage}
      </h2>

      <GameBoard
        data={game.board}
        disabled={
          isPending ||
          game.state.playerUUID !== userId ||
          game.state.status !== "PLAYING"
        }
        icons={{
          1: game.creator.icon,
          2: game.opponent?.icon || "O",
        }}
        onMove={(row, col) => handleMove({ row, col })}
      />
    </div>
  );
};
