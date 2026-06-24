import { ADJACENCY } from "../constants/gameConstants";

export const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const CENTER = 4;
const CORNERS = [0, 2, 6, 8];
const EDGES = [1, 3, 5, 7];

function isIndex(index) {
  return Number.isInteger(index) && index >= 0 && index <= 8;
}

function sameLine(lineA, lineB) {
  if (!Array.isArray(lineA) || !Array.isArray(lineB)) return false;
  if (lineA.length !== 3 || lineB.length !== 3) return false;

  return lineA.every((value, index) => value === lineB[index]);
}

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

export function getWinningLine(board, player) {
  if (!player) return null;

  for (const line of WIN_LINES) {
    const isAligned = line.every((index) => board[index]?.player === player);

    if (isAligned) {
      return line;
    }
  }

  return null;
}

export function isRealWinningLine(board, player, winningLine) {
  if (!player) return false;
  if (!Array.isArray(winningLine)) return false;
  if (winningLine.length !== 3) return false;

  const normalizedLine = winningLine.map(Number);

  const isKnownLine = WIN_LINES.some((line) => sameLine(line, normalizedLine));

  if (!isKnownLine) return false;

  return normalizedLine.every((index) => board[index]?.player === player);
}

export function getWinner(board, playerToCheck = null) {
  if (playerToCheck) {
    return getWinningLine(board, playerToCheck) ? playerToCheck : null;
  }

  if (getWinningLine(board, "X")) return "X";
  if (getWinningLine(board, "O")) return "O";

  return null;
}

export function isValidMove(board, player, move) {
  if (!move || !isIndex(move.to)) return false;

  const phase = getPhase(board);
  const playerPieceCount = countPieces(board, player);

  if (move.from === null) {
    if (phase !== "placement") return false;
    if (playerPieceCount >= 3) return false;
    if (board[move.to] !== null) return false;

    return true;
  }

  if (!isIndex(move.from)) return false;
  if (phase !== "movement") return false;
  if (playerPieceCount !== 3) return false;
  if (board[move.from]?.player !== player) return false;
  if (board[move.to] !== null) return false;
  if (!ADJACENCY[move.from]?.includes(move.to)) return false;

  return true;
}

export function getValidMoves(board, player) {
  const phase = getPhase(board);

  if (phase === "placement") {
    if (countPieces(board, player) >= 3) {
      return [];
    }

    return board
      .map((cell, index) => {
        if (cell !== null) return null;

        return {
          from: null,
          to: index,
        };
      })
      .filter(Boolean);
  }

  const moves = [];

  board.forEach((piece, from) => {
    if (piece?.player !== player) return;

    ADJACENCY[from].forEach((to) => {
      const move = { from, to };

      if (isValidMove(board, player, move)) {
        moves.push(move);
      }
    });
  });

  return moves;
}

