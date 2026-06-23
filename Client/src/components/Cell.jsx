export default function Cell({ value, isSelected, onClick }) {
  return (
    <button
      className={`cell ${value ? "has-piece" : ""} ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      {value && <span className={`piece piece-${value}`}>{value}</span>}
    </button>
  );
}