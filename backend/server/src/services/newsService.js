import axios from "axios";
import { storageService } from "./storageService.js";
import { getIo } from "../socket.js";

const normalizeArticle = (article) => ({
  title: article.title,
  description: article.description || article.content || "",
  source: article.source?.name || article.source || "Unknown source",
  url: article.url,
  imageUrl: article.urlToImage || article.image || "",
  publishedAt: article.publishedAt || new Date().toISOString(),
  isBreaking: /breaking|live|alert/i.test(article.title || "")
});

const buildNewsApiUrl = (scope = "india") => {
  const provider = process.env.NEWS_API_PROVIDER || "newsapi";
  const apiKey = process.env.NEWS_API_KEY;
  const language = process.env.NEWS_LANGUAGE || "en";

  if (!apiKey) {
    throw new Error("NEWS_API_KEY is missing.");
  }

  if (provider === "gnews") {
    if (scope === "world") {
      return `https://gnews.io/api/v4/top-headlines?topic=world&lang=${language}&max=10&apikey=${apiKey}`;
    }

    return `https://gnews.io/api/v4/top-headlines?country=in&lang=${language}&max=10&apikey=${apiKey}`;
  }

  if (scope === "world") {
    return `https://newsapi.org/v2/top-headlines?category=general&language=${language}&pageSize=10&apiKey=${apiKey}`;
  }

  return `https://newsapi.org/v2/top-headlines?country=in&pageSize=10&apiKey=${apiKey}`;
};

export const fetchLatestNews = async (scope = "india") => {
  const url = buildNewsApiUrl(scope);
  const response = await axios.get(url, { timeout: 12000 });
  const rawArticles = response.data.articles || [];
  const normalized = rawArticles
    .filter((article) => article.title && article.url)
    .map((article) => ({
      ...normalizeArticle(article),
      category: scope
    }));

  const existing = await storageService.listNews();
  const existingUrls = new Set(
    existing.filter((item) => item.category === scope).map((item) => item.url)
  );
  const breakingNews = normalized.find((item) => !existingUrls.has(item.url));
  const storedNews = await storageService.saveNewsBatch(normalized);
  const io = getIo();

  io.emit("news:update", { news: storedNews });

  if (breakingNews) {
    io.emit("news:breaking", breakingNews);
  }

  return storedNews;
};
