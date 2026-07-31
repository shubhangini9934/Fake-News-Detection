const Loader = ({ label = "Loading..." }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
    <div className="h-3 w-3 animate-pulse rounded-full bg-cyan-400" />
    <span>{label}</span>
  </div>
);

export default Loader;
