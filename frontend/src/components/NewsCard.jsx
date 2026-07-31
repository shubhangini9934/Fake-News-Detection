import { Bookmark, BookmarkCheck, Clock3, ShieldAlert } from "lucide-react";
import { formatDate, getVerificationBadge, normalizeConfidence } from "../lib/utils";

const NewsCard = ({ article, onVerify, onBookmark, isVerifying }) => (
  <article className="glass-panel flex h-full flex-col justify-between p-5 transition hover:-translate-y-1">
    <div>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{article.source}</p>
          <button
            type="button"
            onClick={() => window.open(article.url, "_blank", "noopener,noreferrer")}
            className="mt-2 text-left text-lg font-semibold text-white transition hover:text-cyan-300"
          >
            {article.title}
          </button>
        </div>
        <button
          type="button"
          onClick={() => onBookmark(article)}
          className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:bg-white/10"
          aria-label="Toggle bookmark"
        >
          {article.bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2 text-xs text-slate-400">
        <Clock3 size={14} />
        <span>{formatDate(article.publishedAt)}</span>
      </div>

      <p className="line-clamp-3 text-sm leading-6 text-slate-300">
        {article.description || "No description was provided by the news source."}
      </p>
    </div>

    <div className="mt-5 space-y-3">
      {article.verification ? (
        <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getVerificationBadge(article.verification.label)}`}
          >
            {article.verification.label}
          </span>
          <span className="text-xs text-slate-300">
            {normalizeConfidence(article.verification.confidence)}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-2xl border border-dashed border-white/10 px-3 py-2 text-xs text-slate-500">
          <ShieldAlert size={14} />
          Unverified headline
        </div>
      )}

      <button
        type="button"
        onClick={() => onVerify(article)}
        disabled={isVerifying}
        className="w-full rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isVerifying ? "Verifying..." : "Verify"}
      </button>
    </div>
  </article>
);

export default NewsCard;
