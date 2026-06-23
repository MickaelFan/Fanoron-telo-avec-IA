import { POSITIONS } from "../../constants/gameConstants";

export default function PreviewPiece({ player, index, className = "" }) {
  const pos = POSITIONS[index];

  return (
    <div
      style={{
        left: `${pos.left}%`,
        top: `${pos.top}%`,
      }}
      className={`absolute z-10 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-xl font-black shadow-2xl sm:h-16 sm:w-16 ${className} ${
        player === "X"
          ? "bg-gradient-to-br from-emerald-300 to-green-600 text-slate-950 shadow-emerald-400/30"
          : "bg-gradient-to-br from-cyan-300 to-blue-700 text-white shadow-cyan-400/30"
      }`}
    >
      {player}
    </div>
  );
}