import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import GameBoard from "./GameBoard";
import GameButton from "../ui/GameButton";
import InfoLine from "../ui/InfoLine";
import MiniStat from "../ui/MiniStat";
import RuleCard from "../ui/RuleCard";

gsap.registerPlugin(useGSAP);

export default function GameScreen({
  board,
  phase,
  mode,
  difficulty,
  currentPlayer,
  selectedCell,
  message,
  winner,
  xCount,
  oCount,
  xMovedCount,
  oMovedCount,
  lastMove,
  handleCellClick,
  undo,
  redo,
  resetGame,
  onBackToMenu,
  canUndo,
  canRedo,
}) {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from(".game-enter", {
        y: 24,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: "power3.out",
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 lg:px-8"
    >
      <header className="game-enter mb-6 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
            Partie en cours
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-5xl">
            Fanoron-telo Arena
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <MiniStat label="Phase" value={phase === "placement" ? "Placement" : "Mouvement"} />
          <MiniStat label="Tour" value={`Joueur ${currentPlayer}`} />
          <MiniStat label="Score" value={`${xCount} - ${oCount}`} />
        </div>
      </header>

      <div className="grid flex-1 gap-6 lg:grid-cols-[280px_1fr_300px]">
        <aside className="game-enter rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-5 text-xl font-black">Contrôle</h2>

          <div className="space-y-3">
            <InfoLine label="Mode" value={mode === "human-ai" ? "Humain vs IA" : "Humain vs Humain"} />
            <InfoLine label="Difficulté" value={mode === "human-ai" ? difficulty : "Aucune"} />
            <InfoLine label="Pions X" value={`${xCount}/3`} />
            <InfoLine label="Pions O" value={`${oCount}/3`} />
            <InfoLine label="Déplacés X" value={`${xMovedCount}/3`} />
            <InfoLine label="Déplacés O" value={`${oMovedCount}/3`} />
          </div>

          <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
              État
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-200">{message}</p>
          </div>

          <div className="mt-6 grid gap-3">
            <GameButton onClick={undo} disabled={!canUndo}>
              Annuler
            </GameButton>

            <GameButton onClick={redo} disabled={!canRedo}>
              Rétablir
            </GameButton>

            <button
              onClick={resetGame}
              className="rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-500/20 transition hover:-translate-y-0.5 hover:shadow-red-500/30"
            >
              Recommencer
            </button>

            <button
              onClick={onBackToMenu}
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              Retour menu
            </button>
          </div>
        </aside>

        <section className="game-enter flex items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.05] p-4 shadow-2xl backdrop-blur-xl sm:p-8">
          <GameBoard
            board={board}
            selectedCell={selectedCell}
            lastMove={lastMove}
            onCellClick={handleCellClick}
          />
        </section>

        <aside className="game-enter rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-5 text-xl font-black">Règles rapides</h2>

          <div className="space-y-4">
            <RuleCard
              number="01"
              title="Placement"
              text="Chaque joueur place 3 pions sur les intersections libres. La victoire est impossible pendant cette phase."
            />
            <RuleCard
              number="02"
              title="Déplacement"
              text="Après les 6 pions posés, un pion se déplace vers une intersection voisine libre."
            />
            <RuleCard
              number="03"
              title="Victoire"
              text="Pour gagner, il faut aligner ses 3 pions et avoir déjà déplacé chacun de ses 3 pions au moins une fois."
            />
          </div>

          {winner && (
            <div className="mt-6 rounded-3xl border border-yellow-300/30 bg-yellow-300/10 p-5 text-center">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-200">
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
  );
}