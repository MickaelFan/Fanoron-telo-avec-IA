export default function InfoLine({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
      <span className="text-sm font-bold text-slate-400">{label}</span>
      <strong className="text-sm font-black text-emerald-200 capitalize">
        {value}
      </strong>
    </div>
  );
}