export default function RuleCard({ number, title, text }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
      <div className="mb-2 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-400/10 text-xs font-black text-emerald-300">
          {number}
        </span>

        <h3 className="font-black text-white">{title}</h3>
      </div>

      <p className="text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}