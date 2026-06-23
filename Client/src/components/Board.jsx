import Cell from "./Cell";

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

export default function Board({ board, selectedCell, onCellClick }) {
  return (
    <div className="board-wrapper">
      <svg className="board-lines" viewBox="0 0 100 100">
        {/* Carré extérieur */}
        <line x1="8" y1="8" x2="92" y2="8" />
        <line x1="8" y1="50" x2="92" y2="50" />
        <line x1="8" y1="92" x2="92" y2="92" />

        <line x1="8" y1="8" x2="8" y2="92" />
        <line x1="50" y1="8" x2="50" y2="92" />
        <line x1="92" y1="8" x2="92" y2="92" />

        {/* Diagonales */}
        <line x1="8" y1="8" x2="92" y2="92" />
        <line x1="92" y1="8" x2="8" y2="92" />
      </svg>

      {board.map((value, index) => (
        <div
          key={index}
          className="cell-position"
          style={{
            left: POSITIONS[index].left,
            top: POSITIONS[index].top,
          }}
        >
          <Cell
            value={value}
            isSelected={selectedCell === index}
            onClick={() => onCellClick(index)}
          />
        </div>
      ))}
    </div>
  );
}