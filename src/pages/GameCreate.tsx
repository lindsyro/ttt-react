import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useGameStore } from "../store/useGameStore";
import { useUiStore } from "../store/useUiStore";

const BTN =
  "w-1/2 border-none cursor-pointer min-w-[200px] rounded-[5px] bg-[#808284] p-[15px] text-[18px] text-white transition-colors duration-300 hover:bg-[#575656]";

export const GameCreate = () => {
  const { globalError, setError } = useUiStore();
  const { createGame, isLoading, loadingMessage } = useGameStore();
  const navigate = useNavigate();

  useEffect(() => {
    return () => setError(null);
  }, [setError]);

  const handleCreate = async (mode: "AI" | "PVP") => {
    const game = await createGame(mode);
    if (game) navigate(`/games/${game.uuid}`);
  };

  return (
    <div className="flex min-h-screen items-start justify-center pt-10">
      <div className="w-[500px] max-w-[95vw] rounded-[10px] bg-white p-[30px] shadow-[0_0_15px_rgba(0,0,0,0.1)]">
        {isLoading ? (
          <div className="my-[5px] animate-pulse text-center font-bold text-[#808284]">
            {loadingMessage}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-[15px]">
            <button onClick={() => handleCreate("AI")} className={BTN}>
              Играть с компьютером
            </button>
            <button onClick={() => handleCreate("PVP")} className={BTN}>
              Играть с другим игроком
            </button>
          </div>
        )}

        {globalError && (
          <div className="mb-4 w-full rounded-[4px] bg-[#f2dede] p-[10px] text-center text-[#d9534f]">
            {globalError}
          </div>
        )}
      </div>
    </div>
  );
};
