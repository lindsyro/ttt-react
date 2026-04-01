import { memo } from "react";

import { GameModel } from "../models/game.model";

interface GameListProps {
  games: GameModel[];
  onJoin: (game: GameModel) => void;
  failedGameId: string | null;
  sessionUserId?: string | null;
}

export const GameList = memo(
  ({ games, onJoin, failedGameId, sessionUserId }: GameListProps) => {
    const getStatusClasses = (game: GameModel) => {
      if (game.creator.uuid === sessionUserId)
        return "border-l-[5px] border-l-[#28a745] bg-[#f8fff9]";
      if (game.opponent?.uuid === sessionUserId)
        return "border-l-[5px] border-l-[#2078cb] bg-[#f0f7ff]";
      return "border-l-[5px] border-l-[#ccc]";
    };

    return (
      <ul className="custom-scrollbar my-5 max-h-[70vh] list-none overflow-y-auto rounded-[4px] border border-[#eee] p-0 text-left">
        {games.map((game) => (
          <li
            key={game.uuid}
            onClick={() => onJoin(game)}
            className={`flex cursor-pointer items-center justify-between border-b border-[#eee] p-[15px] transition-all hover:bg-gray-50 ${getStatusClasses(
              game
            )} ${failedGameId === game.uuid ? "animate-shake !bg-[#ffebeb]" : ""} `}
          >
            <span className="text-[15px] text-[#333]">
              Создатель:{" "}
              <strong className="font-bold">{game.creator.login}</strong>
            </span>
            <span className="text-[11px] text-[#bbb]">
              ID: {game.uuid.substring(0, 8)}
            </span>
          </li>
        ))}
      </ul>
    );
  }
);
