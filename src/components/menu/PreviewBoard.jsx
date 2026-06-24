import PreviewPiece from "./PreviewPiece";

export default function PreviewBoard() {
  return (
    <div className="preview-board relative mx-auto aspect-square w-full max-w-[250px] overflow-hidden rounded-[1.4rem] border border-emerald-400/20 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 shadow-[0_0_45px_rgba(16,185,129,0.12)]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
        <line x1="8" y1="8" x2="92" y2="8" className="stroke-emerald-300/60" strokeWidth="1.25" />
        <line x1="8" y1="50" x2="92" y2="50" className="stroke-emerald-300/60" strokeWidth="1.25" />
        <line x1="8" y1="92" x2="92" y2="92" className="stroke-emerald-300/60" strokeWidth="1.25" />

        <line x1="8" y1="8" x2="8" y2="92" className="stroke-emerald-300/60" strokeWidth="1.25" />
        <line x1="50" y1="8" x2="50" y2="92" className="stroke-emerald-300/60" strokeWidth="1.25" />
        <line x1="92" y1="8" x2="92" y2="92" className="stroke-emerald-300/60" strokeWidth="1.25" />

        <line x1="8" y1="8" x2="92" y2="92" className="stroke-cyan-300/40" strokeWidth="1.1" />
        <line x1="92" y1="8" x2="8" y2="92" className="stroke-cyan-300/40" strokeWidth="1.1" />
      </svg>

      <div className="preview-target preview-target-0 absolute left-[8%] top-[8%] z-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/60 bg-cyan-300/10 opacity-0 sm:h-9 sm:w-9" />
      <div className="preview-target preview-target-2 absolute left-[92%] top-[8%] z-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/60 bg-cyan-300/10 opacity-0 sm:h-9 sm:w-9" />
      <div className="preview-target preview-target-3 absolute left-[8%] top-[50%] z-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-300/60 bg-yellow-300/10 opacity-0 sm:h-9 sm:w-9" />
      <div className="preview-target preview-target-4 absolute left-[50%] top-[50%] z-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-300/60 bg-yellow-300/10 opacity-0 sm:h-9 sm:w-9" />
      <div className="preview-target preview-target-5 absolute left-[92%] top-[50%] z-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-300/60 bg-yellow-300/10 opacity-0 sm:h-9 sm:w-9" />
      <div className="preview-target preview-target-7 absolute left-[50%] top-[92%] z-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/60 bg-cyan-300/10 opacity-0 sm:h-9 sm:w-9" />

      <div className="preview-glow absolute left-[8%] top-[50%] h-1.5 w-[84%] origin-left -translate-y-1/2 scale-x-0 rounded-full bg-yellow-300/80 opacity-0 blur-sm" />

      <PreviewPiece className="preview-piece preview-x-1" player="X" index={0} />
      <PreviewPiece className="preview-piece preview-x-2" player="X" index={1} />
      <PreviewPiece className="preview-piece preview-x-3" player="X" index={2} />

      <PreviewPiece className="preview-piece preview-o-1" player="O" index={3} />
      <PreviewPiece className="preview-piece preview-o-2" player="O" index={4} />
      <PreviewPiece className="preview-piece preview-o-3" player="O" index={6} />
    </div>
  );
}