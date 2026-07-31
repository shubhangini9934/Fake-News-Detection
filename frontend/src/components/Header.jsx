import { ShieldCheck, Zap } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Header = ({ theme, onToggleTheme, articleCount }) => (
  <header className="glass-panel overflow-hidden p-6 md:p-8">
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div className="max-w-2xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 ring-1 ring-cyan-400/20">
          <Zap size={16} />
          Real-time verification dashboard
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl">
          Smart News Verifier
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
          Stream the latest headlines, verify suspicious claims with AI, and track trust trends
          from one modern command center.
        </p>
      </div>

      <div className="flex flex-col items-start gap-4 md:items-end">
        <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm text-slate-200 ring-1 ring-white/10">
          <ShieldCheck size={18} className="text-emerald-300" />
          <span>{articleCount} live headlines in watchlist</span>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </div>
  </header>
);

export default Header;
