import React from "react";

import { BoardModel } from "../models/board.model";

interface BoardProps {
  data: BoardModel;
  disabled: boolean;
  icons: Record<number, string>;
  onMove: (row: number, col: number) => void;
}

export const GameBoard: React.FC<BoardProps> = ({
  data,
  disabled,
  icons,
  onMove,
}) => {
  const handleCellClick = (rIdx: number, cIdx: number) => {
    if (!disabled && !data.winningLine && data.field[rIdx][cIdx] === 0) {
      onMove(rIdx, cIdx);
    }
  };

  return (
    <div className="mx-auto flex flex-col gap-1">
      {data.field.map((row, rIdx) => (
        <div key={rIdx} className="flex justify-center gap-1">
          {row.map((cell, cIdx) => {
            const isWinner = data.isWinningCell?.(rIdx, cIdx);
            const isClickable = !disabled && !data.winningLine && cell === 0;

            return (
              <div
                key={cIdx}
                onClick={() => handleCellClick(rIdx, cIdx)}
                className={`flex size-[100px] items-center justify-center border border-[#ccc] bg-[#eee] text-[40px] transition-colors duration-300 ${isClickable ? "cursor-pointer hover:bg-[#ddd]" : "cursor-not-allowed"} ${isWinner ? "z-10 !bg-[#ebf9f2]" : ""} ${cell === 1 ? "text-[#d9534f]" : ""} ${cell === 2 ? "text-[#2078cb]" : ""} `}
              >
                {cell !== 0 && (
                  <span
                    className={`animate-zoom-in ${cell === 1 ? "text-[#d9534f]" : "text-[#2078cb]"}`}
                  >
                    {icons[cell]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
