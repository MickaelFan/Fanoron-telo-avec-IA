import { useEffect, useMemo, useRef, useState } from "react";
import { ADJACENCY } from "../constants/gameConstants";
import {
  applyMove,
  chooseAiMove,
  countMovedPieces,
  countPieces,
  createEmptyBoard,
  getOpponent,
  getPhase,
  getStatusMessage,
  getWinningLine,
  isRealWinningLine,
  isValidMove,
} from "../utils/gameLogic";

export default function useFanoronGame({
  initialMode = "human-human",
  initialDifficulty = "easy",
} = {}) {
  const [mode] = useState(initialMode);
  const [difficulty] = useState(initialDifficulty);

  const [board, setBoard] = useState(() => createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [selectedCell, setSelectedCell] = useState(null);
  const [message, setMessage] = useState("Joueur X : placez votre pion.");
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);

  const moveSerial = useRef(0);
  const aiTimerRef = useRef(null);

  const phase = useMemo(() => getPhase(board), [board]);

  const xCount = countPieces(board, "X");
  const oCount = countPieces(board, "O");

  const xMovedCount = countMovedPieces(board, "X");
  const oMovedCount = countMovedPieces(board, "O");

  function clearAiTimer() {
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
  }

  function resetGame() {
    clearAiTimer();
    setBoard(createEmptyBoard());
    setCurrentPlayer("X");
    setSelectedCell(null);
    setMessage("Joueur X : placez votre pion.");
    setHistory([]);
    setFuture([]);
    setLastMove(null);
    setIsAiThinking(false);
    setWinner(null);
    setWinningLine(null);
    moveSerial.current = 0;
  }

  function playMove(player, move) {
    if (!isValidMove(board, player, move)) {
      setMessage("Coup invalide ignoré.");
      return false;
    }

    const result = applyMove(board, player, move);

    if (!result) {
      setMessage("Coup invalide ignoré.");
      return false;
    }

    const { newBoard, pieceId } = result;

    const line = getWinningLine(newBoard, player);
    const hasRealWinningLine = isRealWinningLine(newBoard, player, line);
    const moveWinner = hasRealWinningLine ? player : null;
    const finalWinningLine = hasRealWinningLine ? line : null;

    const nextPlayer = getOpponent(player);

    setHistory((prev) => [
      ...prev,
      {
        board,
        currentPlayer,
        selectedCell,
        message,
        winner,
        winningLine,
      },
    ]);

    setFuture([]);
    setBoard(newBoard);
    setSelectedCell(null);
    setWinner(moveWinner);
    setWinningLine(finalWinningLine);

    if (moveWinner && finalWinningLine) {
      setCurrentPlayer(player);
      setMessage(`Victoire du joueur ${moveWinner} !`);
    } else {
      setCurrentPlayer(nextPlayer);
      setMessage(getStatusMessage(nextPlayer, newBoard, player));
    }

    moveSerial.current += 1;

    setLastMove({
      serial: moveSerial.current,
      from: move.from,
      to: move.to,
      pieceId,
    });

    return true;
  }

  function handleCellClick(index) {
    if (winner || isAiThinking) return;

    if (mode === "human-ai" && currentPlayer === "O") return;

    if (phase === "placement") {
      const move = {
        from: null,
        to: index,
      };

      if (!isValidMove(board, currentPlayer, move)) {
        setMessage("Cette intersection est déjà occupée.");
        return;
      }

      playMove(currentPlayer, move);
      return;
    }

    if (selectedCell === null) {
      if (board[index]?.player !== currentPlayer) {
        setMessage(`Sélectionnez un pion du joueur ${currentPlayer}.`);
        return;
      }

      setSelectedCell(index);
      setMessage("Choisissez une intersection voisine libre.");
      return;
    }

    if (index === selectedCell) {
      setSelectedCell(null);
      setMessage(`Joueur ${currentPlayer} : déplacez un pion.`);
      return;
    }

    if (board[index]?.player === currentPlayer) {
      setSelectedCell(index);
      return;
    }

    if (board[index]) {
      setMessage("Cette intersection est déjà occupée.");
      return;
    }

    if (!ADJACENCY[selectedCell].includes(index)) {
      setMessage("Déplacement interdit : choisissez une intersection voisine.");
      return;
    }

    playMove(currentPlayer, {
      from: selectedCell,
      to: index,
    });
  }

  function undo() {
    if (history.length === 0 || isAiThinking) return;

    clearAiTimer();

    const previous = history[history.length - 1];

    setFuture((prev) => [
      {
        board,
        currentPlayer,
        selectedCell,
        message,
        winner,
        winningLine,
      },
      ...prev,
    ]);

    setBoard(previous.board);
    setCurrentPlayer(previous.currentPlayer);
    setSelectedCell(previous.selectedCell);
    setMessage(previous.message);
    setWinner(previous.winner ?? null);
    setWinningLine(previous.winningLine ?? null);
    setHistory((prev) => prev.slice(0, -1));
    setLastMove(null);
    setIsAiThinking(false);
  }

  function redo() {
    if (future.length === 0 || isAiThinking) return;

    clearAiTimer();

    const next = future[0];

    setHistory((prev) => [
      ...prev,
      {
        board,
        currentPlayer,
        selectedCell,
        message,
        winner,
        winningLine,
      },
    ]);

    setBoard(next.board);
    setCurrentPlayer(next.currentPlayer);
    setSelectedCell(next.selectedCell);
    setMessage(next.message);
    setWinner(next.winner ?? null);
    setWinningLine(next.winningLine ?? null);
    setFuture((prev) => prev.slice(1));
    setLastMove(null);
    setIsAiThinking(false);
  }

  useEffect(() => {
    clearAiTimer();

    if (mode !== "human-ai") return;
    if (currentPlayer !== "O") return;
    if (winner) return;

    setIsAiThinking(true);

    aiTimerRef.current = setTimeout(() => {
      const move = chooseAiMove(board, "O", difficulty);

      if (move && isValidMove(board, "O", move)) {
        playMove("O", move);
      } else {
        setMessage("L'IA ne trouve aucun coup valide.");
      }

      setIsAiThinking(false);
      aiTimerRef.current = null;
    }, 700);

    return () => clearAiTimer();
  }, [mode, currentPlayer, winner, board, difficulty]);

  return {
    mode,
    difficulty,

    board,
    phase,
    currentPlayer,
    selectedCell,
    message: isAiThinking ? "L'IA réfléchit..." : message,
    winner,
    winningLine,

    xCount,
    oCount,
    xMovedCount,
    oMovedCount,

    lastMove,

    canUndo: history.length > 0 && !isAiThinking,
    canRedo: future.length > 0 && !isAiThinking,

    resetGame,
    handleCellClick,
    undo,
    redo,
  };
}