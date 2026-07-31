import { AnimatePresence, motion } from "framer-motion";
import { BellRing, ExternalLink } from "lucide-react";
import { formatDate, getVerificationBadge, normalizeConfidence } from "../lib/utils";

const BreakingNewsPopup = ({ alerts, onDismiss }) => (
  <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
    <AnimatePresence>
      {alerts.map((alert) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, x: 40, y: -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="pointer-events-auto rounded-2xl border border-orange-400/20 bg-slate-900/95 p-4 shadow-2xl ring-1 ring-orange-500/20 backdrop-blur"
        >
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-full bg-orange-500/15 p-2 text-orange-300">
              <BellRing size={16} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
                Breaking news
              </p>
              <button
                type="button"
                onClick={() => window.open(alert.url, "_blank", "noopener,noreferrer")}
                className="mt-1 text-left text-sm font-semibold text-white hover:underline"
              >
                {alert.title}
              </button>
              <p className="mt-1 text-xs text-slate-300">{alert.source}</p>
              <p className="mt-1 text-xs text-slate-400">{formatDate(alert.publishedAt)}</p>

              {alert.verification ? (
                <div className="mt-3 flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getVerificationBadge(alert.verification.label)}`}
                  >
                    {alert.verification.label}
                  </span>
                  <span className="text-xs text-slate-300">
                    {normalizeConfidence(alert.verification.confidence)}
                  </span>
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-400">Checking if this breaking news is true...</p>
              )}

              {alert.verification?.label === "TRUE" ? (
                <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs text-slate-200">
                  <p className="font-semibold text-emerald-300">Verified true</p>
                  <p className="mt-1">
                    {alert.description || "This article appears consistent with reliable reporting patterns."}
                  </p>
                </div>
              ) : null}

              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => window.open(alert.url, "_blank", "noopener,noreferrer")}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-300 hover:text-cyan-200"
                >
                  <ExternalLink size={14} />
                  Open complete article
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(alert.id)}
              className="text-xs text-slate-400 transition hover:text-white"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

export default BreakingNewsPopup;
