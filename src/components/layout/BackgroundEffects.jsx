export default function BackgroundEffects() {
  return (
    <div className="pointer-events-none fixed inset-0">
      <div className="absolute left-[-8rem] top-[-8rem] h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute right-[-8rem] top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-[-10rem] left-1/3 h-[28rem] w-[28rem] rounded-full bg-yellow-400/10 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:42px_42px]" />
    </div>
  );
}