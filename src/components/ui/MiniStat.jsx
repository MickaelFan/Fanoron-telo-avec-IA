export default function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-emerald-200">{value}</p>
    </div>
  );
}