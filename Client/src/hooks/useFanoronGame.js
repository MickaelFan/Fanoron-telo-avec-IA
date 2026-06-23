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
  getWinner,
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

  const moveSerial = useRef(0);

  const winner = useMemo(() => getWinner(board), [board]);
  const phase = useMemo(() => getPhase(board), [board]);

  const xCount = countPieces(board, "X");
  const oCount = countPieces(board, "O");
  const xMovedCount = countMovedPieces(board, "X");
  const oMovedCount = countMovedPieces(board, "O");

  function resetGame() {
    setBoard(createEmptyBoard());
    setCurrentPlayer("X");
    setSelectedCell(null);
    setMessage("Joueur X : placez votre pion.");
    setHistory([]);
    setFuture([]);
    setLastMove(null);
    setIsAiThinking(false);
  }

  function playMove(player, move) {
    const { newBoard, pieceId } = applyMove(board, player, move);
    const nextPlayer = getOpponent(player);

    setHistory((prev) => [
      ...prev,
      {
        board,
        currentPlayer,
        selectedCell,
        message,
      },
    ]);

    setFuture([]);
    setBoard(newBoard);
    setSelectedCell(null);
    setCurrentPlayer(nextPlayer);
    setMessage(getStatusMessage(nextPlayer, newBoard));

    moveSerial.current += 1;

    setLastMove({
      serial: moveSerial.current,
      from: move.from,
      to: move.to,
      pieceId,
    });
  }

  function handleCellClick(index) {
    if (winner || isAiThinking) return;

    if (mode === "human-ai" && currentPlayer === "O") return;

    if (phase === "placement") {
      if (board[index]) {
        setMessage("Cette intersection est déjà occupée.");
        return;
      }

      playMove(currentPlayer, { from: null, to: index });
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

    playMove(currentPlayer, { from: selectedCell, to: index });
  }

  function undo() {
    if (history.length === 0) return;

    const previous = history[history.length - 1];

    setFuture((prev) => [
      {
        board,
        currentPlayer,
        selectedCell,
        message,
      },
      ...prev,
    ]);

    setBoard(previous.board);
    setCurrentPlayer(previous.currentPlayer);
    setSelectedCell(previous.selectedCell);
    setMessage(previous.message);
    setHistory((prev) => prev.slice(0, -1));
    setLastMove(null);
  }

  function redo() {
    if (future.length === 0) return;

    const next = future[0];

    setHistory((prev) => [
      ...prev,
      {
        board,
        currentPlayer,
        selectedCell,
        message,
      },
    ]);

    setBoard(next.board);
    setCurrentPlayer(next.currentPlayer);
    setSelectedCell(next.selectedCell);
    setMessage(next.message);
    setFuture((prev) => prev.slice(1));
    setLastMove(null);
  }

  useEffect(() => {
    if (mode !== "human-ai") return;
    if (currentPlayer !== "O") return;
    if (winner) return;

    setIsAiThinking(true);

    const timer = setTimeout(() => {
      const move = chooseAiMove(board, "O", difficulty);

      if (move) {
        playMove("O", move);
      }

      setIsAiThinking(false);
    }, 700);

    return () => clearTimeout(timer);
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
    xCount,
    oCount,
    xMovedCount,
    oMovedCount,
    lastMove,
    canUndo: history.length > 0,
    canRedo: future.length > 0,
    resetGame,
    handleCellClick,
    undo,
    redo,
  };
}