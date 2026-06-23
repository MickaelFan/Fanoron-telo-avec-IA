import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { POSITIONS } from "../../constants/gameConstants";

gsap.registerPlugin(useGSAP);

export default function GameBoard({ board, selectedCell, lastMove, onCellClick }) {
  const boardRef = useRef(null);
  const pieceRefs = useRef({});

  useGSAP(
    () => {
      if (!lastMove?.pieceId) return;

      const pieceElement = pieceRefs.current[lastMove.pieceId];
      const boardElement = boardRef.current;

      if (!pieceElement || !boardElement) return;

      if (lastMove.from === null) {
        gsap.fromTo(
          pieceElement,
          {
            scale: 0,
            opacity: 0,
            rotate: -25,
          },
          {
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 0.38,
            ease: "back.out(1.8)",
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
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.52,
          ease: "power3.out",
          clearProps: "x,y,scale",
        }
      );
    },
    {
      scope: boardRef,
      dependencies: [lastMove?.serial],
    }
  );

  return (
    <div
      ref={boardRef}
      className="relative aspect-square w-full max-w-[560px] rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 shadow-[0_0_90px_rgba(16,185,129,0.14)]"
    >
      <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.16),transparent_58%)]" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
        <line x1="8" y1="8" x2="92" y2="8" className="stroke-emerald-300/70" strokeWidth="1.6" />
        <line x1="8" y1="50" x2="92" y2="50" className="stroke-emerald-300/70" strokeWidth="1.6" />
        <line x1="8" y1="92" x2="92" y2="92" className="stroke-emerald-300/70" strokeWidth="1.6" />
        <line x1="8" y1="8" x2="8" y2="92" className="stroke-emerald-300/70" strokeWidth="1.6" />
        <line x1="50" y1="8" x2="50" y2="92" className="stroke-emerald-300/70" strokeWidth="1.6" />
        <line x1="92" y1="8" x2="92" y2="92" className="stroke-emerald-300/70" strokeWidth="1.6" />
        <line x1="8" y1="8" x2="92" y2="92" className="stroke-cyan-300/45" strokeWidth="1.4" />
        <line x1="92" y1="8" x2="8" y2="92" className="stroke-cyan-300/45" strokeWidth="1.4" />
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
            onClick={() => onCellClick(index)}
            className={[
              "grid h-16 w-16 place-items-center rounded-full border transition duration-200 sm:h-20 sm:w-20",
              board[index]
                ? "pointer-events-none opacity-0"
                : "border-emerald-300/30 bg-slate-950/70 hover:scale-110 hover:border-emerald-200 hover:bg-emerald-300/10",
              selectedCell === index
                ? "ring-4 ring-yellow-300/30"
                : "",
            ].join(" ")}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-300/50" />
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
              onClick={() => onCellClick(index)}
              className={[
                "grid h-14 w-14 place-items-center rounded-full text-xl font-black shadow-2xl transition hover:scale-110 sm:h-16 sm:w-16 sm:text-2xl",
                piece.player === "X"
                  ? "bg-gradient-to-br from-emerald-300 to-green-600 text-slate-950 shadow-emerald-400/30"
                  : "bg-gradient-to-br from-cyan-300 to-blue-700 text-white shadow-cyan-400/30",
                selectedCell === index
                  ? "ring-4 ring-yellow-300/60"
                  : "ring-1 ring-white/10",
              ].join(" ")}
            >
              {piece.player}
            </button>
          </div>
        );
      })}
    </div>
  );
}