export function applyMove(board, player, move) {
  if (!isValidMove(board, player, move)) {
    return null;
  }

  const newBoard = board.map((piece) => (piece ? { ...piece } : null));

  let movedPiece;

  if (move.from === null) {
    movedPiece = {
      id: `${player}-${countPieces(board, player) + 1}`,
      player,
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

export function getStatusMessage(nextPlayer, nextBoard, lastPlayer = null) {
  const winner = lastPlayer
    ? getWinner(nextBoard, lastPlayer)
    : getWinner(nextBoard);

  const phase = getPhase(nextBoard);

  if (winner) {
    return `Victoire du joueur ${winner} !`;
  }

  if (phase === "placement") {
    return `Joueur ${nextPlayer} : placez votre pion.`;
  }

  return `Joueur ${nextPlayer} : déplacez un pion vers une intersection voisine libre.`;
}

function moveGivesWinner(board, player, move) {
  const result = applyMove(board, player, move);

  if (!result) return false;

  const winningLine = getWinningLine(result.newBoard, player);

  return isRealWinningLine(result.newBoard, player, winningLine);
}

function findWinningMove(board, player) {
  const moves = getValidMoves(board, player);

  return moves.find((move) => moveGivesWinner(board, player, move)) ?? null;
}

function findBlockingMove(board, aiPlayer) {
  const opponent = getOpponent(aiPlayer);
  const opponentWinningMove = findWinningMove(board, opponent);

  if (!opponentWinningMove) {
    return null;
  }

  const aiMoves = getValidMoves(board, aiPlayer);

  return aiMoves.find((move) => move.to === opponentWinningMove.to) ?? null;
}

function isCenterMove(move) {
  return move.to === CENTER;
}

function isCornerMove(move) {
  return CORNERS.includes(move.to);
}

function isEdgeMove(move) {
  return EDGES.includes(move.to);
}

function getLineInfo(board, line, player) {
  const opponent = getOpponent(player);

  let playerCount = 0;
  let opponentCount = 0;
  let emptyCount = 0;

  for (const index of line) {
    const piece = board[index];

    if (!piece) {
      emptyCount += 1;
      continue;
    }

    if (piece.player === player) {
      playerCount += 1;
    }

    if (piece.player === opponent) {
      opponentCount += 1;
    }
  }

  return {
    playerCount,
    opponentCount,
    emptyCount,
  };
}

function evaluateLine(board, line, player) {
  const info = getLineInfo(board, line, player);

  if (info.playerCount > 0 && info.opponentCount > 0) {
    return 0;
  }

  if (info.playerCount === 3) {
    return 5000;
  }

  if (info.playerCount === 2 && info.emptyCount === 1) {
    return 180;
  }

  if (info.playerCount === 1 && info.emptyCount === 2) {
    return 30;
  }

  return 0;
}

function evaluateBoard(board, aiPlayer) {
  const opponent = getOpponent(aiPlayer);
  const winner = getWinner(board);

  if (winner === aiPlayer) return 100000;
  if (winner === opponent) return -100000;

  let score = 0;

  for (const line of WIN_LINES) {
    score += evaluateLine(board, line, aiPlayer);
    score -= evaluateLine(board, line, opponent) * 1.2;
  }

  if (board[CENTER]?.player === aiPlayer) {
    score += 70;
  }

  if (board[CENTER]?.player === opponent) {
    score -= 70;
  }

  for (const corner of CORNERS) {
    if (board[corner]?.player === aiPlayer) score += 25;
    if (board[corner]?.player === opponent) score -= 25;
  }

  for (const edge of EDGES) {
    if (board[edge]?.player === aiPlayer) score += 8;
    if (board[edge]?.player === opponent) score -= 8;
  }

  return score;
}

function getBoardKey(board, currentPlayer, depth) {
  const cells = board
    .map((piece) => {
      if (!piece) return "-";
      return piece.player;
    })
    .join("");

  return `${cells}_${currentPlayer}_${depth}`;
}

function orderMoves(board, moves, player, aiPlayer) {
  return [...moves].sort((moveA, moveB) => {
    const scoreMove = (move) => {
      const result = applyMove(board, player, move);

      if (!result) return -Infinity;

      const { newBoard } = result;

      let score = evaluateBoard(newBoard, aiPlayer);

      const winningLine = getWinningLine(newBoard, player);

      if (isRealWinningLine(newBoard, player, winningLine)) {
        score += 100000;
      }

      if (isCenterMove(move)) {
        score += 100;
      }

      if (isCornerMove(move)) {
        score += 50;
      }

      if (isEdgeMove(move)) {
        score += 15;
      }

      return score;
    };

    return scoreMove(moveB) - scoreMove(moveA);
  });
}

function minimax({
  board,
  currentPlayer,
  aiPlayer,
  depth,
  alpha,
  beta,
  table,
}) {
  const winner = getWinner(board);
  const opponent = getOpponent(aiPlayer);

  if (winner === aiPlayer) {
    return 100000 + depth;
  }

  if (winner === opponent) {
    return -100000 - depth;
  }

  if (depth === 0) {
    return evaluateBoard(board, aiPlayer);
  }

  const key = getBoardKey(board, currentPlayer, depth);

  if (table.has(key)) {
    return table.get(key);
  }

  const moves = getValidMoves(board, currentPlayer);

  if (moves.length === 0) {
    return evaluateBoard(board, aiPlayer);
  }

  const orderedMoves = orderMoves(board, moves, currentPlayer, aiPlayer);

  if (currentPlayer === aiPlayer) {
    let bestScore = -Infinity;

    for (const move of orderedMoves) {
      const result = applyMove(board, currentPlayer, move);

      if (!result) continue;

      const score = minimax({
        board: result.newBoard,
        currentPlayer: getOpponent(currentPlayer),
        aiPlayer,
        depth: depth - 1,
        alpha,
        beta,
        table,
      });

      bestScore = Math.max(bestScore, score);
      alpha = Math.max(alpha, bestScore);

      if (beta <= alpha) break;
    }

    table.set(key, bestScore);

    return bestScore;
  }

  let bestScore = Infinity;

  for (const move of orderedMoves) {
    const result = applyMove(board, currentPlayer, move);

    if (!result) continue;

    const score = minimax({
      board: result.newBoard,
      currentPlayer: getOpponent(currentPlayer),
      aiPlayer,
      depth: depth - 1,
      alpha,
      beta,
      table,
    });

    bestScore = Math.min(bestScore, score);
    beta = Math.min(beta, bestScore);

    if (beta <= alpha) break;
  }

  table.set(key, bestScore);

  return bestScore;
}

function chooseEasyMove(board, aiPlayer) {
  const moves = getValidMoves(board, aiPlayer);

  if (moves.length === 0) return null;

  return moves[Math.floor(Math.random() * moves.length)];
}

function chooseMediumMove(board, aiPlayer) {
  const moves = getValidMoves(board, aiPlayer);

  if (moves.length === 0) return null;

  const winningMove = findWinningMove(board, aiPlayer);

  if (winningMove && isValidMove(board, aiPlayer, winningMove)) {
    return winningMove;
  }

  const blockingMove = findBlockingMove(board, aiPlayer);

  if (blockingMove && isValidMove(board, aiPlayer, blockingMove)) {
    return blockingMove;
  }

  const centerMove = moves.find(isCenterMove);

  if (centerMove) {
    return centerMove;
  }

  const cornerMove = moves.find(isCornerMove);

  if (cornerMove) {
    return cornerMove;
  }

  return chooseEasyMove(board, aiPlayer);
}

function chooseHardMove(board, aiPlayer) {
  const moves = getValidMoves(board, aiPlayer);

  if (moves.length === 0) return null;

  const winningMove = findWinningMove(board, aiPlayer);

  if (winningMove && isValidMove(board, aiPlayer, winningMove)) {
    return winningMove;
  }

  const blockingMove = findBlockingMove(board, aiPlayer);

  if (blockingMove && isValidMove(board, aiPlayer, blockingMove)) {
    return blockingMove;
  }

  const opponent = getOpponent(aiPlayer);
  const table = new Map();

  const depth = getPhase(board) === "placement" ? 7 : 10;

  let bestMove = null;
  let bestScore = -Infinity;

  const orderedMoves = orderMoves(board, moves, aiPlayer, aiPlayer);

  for (const move of orderedMoves) {
    const result = applyMove(board, aiPlayer, move);

    if (!result) continue;

    const score = minimax({
      board: result.newBoard,
      currentPlayer: opponent,
      aiPlayer,
      depth: depth - 1,
      alpha: -Infinity,
      beta: Infinity,
      table,
    });

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  if (bestMove && isValidMove(board, aiPlayer, bestMove)) {
    return bestMove;
  }

  return chooseMediumMove(board, aiPlayer);
}

export function chooseAiMove(board, aiPlayer = "O", difficulty = "easy") {
  if (difficulty === "hard") {
    return chooseHardMove(board, aiPlayer);
  }

  if (difficulty === "medium") {
    return chooseMediumMove(board, aiPlayer);
  }

  return chooseEasyMove(board, aiPlayer);
}