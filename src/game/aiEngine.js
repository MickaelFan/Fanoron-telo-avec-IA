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

export const ADJACENCY = {
  0: [1, 3, 4],
  1: [0, 2, 4],
  2: [1, 5, 4],

  3: [0, 4, 6],
  4: [0, 1, 2, 3, 5, 6, 7, 8],
  5: [2, 4, 8],

  6: [3, 4, 7],
  7: [6, 4, 8],
  8: [5, 4, 7],
};

const CENTER = 4;
const CORNERS = [0, 2, 6, 8];
const EDGES = [1, 3, 5, 7];

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
      p1.player === p2.player && p2.player === p3.player;

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
      if (board[to] === null) {
        moves.push({
          from,
          to,
        });
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

function getBoardKey(board, currentPlayer, depth) {
  const cells = board
    .map((piece) => {
      if (!piece) return "-";
      return `${piece.player}${piece.hasMoved ? "1" : "0"}${piece.id}`;
    })
    .join("");

  return `${cells}_${currentPlayer}_${depth}`;
}

function moveGivesWinner(board, player, move) {
  const { newBoard } = applyMove(board, player, move);

  return getWinner(newBoard) === player;
}

function findWinningMove(board, player) {
  const moves = getValidMoves(board, player);

  return moves.find((move) => moveGivesWinner(board, player, move)) ?? null;
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

function moveUnmovedPiece(board, move, player) {
  if (move.from === null) return false;

  const piece = board[move.from];

  return piece?.player === player && piece.hasMoved === false;
}

function countLineData(board, line, player) {
  const opponent = getOpponent(player);

  let playerCount = 0;
  let opponentCount = 0;
  let emptyCount = 0;
  let movedPlayerCount = 0;

  for (const index of line) {
    const piece = board[index];

    if (!piece) {
      emptyCount += 1;
      continue;
    }

    if (piece.player === player) {
      playerCount += 1;

      if (piece.hasMoved) {
        movedPlayerCount += 1;
      }
    }

    if (piece.player === opponent) {
      opponentCount += 1;
    }
  }

  return {
    playerCount,
    opponentCount,
    emptyCount,
    movedPlayerCount,
  };
}

function evaluateLine(board, line, player) {
  const data = countLineData(board, line, player);

  if (data.playerCount > 0 && data.opponentCount > 0) {
    return 0;
  }

  let score = 0;

  if (data.playerCount === 3) {
    score += data.movedPlayerCount === 3 ? 5000 : 220;
  }

  if (data.playerCount === 2 && data.emptyCount === 1) {
    score += 120;
  }

  if (data.playerCount === 1 && data.emptyCount === 2) {
    score += 25;
  }

  score += data.movedPlayerCount * 35;

  return score;
}

function evaluateBoard(board, aiPlayer) {
  const opponent = getOpponent(aiPlayer);
  const winner = getWinner(board);

  if (winner === aiPlayer) return 100000;
  if (winner === opponent) return -100000;

  let score = 0;

  for (const line of WIN_LINES) {
    score += evaluateLine(board, line, aiPlayer);
    score -= evaluateLine(board, line, opponent) * 1.1;
  }

  const aiMoved = countMovedPieces(board, aiPlayer);
  const opponentMoved = countMovedPieces(board, opponent);

  score += aiMoved * 90;
  score -= opponentMoved * 75;

  if (haveAllPlayerPiecesMoved(board, aiPlayer)) {
    score += 250;
  }

  if (haveAllPlayerPiecesMoved(board, opponent)) {
    score -= 260;
  }

  if (board[CENTER]?.player === aiPlayer) {
    score += 60;
  }

  if (board[CENTER]?.player === opponent) {
    score -= 60;
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

function orderMoves(board, moves, player, aiPlayer) {
  return [...moves].sort((moveA, moveB) => {
    const scoreMove = (move) => {
      const { newBoard } = applyMove(board, player, move);

      let score = evaluateBoard(newBoard, aiPlayer);

      if (getWinner(newBoard) === player) {
        score += 100000;
      }

      if (moveUnmovedPiece(board, move, player)) {
        score += 700;
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
      const { newBoard } = applyMove(board, currentPlayer, move);

      const score = minimax({
        board: newBoard,
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
    const { newBoard } = applyMove(board, currentPlayer, move);

    const score = minimax({
      board: newBoard,
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

  const opponent = getOpponent(aiPlayer);

  const winningMove = findWinningMove(board, aiPlayer);
  if (winningMove) return winningMove;

  const blockingMove = findWinningMove(board, opponent);
  if (blockingMove) return blockingMove;

  if (getPhase(board) === "movement") {
    const unmovedMove = moves.find((move) =>
      moveUnmovedPiece(board, move, aiPlayer)
    );

    if (unmovedMove) return unmovedMove;
  }

  const centerMove = moves.find(isCenterMove);
  if (centerMove) return centerMove;

  const cornerMove = moves.find(isCornerMove);
  if (cornerMove) return cornerMove;

  return chooseEasyMove(board, aiPlayer);
}

function chooseHardMove(board, aiPlayer) {
  const moves = getValidMoves(board, aiPlayer);

  if (moves.length === 0) return null;

  const opponent = getOpponent(aiPlayer);

  const winningMove = findWinningMove(board, aiPlayer);
  if (winningMove) return winningMove;

  const blockingMove = findWinningMove(board, opponent);
  if (blockingMove) return blockingMove;

  const table = new Map();
  const phase = getPhase(board);
  const depth = phase === "placement" ? 7 : 10;

  let bestMove = null;
  let bestScore = -Infinity;

  const orderedMoves = orderMoves(board, moves, aiPlayer, aiPlayer);

  for (const move of orderedMoves) {
    const { newBoard } = applyMove(board, aiPlayer, move);

    const score = minimax({
      board: newBoard,
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

  return bestMove ?? chooseMediumMove(board, aiPlayer);
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