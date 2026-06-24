import { POSITIONS } from "../../constants/gameConstants";

export default function PreviewPiece({ player, index, className = "" }) {
  const pos = POSITIONS[index];

  return (
    <div
      style={{
        left: `${pos.left}%`,
        top: `${pos.top}%`,
      }}
      className={`absolute z-10 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-xs font-black shadow-xl sm:h-9 sm:w-9 sm:text-sm md:h-10 md:w-10 md:text-sm ${className} ${
        player === "X"
          ? "bg-gradient-to-br from-emerald-300 to-green-600 text-slate-950 shadow-emerald-400/30"
          : "bg-gradient-to-br from-cyan-300 to-blue-700 text-white shadow-cyan-400/30"
      }`}
    >
      {player}
    </div>
  );
}