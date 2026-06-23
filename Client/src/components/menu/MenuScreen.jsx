import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import PreviewBoard from "./PreviewBoard";
import MiniStat from "../ui/MiniStat";

gsap.registerPlugin(useGSAP);

export default function MenuScreen() {
  const root = useRef(null);
  const navigate = useNavigate();

  const [mode, setMode] = useState("human-human");
  const [difficulty, setDifficulty] = useState("easy");

  useGSAP(
    () => {
      gsap.from(".menu-enter", {
        y: 32,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.to(".menu-orb", {
        y: -20,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
        ease: "sine.inOut",
      });

      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.5,
      });

      tl.set(".preview-runner", { x: 0, y: 0 })
        .fromTo(
          ".preview-piece",
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.35,
            stagger: 0.15,
            ease: "back.out(1.8)",
          }
        )
        .to(".preview-runner", {
          x: 112,
          y: 0,
          duration: 0.75,
          ease: "power2.inOut",
        })
        .to(".preview-glow", {
          opacity: 1,
          duration: 0.25,
          ease: "power1.out",
        })
        .to(".preview-piece", {
          opacity: 0,
          scale: 0.7,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.in",
        })
        .to(".preview-glow", {
          opacity: 0,
          duration: 0.2,
        });
    },
    { scope: root }
  );

  function startGame() {
    navigate("/game", {
      state: {
        mode,
        difficulty,
      },
    });
  }

  return (
    <section
      ref={root}
      className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-4 py-8 lg:grid-cols-[1fr_520px] lg:px-8"
    >
      <div>
        <div className="menu-enter mb-5 inline-flex items-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,1)]" />
          Algorithmique Avancée
        </div>

        <h1 className="menu-enter text-5xl font-black leading-none tracking-tight sm:text-7xl">
          Fanoron-telo{" "}
          <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-yellow-200 bg-clip-text text-transparent">
            Arena
          </span>
        </h1>

        <p className="menu-enter mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
          Une interface moderne pour un jeu traditionnel malgache, avec modes de
          jeu, animation des pions, et préparation pour l’intelligence
          artificielle Minimax Alpha-Beta côté Django.
        </p>

        <div className="menu-enter mt-8 grid max-w-xl gap-4 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-xl">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-300">
              Mode de jeu
            </span>

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-4 text-sm font-bold text-white outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10"
            >
              <option value="human-human">Humain vs Humain</option>
              <option value="human-ai">Humain vs IA</option>
            </select>
          </label>

          {mode === "human-ai" && (
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-300">
                Niveau de difficulté
              </span>

              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-4 text-sm font-bold text-white outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
              >
                <option value="easy">Facile</option>
                <option value="medium">Moyen</option>
                <option value="hard">Difficile</option>
              </select>
            </label>
          )}

          <button
            onClick={startGame}
            className="group mt-2 rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-yellow-300 px-6 py-4 text-base font-black text-slate-950 shadow-2xl shadow-emerald-500/20 transition hover:-translate-y-1 hover:shadow-emerald-500/40"
          >
            Nouvelle partie
            <span className="ml-2 inline-block transition group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>

      <div className="menu-enter relative">
        <div className="menu-orb absolute -left-8 -top-8 h-28 w-28 rounded-full bg-emerald-400/20 blur-2xl" />
        <div className="menu-orb absolute -bottom-10 right-8 h-32 w-32 rounded-full bg-cyan-400/20 blur-2xl" />

        <div className="relative rounded-[2.5rem] border border-white/10 bg-white/[0.06] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
                Aperçu du jeu
              </p>
              <h2 className="mt-1 text-2xl font-black">Plateau stratégique</h2>
            </div>

            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-200">
              3x3
            </span>
          </div>

          <PreviewBoard />

          <div className="mt-5 grid grid-cols-3 gap-3">
            <MiniStat label="Mode" value={mode === "human-ai" ? "IA" : "Local"} />
            <MiniStat label="Pions" value="3 vs 3" />
            <MiniStat label="But" value="Aligner" />
          </div>
        </div>
      </div>
    </section>
  );
}