import { Search, Sparkles } from "lucide-react";
import Loader from "./Loader";

const SearchVerify = ({
  value,
  onChange,
  onSubmit,
  verification,
  loading
}) => (
  <section className="glass-panel p-5">
    <div className="mb-4 flex items-center gap-3">
      <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
        <Sparkles size={18} />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-white">Custom verification</h2>
        <p className="text-sm text-slate-400">Paste any headline or claim for instant AI scoring.</p>
      </div>
    </div>

    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search or paste a suspicious headline"
          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-cyan-400/60"
        />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
      >
        Verify custom text
      </button>
    </div>

    <div className="mt-4">
      {loading ? (
        <Loader label="Verifying text with the NLP model..." />
      ) : verification ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Latest result</p>
          <p className="mt-2 text-2xl font-bold text-white">{verification.label}</p>
          <p className="mt-1 text-sm text-slate-300">
            Confidence score: <span className="font-semibold">{verification.confidence}%</span>
          </p>
        </div>
      ) : (
        <p className="text-sm text-slate-400">No custom verification yet.</p>
      )}
    </div>
  </section>
);

export default SearchVerify;
