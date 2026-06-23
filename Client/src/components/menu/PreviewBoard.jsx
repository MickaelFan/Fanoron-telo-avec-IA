import PreviewPiece from "./PreviewPiece";

export default function PreviewBoard() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px] rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 shadow-[0_0_80px_rgba(16,185,129,0.12)]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
        <line x1="8" y1="8" x2="92" y2="8" className="stroke-emerald-300/60" strokeWidth="1.4" />
        <line x1="8" y1="50" x2="92" y2="50" className="stroke-emerald-300/60" strokeWidth="1.4" />
        <line x1="8" y1="92" x2="92" y2="92" className="stroke-emerald-300/60" strokeWidth="1.4" />
        <line x1="8" y1="8" x2="8" y2="92" className="stroke-emerald-300/60" strokeWidth="1.4" />
        <line x1="50" y1="8" x2="50" y2="92" className="stroke-emerald-300/60" strokeWidth="1.4" />
        <line x1="92" y1="8" x2="92" y2="92" className="stroke-emerald-300/60" strokeWidth="1.4" />
        <line x1="8" y1="8" x2="92" y2="92" className="stroke-cyan-300/40" strokeWidth="1.2" />
        <line x1="92" y1="8" x2="8" y2="92" className="stroke-cyan-300/40" strokeWidth="1.2" />
      </svg>

      <div className="preview-glow absolute left-[8%] top-[50%] h-3 w-[84%] -translate-y-1/2 rounded-full bg-yellow-300/80 opacity-0 blur-sm" />

      <PreviewPiece className="preview-piece" player="X" index={3} />
      <PreviewPiece className="preview-piece preview-runner" player="X" index={4} />
      <PreviewPiece className="preview-piece" player="X" index={5} />

      <PreviewPiece className="preview-piece" player="O" index={0} />
      <PreviewPiece className="preview-piece" player="O" index={8} />
    </div>
  );
}