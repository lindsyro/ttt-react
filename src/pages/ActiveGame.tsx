import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Game } from "../components/Game";
import { GameInfo } from "../components/GameInfo";

import { useGameStore } from "../store/useGameStore";
import { useUiStore } from "../store/useUiStore";
import { useGamePolling } from "../hooks/useGamePolling";

export const ActiveGame = () => {
  const { uuid } = useParams();
  const [showInfo, setShowInfo] = useState(false);

  const { currentGame, isLoading, loadingMessage } = useGameStore();
  const { globalError, setError } = useUiStore();

  const { setWaitingForMove } = useGamePolling(uuid);

  useEffect(() => {
    return () => setError(null);
  }, [setError]);

  if (isLoading && !currentGame) {
    return (
      <div className="animate-pulse p-10 text-center">{loadingMessage}</div>
    );
  }

  if (!currentGame) {
    return <div className="p-10 text-center text-red-500">Игра не найдена</div>;
  }

  return (
    <div className="relative mx-auto flex w-full flex-col items-center">
      {globalError && (
        <div className="mb-4 w-full rounded bg-[#f2dede] p-2.5 text-center text-[#d9534f]">
          <h1 className="font-bold">{globalError}</h1>
          <p>Вы будете перенаправлены к списку игр</p>
        </div>
      )}

      {!globalError && (
        <>
          <button
            onClick={() => setShowInfo(true)}
            className="absolute top-[50px] left-[52%] z-10 flex size-7 translate-x-20 cursor-pointer items-center justify-center rounded-full border border-[#ccc] bg-white/90 shadow-sm transition-transform hover:scale-110"
            title="Информация"
          >
            ℹ️
          </button>

          <Game
            game={currentGame}
            onMoveStart={() => setWaitingForMove(true)}
            onMoveEnd={() => setWaitingForMove(false)}
          />

          {showInfo && (
            <GameInfo game={currentGame} onClose={() => setShowInfo(false)} />
          )}
        </>
      )}
    </div>
  );
};
