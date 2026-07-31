export const formatDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));

export const getVerificationBadge = (label) => {
  if (label === "TRUE") {
    return "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30";
  }

  if (label === "FAKE") {
    return "bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30";
  }

  return "bg-slate-500/15 text-slate-300 ring-1 ring-slate-400/20";
};

export const normalizeConfidence = (value) => `${Math.round(value ?? 0)}%`;
