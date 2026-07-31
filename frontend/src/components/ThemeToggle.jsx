import { Moon, SunMedium } from "lucide-react";

const ThemeToggle = ({ theme, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:scale-[1.02] hover:bg-white/15 dark:text-slate-100"
  >
    {theme === "dark" ? <SunMedium size={16} /> : <Moon size={16} />}
    {theme === "dark" ? "Light mode" : "Dark mode"}
  </button>
);

export default ThemeToggle;
