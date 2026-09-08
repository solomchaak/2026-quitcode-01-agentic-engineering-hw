"use client";

import { useMemo, useState } from "react";
import { PButton, PTag } from "@porsche-design-system/components-react/ssr";
import styles from "./TicTacToe.module.css";

type Player = "X" | "O";
type Cell = Player | null;

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

function calculateWinner(board: Cell[]): Player | null {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

const EMPTY_BOARD: Cell[] = Array(9).fill(null);

export function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(EMPTY_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");

  const winner = useMemo(() => calculateWinner(board), [board]);
  const isDraw = !winner && board.every((cell) => cell !== null);

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;
    const nextBoard = [...board];
    nextBoard[index] = currentPlayer;
    setBoard(nextBoard);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const handleReset = () => {
    setBoard(EMPTY_BOARD);
    setCurrentPlayer("X");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.status}>
        {winner ? (
          <PTag variant="success">Player {winner} wins!</PTag>
        ) : isDraw ? (
          <PTag variant="warning">It&rsquo;s a draw!</PTag>
        ) : (
          <PTag variant={currentPlayer === "X" ? "primary" : "secondary"}>
            Next: Player {currentPlayer}
          </PTag>
        )}
      </div>

      <div className={styles.board}>
        {board.map((cell, index) => (
          <div key={index} className={styles.cell}>
            <PButton
              type="button"
              variant="secondary"
              disabled={!!cell || !!winner}
              aria={{
                "aria-label": cell
                  ? `Cell ${index + 1}: ${cell}`
                  : `Cell ${index + 1}: empty`,
              }}
              onClick={() => handleCellClick(index)}
            >
              {cell ?? ""}
            </PButton>
          </div>
        ))}
      </div>

      <PButton type="button" variant="secondary" onClick={handleReset}>
        New Game
      </PButton>
    </div>
  );
}
