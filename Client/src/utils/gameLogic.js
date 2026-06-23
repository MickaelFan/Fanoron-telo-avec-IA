import { ADJACENCY, WIN_LINES } from "../constants/gameConstants";

export function createEmptyBoard() {
  return Array(9).fill(null);
}

export function getOpponent(player) {
  return player === "X" ? "O" : "X";
}

export function countPieces(board, player) {
  return board.filter((piece) => piece?.player === player).length;
}

export function countMovedPieces(board, player) {
  return board.filter((piece) => piece?.player === player && piece.hasMoved)
    .length;
}

export function getPhase(board) {
  return board.filter(Boolean).length < 6 ? "placement" : "movement";
}

export function haveAllPlayerPiecesMoved(board, player) {
  const pieces = board.filter((piece) => piece?.player === player);

  return pieces.length === 3 && pieces.every((piece) => piece.hasMoved === true);
}

export function getWinner(board) {
  if (getPhase(board) !== "movement") {
    return null;
  }

  for (const [a, b, c] of WIN_LINES) {
    const p1 = board[a];
    const p2 = board[b];
    const p3 = board[c];

    if (!p1 || !p2 || !p3) continue;

    const samePlayer =
      p1.player === p2.player &&
      p2.player === p3.player;

    if (!samePlayer) continue;

    const player = p1.player;

    if (haveAllPlayerPiecesMoved(board, player)) {
      return player;
    }
  }

  return null;
}

export function getValidMoves(board, player) {
  const phase = getPhase(board);

  if (phase === "placement") {
    return board
      .map((cell, index) => (cell === null ? { from: null, to: index } : null))
      .filter(Boolean);
  }

  const moves = [];

  board.forEach((piece, from) => {
    if (piece?.player !== player) return;

    ADJACENCY[from].forEach((to) => {
      if (board[to] === null) {
        moves.push({ from, to });
      }
    });
  });

  return moves;
}

export function applyMove(board, player, move) {
  const newBoard = board.map((piece) => (piece ? { ...piece } : null));

  let movedPiece;

  if (move.from === null) {
    movedPiece = {
      id: `${player}-${countPieces(board, player) + 1}`,
      player,
      initialIndex: move.to,
      hasMoved: false,
    };
  } else {
    movedPiece = {
      ...newBoard[move.from],
      hasMoved: true,
    };

    newBoard[move.from] = null;
  }

  newBoard[move.to] = movedPiece;

  return {
    newBoard,
    pieceId: movedPiece.id,
  };
}

export function findWinningMove(board, player) {
  const moves = getValidMoves(board, player);

  for (const move of moves) {
    const { newBoard } = applyMove(board, player, move);

    if (getWinner(newBoard) === player) {
      return move;
    }
  }

  return null;
}

export function chooseAiMove(board, aiPlayer, difficulty) {
  const validMoves = getValidMoves(board, aiPlayer);
  if (validMoves.length === 0) return null;

  if (difficulty === "medium" || difficulty === "hard") {
    const winningMove = findWinningMove(board, aiPlayer);
    if (winningMove) return winningMove;

    const blockMove = findWinningMove(board, getOpponent(aiPlayer));
    if (blockMove) return blockMove;
  }

  if (difficulty === "hard") {
    const centerMove = validMoves.find((move) => move.to === 4);
    if (centerMove) return centerMove;

    const cornerMove = validMoves.find((move) =>
      [0, 2, 6, 8].includes(move.to)
    );
    if (cornerMove) return cornerMove;
  }

  return validMoves[Math.floor(Math.random() * validMoves.length)];
}

export function getStatusMessage(nextPlayer, nextBoard) {
  const winner = getWinner(nextBoard);
  const phase = getPhase(nextBoard);
  const movedCount = countMovedPieces(nextBoard, nextPlayer);

  if (winner) {
    return `Victoire du joueur ${winner} !`;
  }

  if (phase === "placement") {
    return `Joueur ${nextPlayer} : placez votre pion.`;
  }

  return `Joueur ${nextPlayer} : déplacez un pion. Pions déjà déplacés : ${movedCount}/3.`;
}