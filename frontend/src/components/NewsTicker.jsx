const NewsTicker = ({ headlines }) => {
  const items = headlines.length ? [...headlines, ...headlines] : [];

  return (
    <section className="glass-panel overflow-hidden py-3">
      <div className="flex items-center gap-4 border-b border-white/10 px-4 pb-3">
        <span className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
          Live ticker
        </span>
        <div className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
      </div>

      <div className="overflow-hidden pt-3">
        <div className="flex min-w-max gap-8 whitespace-nowrap px-4 animate-marquee">
          {items.map((item, index) => (
            <button
              key={`${item._id || item.title}-${index}`}
              type="button"
              onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
              className="text-sm text-slate-200 transition hover:text-white"
            >
              <span className="mr-2 font-semibold text-cyan-300">{item.source}</span>
              {item.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsTicker;
