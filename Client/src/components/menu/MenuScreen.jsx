import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import PreviewBoard from "./PreviewBoard";

gsap.registerPlugin(useGSAP);

const PREVIEW_POSITIONS = {
  0: { left: 8, top: 8 },
  1: { left: 50, top: 8 },
  2: { left: 92, top: 8 },
  3: { left: 8, top: 50 },
  4: { left: 50, top: 50 },
  5: { left: 92, top: 50 },
  6: { left: 8, top: 92 },
  7: { left: 50, top: 92 },
  8: { left: 92, top: 92 },
};

export default function MenuScreen() {
  const root = useRef(null);
  const navigate = useNavigate();

  const [mode, setMode] = useState("human-human");
  const [difficulty, setDifficulty] = useState("easy");

  useGSAP(
    () => {
      gsap.from(".menu-enter", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.to(".menu-orb", {
        y: -14,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
        ease: "sine.inOut",
      });

      

      const previewBoard = root.current?.querySelector(".preview-board");
      if (!previewBoard) return;

      const getDelta = (from, to) => {
        const rect = previewBoard.getBoundingClientRect();

        return {
          x:
            ((PREVIEW_POSITIONS[to].left - PREVIEW_POSITIONS[from].left) /
              100) *
            rect.width,
          y:
            ((PREVIEW_POSITIONS[to].top - PREVIEW_POSITIONS[from].top) /
              100) *
            rect.height,
        };
      };

      const moveX3To5 = getDelta(2, 5);
      const moveO2To2 = getDelta(4, 2);
      const moveX1To4 = getDelta(0, 4);
      const moveO1To0 = getDelta(3, 0);
      const moveX1To3 = getDelta(0, 3);
      const moveO3To7 = getDelta(6, 7);
      const moveX2To4 = getDelta(1, 4);

      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 1,
      });

      tl.set(".preview-piece", {
        x: 0,
        y: 0,
        opacity: 0,
        scale: 0.85,
        transformOrigin: "center center",
      })
        .set(".preview-target", {
          opacity: 0,
          scale: 0.7,
          transformOrigin: "center center",
        })
        .set(".preview-glow", {
          opacity: 0,
          scaleX: 0,
          transformOrigin: "left center",
        })

        .to(".preview-piece", {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          stagger: 0.08,
          ease: "back.out(1.8)",
        })

        .to(".preview-target-5", {
          opacity: 1,
          scale: 1,
          duration: 0.16,
          ease: "power2.out",
          delay: 0.6,
        })
        .to(
          ".preview-x-3",
          {
            x: moveX3To5.x,
            y: moveX3To5.y,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "<+=0.1"
        )
        .to(".preview-target-5", {
          opacity: 0,
          scale: 0.7,
          duration: 0.16,
        })

        .to(".preview-target-2", {
          opacity: 1,
          scale: 1,
          duration: 0.16,
          ease: "power2.out",
        })
        .to(
          ".preview-o-2",
          {
            x: moveO2To2.x,
            y: moveO2To2.y,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "<+=0.1"
        )
        .to(".preview-target-2", {
          opacity: 0,
          scale: 0.7,
          duration: 0.16,
        })

        .to(".preview-target-4", {
          opacity: 1,
          scale: 1,
          duration: 0.16,
          ease: "power2.out",
        })
        .to(
          ".preview-x-1",
          {
            x: moveX1To4.x,
            y: moveX1To4.y,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "<+=0.1"
        )
        .to(".preview-target-4", {
          opacity: 0,
          scale: 0.7,
          duration: 0.16,
        })

        .to(".preview-target-0", {
          opacity: 1,
          scale: 1,
          duration: 0.16,
          ease: "power2.out",
        })
        .to(
          ".preview-o-1",
          {
            x: moveO1To0.x,
            y: moveO1To0.y,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "<+=0.1"
        )
        .to(".preview-target-0", {
          opacity: 0,
          scale: 0.7,
          duration: 0.16,
        })

        .to(".preview-target-3", {
          opacity: 1,
          scale: 1,
          duration: 0.16,
          ease: "power2.out",
        })
        .to(
          ".preview-x-1",
          {
            x: moveX1To3.x,
            y: moveX1To3.y,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "<+=0.1"
        )
        .to(".preview-target-3", {
          opacity: 0,
          scale: 0.7,
          duration: 0.16,
        })

        .to(".preview-target-7", {
          opacity: 1,
          scale: 1,
          duration: 0.16,
          ease: "power2.out",
        })
        .to(
          ".preview-o-3",
          {
            x: moveO3To7.x,
            y: moveO3To7.y,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "<+=0.1"
        )
        .to(".preview-target-7", {
          opacity: 0,
          scale: 0.7,
          duration: 0.16,
        })

        .to(".preview-target-4", {
          opacity: 1,
          scale: 1,
          duration: 0.16,
          ease: "power2.out",
        })
        .to(
          ".preview-x-2",
          {
            x: moveX2To4.x,
            y: moveX2To4.y,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "<+=0.1"
        )
        .to(".preview-target-4", {
          opacity: 0,
          scale: 0.7,
          duration: 0.16,
        })

        .to(".preview-glow", {
          opacity: 1,
          scaleX: 1,
          duration: 0.35,
          ease: "power2.out",
        })
        .to(
          ".preview-x-1, .preview-x-2, .preview-x-3",
          {
            scale: 1.12,
            duration: 0.22,
            repeat: 1,
            yoyo: true,
            stagger: 0.06,
            ease: "power2.inOut",
          },
          "<"
        )

        .to(".preview-glow", {
          opacity: 0,
          scaleX: 0,
          duration: 0.25,
          delay: 1,
        })
        .to(
          ".preview-piece",
          {
            opacity: 0,
            scale: 0.85,
            duration: 0.3,
            stagger: 0.03,
            ease: "power2.in",
          },
          "<"
        )
        .set(".preview-piece", {
          x: 0,
          y: 0,
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
      className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-start px-4 py-5 text-center sm:py-7"
    >
      <header className="menu-enter w-full">
        <h1
          className="mx-auto bg-gradient-to-r from-emerald-300 via-cyan-300 to-yellow-200 bg-clip-text text-3xl leading-[1.45] text-transparent drop-shadow-2xl sm:text-4xl md:text-5xl lg:text-6xl"
          style={{
            fontFamily: '"Press Start 2P", system-ui, sans-serif',
            textShadow: "0 0 28px rgba(52, 211, 153, 0.28)",
          }}
        >
          Fanoron-telo
        </h1>
      </header>

      <div className="menu-enter relative mt-4 w-full max-w-[210px] sm:max-w-[230px] md:mt-5 md:max-w-[250px]">
        <div className="menu-orb absolute -left-5 top-4 h-20 w-20 rounded-full bg-emerald-400/20 blur-2xl" />
        <div className="menu-orb absolute -right-5 bottom-4 h-20 w-20 rounded-full bg-cyan-400/20 blur-2xl" />

        <div className="relative rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-2.5 shadow-[0_20px_65px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-3">
          <PreviewBoard />
        </div>
      </div>

      <div className="menu-enter mt-6 w-full max-w-xl sm:mt-7">
        <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 text-left shadow-2xl backdrop-blur-xl sm:p-6">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-300">
              Mode de jeu
            </span>

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="cursor-pointer rounded-2xl border border-white/10 bg-slate-900 px-4 py-4 text-sm font-bold text-white outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10"
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
                className="cursor-pointer rounded-2xl border border-white/10 bg-slate-900 px-4 py-4 text-sm font-bold text-white outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
              >
                <option value="easy">Facile</option>
                <option value="medium">Moyen</option>
                <option value="hard">Difficile</option>
              </select>
            </label>
          )}

          <button
            type="button"
            onClick={startGame}
            className="start-pulse group relative mt-2 cursor-pointer overflow-hidden rounded-[1.75rem] border border-yellow-200/40 bg-gradient-to-r from-emerald-300 via-cyan-300 to-yellow-200 px-6 py-5 text-center text-base font-black uppercase tracking-[0.08em] text-slate-950 shadow-[0_0_45px_rgba(52,211,153,0.38)] ring-4 ring-emerald-300/10 transition hover:-translate-y-1 hover:shadow-[0_0_70px_rgba(250,204,21,0.45)] sm:text-lg"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-70 transition duration-700 group-hover:translate-x-full" />

            <span className="relative z-10 flex items-center justify-center gap-3">
              Nouvelle partie
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}