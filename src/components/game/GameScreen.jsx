import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  FaBars,
  FaTimes,
  FaUndo,
  FaRedo,
  FaHome,
  FaSyncAlt,
  FaTrophy,
} from "react-icons/fa";
import GameBoard from "./GameBoard";
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
  winningLine,
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const hasVisibleWinningLine =
    Boolean(winner) &&
    Array.isArray(winningLine) &&
    winningLine.length === 3 &&
    winningLine.every((index) => board[index]?.player === winner);

  const isFinished = hasVisibleWinningLine;

  useEffect(() => {
    if (!hasVisibleWinningLine) {
      setShowWinnerModal(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowWinnerModal(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasVisibleWinningLine]);

  useGSAP(
    () => {
      gsap.from(".game-enter", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.fromTo(
        ".board-focus",
        {
          scale: 0.96,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.75,
          delay: 0.15,
          ease: "power3.out",
        }
      );

      gsap.to(".board-aura", {
        scale: 1.06,
        opacity: 0.7,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: root }
  );

  useGSAP(
    () => {
      if (!showWinnerModal) return;

      gsap.fromTo(
        ".winner-backdrop",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.28,
          ease: "power2.out",
        }
      );

      gsap.fromTo(
        ".winner-modal",
        {
          y: 36,
          scale: 0.92,
          opacity: 0,
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.55,
          ease: "back.out(1.7)",
        }
      );

      gsap.fromTo(
        ".winner-icon",
        {
          rotate: -12,
          scale: 0.6,
        },
        {
          rotate: 0,
          scale: 1,
          duration: 0.6,
          delay: 0.15,
          ease: "back.out(2)",
        }
      );
    },
    {
      scope: root,
      dependencies: [showWinnerModal],
    }
  );

  function handleRestart() {
    setMenuOpen(false);
    setShowWinnerModal(false);
    resetGame();
  }

  function handleBackToMenu() {
    setMenuOpen(false);
    setShowWinnerModal(false);
    onBackToMenu();
  }

  function topActionClass(disabled = false, variant = "normal") {
    const base =
      "group relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl border text-sm shadow-xl backdrop-blur-xl transition sm:h-11 sm:w-11 sm:rounded-2xl sm:text-base md:h-12 md:w-12 md:text-lg";

    if (disabled) {
      return [
        base,
        "cursor-not-allowed border-white/10 bg-white/10 text-slate-400 opacity-60",
      ].join(" ");
    }

    if (variant === "menu") {
      return [
        base,
        "cursor-pointer border-cyan-300/40 bg-cyan-300/15 text-cyan-100 shadow-cyan-400/20 hover:-translate-y-1 hover:border-cyan-200 hover:bg-cyan-300/25 hover:text-white hover:shadow-cyan-400/30",
      ].join(" ");
    }

    return [
      base,
      "cursor-pointer border-emerald-300/40 bg-emerald-300/10 text-emerald-100 shadow-emerald-400/20 hover:-translate-y-1 hover:border-emerald-200 hover:bg-emerald-300/20 hover:text-white hover:shadow-emerald-400/30",
    ].join(" ");
  }

  return (
    <section
      ref={root}
      className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center px-3 py-4 sm:px-4 sm:py-6 lg:px-8"
    >
      <header className="game-enter flex w-full items-center justify-between gap-2">
        <h1
          className="min-w-0 flex-1 bg-gradient-to-r from-emerald-300 via-cyan-300 to-yellow-200 bg-clip-text text-left text-[clamp(0.82rem,4vw,1.45rem)] leading-[1.55] text-transparent drop-shadow-2xl sm:text-4xl md:text-5xl"
          style={{
            fontFamily: '"Press Start 2P", system-ui, sans-serif',
            textShadow: "0 0 28px rgba(52, 211, 153, 0.28)",
          }}
        >
          Fanoron-telo
        </h1>

        <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo || isFinished}
            className={topActionClass(!canUndo || isFinished)}
            aria-label="Annuler le coup"
            title="Annuler"
          >
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 to-transparent opacity-0 transition group-hover:opacity-100" />
            <FaUndo className="relative z-10" />
          </button>

          <button
            type="button"
            onClick={redo}
            disabled={!canRedo || isFinished}
            className={topActionClass(!canRedo || isFinished)}
            aria-label="Rétablir le coup"
            title="Rétablir"
          >
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 to-transparent opacity-0 transition group-hover:opacity-100" />
            <FaRedo className="relative z-10" />
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className={topActionClass(false, "menu")}
            aria-label="Ouvrir le menu"
            title="Menu"
          >
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 to-transparent opacity-0 transition group-hover:opacity-100" />
            <FaBars className="relative z-10" />
          </button>
        </div>
      </header>

      <main className="game-enter board-focus mt-5 flex w-full flex-1 flex-col items-center justify-start sm:mt-8">
        <div className="relative w-full max-w-[590px]">
          <div className="board-aura pointer-events-none absolute -inset-5 rounded-[2.6rem] bg-emerald-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -inset-2 rounded-[2.4rem] bg-cyan-400/10 blur-2xl" />

          <div className="relative rounded-[2.2rem] border border-emerald-300/20 bg-white/[0.055] p-3 shadow-[0_25px_95px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-4 md:p-5">
            <GameBoard
              board={board}
              selectedCell={selectedCell}
              lastMove={lastMove}
              winner={winner}
              winningLine={winningLine}
              onCellClick={handleCellClick}
              disabled={isFinished}
            />
          </div>
        </div>
      </main>

      <div
        className={[
          "fixed inset-0 z-40 transition",
          menuOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className={[
            "absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity",
            menuOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
          aria-label="Fermer le menu"
        />

        <aside
          className={[
            "absolute right-0 top-0 flex h-full w-[min(92vw,390px)] flex-col overflow-y-auto border-l border-white/10 bg-slate-950/95 p-5 shadow-2xl transition-transform duration-300",
            menuOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black text-white">Menu</h2>

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-2xl border border-white/10 bg-white/10 text-white transition hover:bg-white/15"
              aria-label="Fermer"
            >
              <FaTimes />
            </button>
          </div>

          <div className="mt-6 grid gap-3">
            <button
              type="button"
              onClick={handleRestart}
              className="group relative flex cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-2xl border border-orange-300/30 bg-gradient-to-r from-red-500 to-orange-500 px-4 py-4 text-sm font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-1 hover:shadow-red-500/40"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-70 transition duration-700 group-hover:translate-x-full" />
              <FaSyncAlt className="relative z-10" />
              <span className="relative z-10">Recommencer</span>
            </button>

            <button
              type="button"
              onClick={handleBackToMenu}
              className="group relative flex cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-4 text-sm font-black uppercase tracking-[0.08em] text-cyan-100 shadow-lg shadow-cyan-400/10 transition hover:-translate-y-1 hover:border-cyan-200 hover:bg-cyan-300/20 hover:text-white hover:shadow-cyan-400/25"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-70 transition duration-700 group-hover:translate-x-full" />
              <FaHome className="relative z-10" />
              <span className="relative z-10">Retour menu</span>
            </button>
          </div>

          <div className="mt-6 rounded-[1.8rem] border border-white/10 bg-white/[0.045] p-4">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
              Partie
            </p>

            <div className="grid grid-cols-3 gap-3 text-center">
              <MiniStat
                label="Phase"
                value={phase === "placement" ? "Placement" : "Mouvement"}
              />
              <MiniStat label="Tour" value={`Joueur ${currentPlayer}`} />
              <MiniStat label="Score" value={`${xCount} - ${oCount}`} />
            </div>
          </div>

          <div className="mt-5 space-y-3 rounded-[1.8rem] border border-white/10 bg-white/[0.045] p-4">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
              Détails
            </p>

            <InfoLine
              label="Mode"
              value={mode === "human-ai" ? "Humain vs IA" : "Humain vs Humain"}
            />
            <InfoLine
              label="Difficulté"
              value={mode === "human-ai" ? difficulty : "Aucune"}
            />
            <InfoLine label="Pions X" value={`${xCount}/3`} />
            <InfoLine label="Pions O" value={`${oCount}/3`} />
            <InfoLine label="Déplacés X" value={`${xMovedCount}/3`} />
            <InfoLine label="Déplacés O" value={`${oMovedCount}/3`} />
          </div>

          <div className="mt-5 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
              État
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-200">{message}</p>
          </div>

          <div className="mt-5 pb-4">
            <h3 className="mb-4 text-lg font-black text-white">
              Règles rapides
            </h3>

            <div className="space-y-4">
              <RuleCard
                number="01"
                title="Placement"
                text="Chaque joueur place un pion à tour de rôle sur une intersection libre. Si un joueur aligne ses 3 pions pendant cette phase, il gagne immédiatement."
              />

              <RuleCard
                number="02"
                title="Déplacement"
                text="Si aucun alignement n’est fait après la pose des 6 pions, chaque joueur déplace à tour de rôle un pion vers une intersection voisine libre en suivant les lignes."
              />

              <RuleCard
                number="03"
                title="Victoire"
                text="Le premier joueur qui aligne ses 3 pions sur une ligne, une colonne ou une diagonale gagne la partie."
              />
            </div>
          </div>
        </aside>
      </div>

      {isFinished && showWinnerModal && (
        <div className="fixed inset-0 z-50 grid place-items-center px-4">
          <div className="winner-backdrop absolute inset-0 bg-slate-950/80 backdrop-blur-md" />

          <div className="winner-modal relative w-full max-w-md rounded-[2.2rem] border border-yellow-300/30 bg-slate-950/95 p-6 text-center shadow-[0_35px_140px_rgba(0,0,0,0.65)]">
            <div className="winner-icon mx-auto grid h-20 w-20 place-items-center rounded-full border border-yellow-300/40 bg-yellow-300/15 text-4xl text-yellow-200 shadow-[0_0_60px_rgba(250,204,21,0.25)]">
              <FaTrophy />
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.28em] text-yellow-200">
              Partie terminée
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              Joueur {winner} gagne
            </h2>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleRestart}
                className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-300 via-cyan-300 to-yellow-200 px-4 py-4 text-sm font-black uppercase text-slate-950 shadow-[0_0_45px_rgba(52,211,153,0.3)] transition hover:-translate-y-1"
              >
                <FaSyncAlt />
                Recommencer
              </button>

              <button
                type="button"
                onClick={handleBackToMenu}
                className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-sm font-black uppercase text-white transition hover:-translate-y-1 hover:bg-white/15"
              >
                <FaHome />
                Quitter
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}