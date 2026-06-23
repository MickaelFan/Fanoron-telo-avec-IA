import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { POSITIONS } from "../../constants/gameConstants";

gsap.registerPlugin(useGSAP);

export default function GameBoard({
  board,
  selectedCell,
  lastMove,
  onCellClick,
  disabled = false,
}) {
  const boardRef = useRef(null);
  const pieceRefs = useRef({});

  useGSAP(
    () => {
      if (!lastMove?.pieceId) return;

      const pieceElement = pieceRefs.current[lastMove.pieceId];
      const boardElement = boardRef.current;

      if (!pieceElement || !boardElement) return;

      gsap.killTweensOf(pieceElement);

      if (lastMove.from === null) {
        gsap.fromTo(
          pieceElement,
          {
            scale: 0,
            opacity: 0,
            rotate: -18,
          },
          {
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 0.42,
            ease: "back.out(1.9)",
            clearProps: "scale,opacity,rotate",
          }
        );

        return;
      }

      const rect = boardElement.getBoundingClientRect();
      const from = POSITIONS[lastMove.from];
      const to = POSITIONS[lastMove.to];

      const deltaX = ((from.left - to.left) / 100) * rect.width;
      const deltaY = ((from.top - to.top) / 100) * rect.height;

      gsap.fromTo(
        pieceElement,
        {
          x: deltaX,
          y: deltaY,
          scale: 1.08,
          zIndex: 80,
          boxShadow: "0 0 42px rgba(250,204,21,0.45)",
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          zIndex: 20,
          boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
          duration: 0.82,
          ease: "power2.inOut",
          clearProps: "x,y,scale,zIndex,boxShadow",
        }
      );
    },
    {
      scope: boardRef,
      dependencies: [lastMove?.serial],
    }
  );

  function handleClick(index) {
    if (disabled) return;
    onCellClick(index);
  }

  return (
    <div
      ref={boardRef}
      className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-[2rem] border-2 border-emerald-300/25 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 shadow-[0_0_80px_rgba(16,185,129,0.16)]"
    >
      <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.18),transparent_58%)]" />
      <div className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_35%,rgba(34,211,238,0.06))]" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
        <line x1="8" y1="8" x2="92" y2="8" className="stroke-emerald-300/75" strokeWidth="1.65" />
        <line x1="8" y1="50" x2="92" y2="50" className="stroke-emerald-300/75" strokeWidth="1.65" />
        <line x1="8" y1="92" x2="92" y2="92" className="stroke-emerald-300/75" strokeWidth="1.65" />

        <line x1="8" y1="8" x2="8" y2="92" className="stroke-emerald-300/75" strokeWidth="1.65" />
        <line x1="50" y1="8" x2="50" y2="92" className="stroke-emerald-300/75" strokeWidth="1.65" />
        <line x1="92" y1="8" x2="92" y2="92" className="stroke-emerald-300/75" strokeWidth="1.65" />

        <line x1="8" y1="8" x2="92" y2="92" className="stroke-cyan-300/50" strokeWidth="1.4" />
        <line x1="92" y1="8" x2="8" y2="92" className="stroke-cyan-300/50" strokeWidth="1.4" />
      </svg>

      {POSITIONS.map((pos, index) => (
        <div
          key={`cell-${index}`}
          style={{
            left: `${pos.left}%`,
            top: `${pos.top}%`,
          }}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
        >
          <button
            type="button"
            onClick={() => handleClick(index)}
            disabled={disabled}
            className={[
              "grid h-12 w-12 place-items-center rounded-full border transition duration-200 sm:h-14 sm:w-14 md:h-16 md:w-16",
              board[index]
                ? "pointer-events-none opacity-0"
                : disabled
                ? "cursor-not-allowed border-white/10 bg-slate-950/50 opacity-50"
                : "cursor-pointer border-emerald-300/35 bg-slate-950/70 hover:scale-110 hover:border-emerald-200 hover:bg-emerald-300/10",
              selectedCell === index ? "ring-4 ring-yellow-300/30" : "",
            ].join(" ")}
            aria-label={`Intersection ${index + 1}`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-300/60" />
          </button>
        </div>
      ))}

      {board.map((piece, index) => {
        if (!piece) return null;

        const pos = POSITIONS[index];

        return (
          <div
            key={piece.id}
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
            }}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
          >
            <button
              ref={(el) => {
                pieceRefs.current[piece.id] = el;
              }}
              type="button"
              onClick={() => handleClick(index)}
              disabled={disabled}
              className={[
                "grid h-11 w-11 place-items-center rounded-full text-lg font-black shadow-2xl will-change-transform sm:h-13 sm:w-13 sm:text-xl md:h-15 md:w-15",
                disabled
                  ? "cursor-not-allowed"
                  : "cursor-pointer hover:scale-105",
                piece.player === "X"
                  ? "bg-gradient-to-br from-emerald-300 to-green-600 text-slate-950 shadow-emerald-400/30"
                  : "bg-gradient-to-br from-cyan-300 to-blue-700 text-white shadow-cyan-400/30",
                selectedCell === index
                  ? "ring-4 ring-yellow-300/70"
                  : "ring-1 ring-white/10",
              ].join(" ")}
              aria-label={`Pion ${piece.player}`}
            >
              {piece.player}
            </button>
          </div>
        );
      })}
    </div>
  );
}