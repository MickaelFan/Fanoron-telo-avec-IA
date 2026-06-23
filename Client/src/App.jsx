import { useMemo, useState } from "react";

const EMPTY_BOARD = Array(9).fill(null);

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const ADJACENCY = {
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

const POSITIONS = [
  { left: "8%", top: "8%" },
  { left: "50%", top: "8%" },
  { left: "92%", top: "8%" },

  { left: "8%", top: "50%" },
  { left: "50%", top: "50%" },
  { left: "92%", top: "50%" },

  { left: "8%", top: "92%" },
  { left: "50%", top: "92%" },
  { left: "92%", top: "92%" },
];

function getWinner(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function getPhase(board) {
  return board.filter(Boolean).length < 6 ? "placement" : "movement";
}

function countPieces(board, player) {
  return board.filter((cell) => cell === player).length;
}

function App() {
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [selectedCell, setSelectedCell] = useState(null);
  const [mode, setMode] = useState("human-vs-human");
  const [difficulty, setDifficulty] = useState("easy");
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [message, setMessage] = useState("Joueur X : placez votre pion.");

  const winner = useMemo(() => getWinner(board), [board]);
  const phase = useMemo(() => getPhase(board), [board]);

  const xCount = countPieces(board, "X");
  const oCount = countPieces(board, "O");

  function saveHistory() {
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
  }

  function updateMessage(nextPlayer, nextBoard) {
    const nextWinner = getWinner(nextBoard);
    const nextPhase = getPhase(nextBoard);

    if (nextWinner) {
      setMessage(`Victoire du joueur ${nextWinner} !`);
      return;
    }

    if (nextPhase === "placement") {
      setMessage(`Joueur ${nextPlayer} : placez votre pion.`);
    } else {
      setMessage(`Joueur ${nextPlayer} : déplacez un pion.`);
    }
  }

  function playMove(player, move) {
    saveHistory();

    const newBoard = [...board];

    if (move.from === null) {
      newBoard[move.to] = player;
    } else {
      newBoard[move.from] = null;
      newBoard[move.to] = player;
    }

    const nextPlayer = player === "X" ? "O" : "X";

    setBoard(newBoard);
    setSelectedCell(null);
    setCurrentPlayer(nextPlayer);
    updateMessage(nextPlayer, newBoard);
  }

  function handleCellClick(index) {
    if (winner) return;

    if (phase === "placement") {
      if (board[index]) {
        setMessage("Cette intersection est déjà occupée.");
        return;
      }

      playMove(currentPlayer, { from: null, to: index });
      return;
    }

    if (selectedCell === null) {
      if (board[index] !== currentPlayer) {
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

    if (board[index] === currentPlayer) {
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

  function resetGame() {
    setBoard(EMPTY_BOARD);
    setCurrentPlayer("X");
    setSelectedCell(null);
    setHistory([]);
    setFuture([]);
    setMessage("Joueur X : placez votre pion.");
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
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute right-[-10%] top-[20%] h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[35%] h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,1)]" />
              Hackathon IA
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
              Fanoron-telo{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-yellow-200 bg-clip-text text-transparent">
                Arena
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Jeu traditionnel malgache en version moderne avec interface
              stratégique, modes de jeu, IA et préparation Minimax Alpha-Beta.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <InfoBadge label="Phase" value={phase === "placement" ? "Placement" : "Mouvement"} />
            <InfoBadge label="Tour" value={`Joueur ${currentPlayer}`} />
            <InfoBadge label="Score" value={`${xCount} - ${oCount}`} />
          </div>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[280px_1fr_300px]">
          <aside className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl backdrop-blur-xl">
            <h2 className="mb-5 text-xl font-black">Configuration</h2>

            <div className="space-y-4">
              <Field label="Mode de jeu">
                <select
                  value={mode}
                  onChange={(e) => {
                    setMode(e.target.value);
                    resetGame();
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10"
                >
                  <option value="human-vs-human">Humain vs Humain</option>
                  <option value="human-vs-ai">Humain vs IA</option>
                  <option value="ai-vs-ai">IA vs IA</option>
                </select>
              </Field>

              <Field label="Difficulté IA">
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                >
                  <option value="easy">Facile</option>
                  <option value="medium">Moyenne</option>
                  <option value="hard">Difficile</option>
                </select>
              </Field>
            </div>

            <div className="mt-6 grid gap-3">
              <GameButton onClick={undo} disabled={history.length === 0}>
                Annuler
              </GameButton>

              <GameButton onClick={redo} disabled={future.length === 0}>
                Rétablir
              </GameButton>

              <button
                onClick={resetGame}
                className="rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-500/20 transition hover:-translate-y-0.5 hover:shadow-red-500/30"
              >
                Nouvelle partie
              </button>
            </div>

            <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
                État du jeu
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-200">{message}</p>
            </div>
          </aside>

          <section className="relative flex items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-300">
              Plateau 3x3
            </div>

            <div className="relative aspect-square w-full max-w-[520px] rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 p-8 shadow-[0_0_80px_rgba(16,185,129,0.12)]">
              <div className="absolute inset-6 rounded-[1.5rem] border border-white/5 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),transparent_60%)]" />

              <svg className="absolute inset-8 h-[calc(100%-4rem)] w-[calc(100%-4rem)]" viewBox="0 0 100 100">
                <line x1="8" y1="8" x2="92" y2="8" className="stroke-emerald-300/70" strokeWidth="1.6" />
                <line x1="8" y1="50" x2="92" y2="50" className="stroke-emerald-300/70" strokeWidth="1.6" />
                <line x1="8" y1="92" x2="92" y2="92" className="stroke-emerald-300/70" strokeWidth="1.6" />

                <line x1="8" y1="8" x2="8" y2="92" className="stroke-emerald-300/70" strokeWidth="1.6" />
                <line x1="50" y1="8" x2="50" y2="92" className="stroke-emerald-300/70" strokeWidth="1.6" />
                <line x1="92" y1="8" x2="92" y2="92" className="stroke-emerald-300/70" strokeWidth="1.6" />

                <line x1="8" y1="8" x2="92" y2="92" className="stroke-cyan-300/50" strokeWidth="1.4" />
                <line x1="92" y1="8" x2="8" y2="92" className="stroke-cyan-300/50" strokeWidth="1.4" />
              </svg>

              {board.map((value, index) => (
                <button
                  key={index}
                  onClick={() => handleCellClick(index)}
                  style={{
                    left: POSITIONS[index].left,
                    top: POSITIONS[index].top,
                  }}
                  className={[
                    "absolute z-10 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border transition duration-200 sm:h-20 sm:w-20",
                    selectedCell === index
                      ? "border-yellow-300 bg-yellow-300/20 shadow-[0_0_35px_rgba(253,224,71,0.45)]"
                      : "border-emerald-300/40 bg-slate-950/80 shadow-[0_0_25px_rgba(16,185,129,0.12)]",
                    "hover:scale-110 hover:border-emerald-200 hover:bg-emerald-300/10",
                  ].join(" ")}
                >
                  {value && (
                    <span
                      className={[
                        "grid h-11 w-11 place-items-center rounded-full text-lg font-black shadow-xl sm:h-14 sm:w-14 sm:text-2xl",
                        value === "X"
                          ? "bg-gradient-to-br from-emerald-300 to-green-600 text-slate-950 shadow-emerald-400/30"
                          : "bg-gradient-to-br from-cyan-300 to-blue-700 text-white shadow-cyan-400/30",
                      ].join(" ")}
                    >
                      {value}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl backdrop-blur-xl">
            <h2 className="mb-5 text-xl font-black">Règles rapides</h2>

            <div className="space-y-4">
              <RuleCard
                number="01"
                title="Placement"
                text="Chaque joueur place 3 pions sur les intersections libres du plateau."
              />

              <RuleCard
                number="02"
                title="Déplacement"
                text="Après les 6 pions posés, un pion peut se déplacer vers une intersection voisine libre."
              />

              <RuleCard
                number="03"
                title="Victoire"
                text="Le premier joueur qui aligne ses 3 pions en ligne, colonne ou diagonale gagne."
              />
            </div>

            {winner && (
              <div className="mt-6 rounded-3xl border border-yellow-300/30 bg-yellow-300/10 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-200">
                  Résultat
                </p>
                <p className="mt-2 text-2xl font-black text-yellow-100">
                  Joueur {winner} gagne
                </p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

function InfoBadge({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-emerald-200">{value}</p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-300">
        {label}
      </span>
      {children}
    </label>
  );
}

function GameButton({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
    >
      {children}
    </button>
  );
}

function RuleCard({ number, title, text }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
      <div className="mb-2 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-400/10 text-xs font-black text-emerald-300">
          {number}
        </span>
        <h3 className="font-black text-white">{title}</h3>
      </div>
      <p className="text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}

export default App;