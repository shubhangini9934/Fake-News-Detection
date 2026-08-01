import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { BookmarkCheck, CircleAlert, Filter } from "lucide-react";
import AccuracyChart from "./components/AccuracyChart";
import BreakingNewsPopup from "./components/BreakingNewsPopup";
import Header from "./components/Header";
import Loader from "./components/Loader";
import NewsCard from "./components/NewsCard";
import NewsTicker from "./components/NewsTicker";
import SearchVerify from "./components/SearchVerify";
import { useSocket } from "./hooks/useSocket";

// const API_URL = import.meta.env.VITE_API_URL || "https://your-backend.onrender.com";
const API_URL = "https://fake-news-detection-4r5a.onrender.com";

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [articles, setArticles] = useState([]);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [customText, setCustomText] = useState("");
  const [customVerification, setCustomVerification] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [verifyLoadingId, setVerifyLoadingId] = useState(null);
  const [customLoading, setCustomLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [newsResponse, historyResponse] = await Promise.all([
        axios.get(`${API_URL}/news`),
        axios.get(`${API_URL}/history`)
      ]);

      setArticles(newsResponse.data.news || []);
      setHistory(historyResponse.data.history || []);
      setError("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load the dashboard. Please check the backend service."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useSocket({
    onNewsUpdate: (payload) => {
      setArticles(payload.news || []);
    },
    onBreakingNews: (article) => {
      const id = `${article.title}-${Date.now()}`;
      const popupArticle = { ...article, id };
      setAlerts([popupArticle]);
      setArticles((current) => {
        const alreadyIncluded = current.some((item) => item.url === article.url);
        return alreadyIncluded ? current : [article, ...current].slice(0, 20);
      });

      requestVerification(article)
        .then((verification) => {
          applyVerificationToUi(article, verification);
        })
        .catch(() => {
          // Keep the popup visible even if verification is temporarily unavailable.
        });

      window.setTimeout(() => {
        setAlerts((current) => current.filter((item) => item.id !== id));
      }, 7000);
    },
    onVerificationCreated: (record) => {
      setHistory((current) => [record, ...current].slice(0, 30));
      setArticles((current) =>
        current.map((article) =>
          article._id === record.newsId || article.url === record.url
            ? {
                ...article,
                verification: {
                  label: record.label,
                  confidence: record.confidence
                }
              }
            : article
        )
      );
    }
  });

  const dismissAlert = (id) => {
    setAlerts((current) => current.filter((item) => item.id !== id));
  };

  const requestVerification = async (article) => {
    const response = await axios.post(`${API_URL}/verify`, {
      text: `${article.title}. ${article.description || ""}`,
      articleId: article._id,
      source: article.source,
      title: article.title,
      url: article.url
    });

    return response.data.result;
  };

  const applyVerificationToUi = (article, verification) => {
    setArticles((current) =>
      current.map((item) =>
        item._id === article._id || item.url === article.url
          ? { ...item, verification }
          : item
      )
    );
    setAlerts((current) =>
      current.map((item) =>
        item.url === article.url
          ? { ...item, verification }
          : item
      )
    );
  };

  const verifyArticle = async (article) => {
    try {
      setVerifyLoadingId(article._id || article.url);
      const verification = await requestVerification(article);
      applyVerificationToUi(article, verification);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Verification failed.");
    } finally {
      setVerifyLoadingId(null);
    }
  };

  const verifyCustomText = async () => {
    if (!customText.trim()) {
      setError("Enter some text before running a custom verification.");
      return;
    }

    try {
      setCustomLoading(true);
      const response = await axios.post(`${API_URL}/verify`, {
        text: customText,
        source: "Custom Search",
        title: customText.slice(0, 90)
      });

      setCustomVerification(response.data.result);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Custom verification failed.");
    } finally {
      setCustomLoading(false);
    }
  };

  const toggleBookmark = async (article) => {
    try {
      const response = await axios.patch(`${API_URL}/news/${article._id}/bookmark`);
      const updated = response.data.news;
      setArticles((current) =>
        current.map((item) => (item._id === updated._id ? updated : item))
      );
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update bookmark.");
    }
  };

  const filteredArticles = useMemo(() => {
    if (activeFilter === "BOOKMARKED") {
      return articles.filter((article) => article.bookmarked);
    }

    if (activeFilter === "TRUE" || activeFilter === "FAKE") {
      return articles.filter((article) => article.verification?.label === activeFilter);
    }

    return articles;
  }, [activeFilter, articles]);

  const indiaArticles = useMemo(
    () => filteredArticles.filter((article) => article.category === "india"),
    [filteredArticles]
  );

  const worldArticles = useMemo(
    () => filteredArticles.filter((article) => article.category === "world"),
    [filteredArticles]
  );

  const stats = useMemo(
    () =>
      history.reduce(
        (accumulator, item) => {
          accumulator[item.label] = (accumulator[item.label] || 0) + 1;
          return accumulator;
        },
        { TRUE: 0, FAKE: 0 }
      ),
    [history]
  );

  return (
    <div className="min-h-screen px-4 py-6 md:px-8">
      <BreakingNewsPopup alerts={alerts} onDismiss={dismissAlert} />

      <main className="mx-auto flex max-w-7xl flex-col gap-6">
        <Header
          theme={theme}
          onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
          articleCount={articles.length}
        />

        <NewsTicker headlines={articles.slice(0, 10)} />

        {error ? (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            <CircleAlert size={18} />
            <span>{error}</span>
          </div>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              {["ALL", "TRUE", "FAKE", "BOOKMARKED"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeFilter === filter
                      ? "bg-cyan-500 text-slate-950"
                      : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                  }`}
                >
                  {filter === "BOOKMARKED" ? (
                    <span className="inline-flex items-center gap-2">
                      <BookmarkCheck size={16} />
                      Saved
                    </span>
                  ) : (
                    filter
                  )}
                </button>
              ))}

              <div className="ml-auto inline-flex items-center gap-2 text-sm text-slate-400">
                <Filter size={16} />
                {filteredArticles.length} cards shown
              </div>
            </div>

            {loading ? <Loader label="Loading live headlines..." /> : null}

            {!loading ? (
              <section className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-semibold text-white">Indian News</h2>
                  <div className="grid gap-5 md:grid-cols-2">
                    {indiaArticles.map((article, index) => (
                      <motion.div
                        key={article._id || article.url}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                      >
                        <NewsCard
                          article={article}
                          onVerify={verifyArticle}
                          onBookmark={toggleBookmark}
                          isVerifying={verifyLoadingId === (article._id || article.url)}
                        />
                      </motion.div>
                    ))}
                  </div>
                  {!indiaArticles.length ? (
                    <p className="mt-3 text-sm text-slate-400">No Indian news available.</p>
                  ) : null}
                </div>

                <div>
                  <h2 className="mb-4 text-xl font-semibold text-white">World News</h2>
                  <div className="grid gap-5 md:grid-cols-2">
                    {worldArticles.map((article, index) => (
                      <motion.div
                        key={article._id || article.url}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                      >
                        <NewsCard
                          article={article}
                          onVerify={verifyArticle}
                          onBookmark={toggleBookmark}
                          isVerifying={verifyLoadingId === (article._id || article.url)}
                        />
                      </motion.div>
                    ))}
                  </div>
                  {!worldArticles.length ? (
                    <p className="mt-3 text-sm text-slate-400">No world news available.</p>
                  ) : null}
                </div>
              </section>
            ) : null}
          </div>

          <div className="space-y-6">
            <SearchVerify
              value={customText}
              onChange={setCustomText}
              onSubmit={verifyCustomText}
              verification={customVerification}
              loading={customLoading}
            />

            <AccuracyChart stats={stats} />

            <section className="glass-panel p-5">
              <h2 className="text-lg font-semibold text-white">Verification history</h2>
              <div className="mt-4 space-y-3">
                {history.length ? (
                  history.slice(0, 6).map((item) => (
                    <div
                      key={item._id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="line-clamp-2 text-sm font-medium text-slate-100">{item.title}</p>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                          {item.label}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-400">{item.source}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">
                    Verification records will appear here after the first check.
                  </p>
                )}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
