import mongoose from "mongoose";
import { News } from "../models/News.js";
import { Verification } from "../models/Verification.js";

const memoryStore = {
  news: [],
  history: []
};

const isMongoReady = () => mongoose.connection.readyState === 1;

const createMemoryId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export const storageService = {
  async saveNewsBatch(newsItems) {
    if (isMongoReady()) {
      const operations = newsItems.map((item) => ({
        updateOne: {
          filter: { url: item.url },
          update: { $set: item },
          upsert: true
        }
      }));

      if (operations.length) {
        await News.bulkWrite(operations);
      }

      return News.find().sort({ publishedAt: -1 }).limit(20).lean();
    }

    const merged = [...memoryStore.news];

    newsItems.forEach((item) => {
      const existingIndex = merged.findIndex((entry) => entry.url === item.url);
      if (existingIndex >= 0) {
        merged[existingIndex] = { ...merged[existingIndex], ...item };
      } else {
        merged.unshift({ ...item, _id: createMemoryId() });
      }
    });

    memoryStore.news = merged
      .sort((left, right) => new Date(right.publishedAt) - new Date(left.publishedAt))
      .slice(0, 20);

    return memoryStore.news;
  },

  async listNews() {
    if (isMongoReady()) {
      return News.find().sort({ publishedAt: -1 }).limit(20).lean();
    }

    return memoryStore.news;
  },

  async toggleBookmark(id) {
    if (isMongoReady()) {
      const news = await News.findById(id);

      if (!news) {
        return null;
      }

      news.bookmarked = !news.bookmarked;
      await news.save();
      return news.toObject();
    }

    const item = memoryStore.news.find((entry) => entry._id === id);

    if (!item) {
      return null;
    }

    item.bookmarked = !item.bookmarked;
    return item;
  },

  async applyVerification(articleId, url, verification) {
    if (isMongoReady() && articleId) {
      const news = await News.findById(articleId);
      if (news) {
        news.verification = verification;
        await news.save();
        return news.toObject();
      }
    }

    const item = memoryStore.news.find(
      (entry) => entry._id === articleId || (url && entry.url === url)
    );

    if (item) {
      item.verification = verification;
      return item;
    }

    return null;
  },

  async saveVerification(payload) {
    if (isMongoReady()) {
      const record = await Verification.create(payload);
      return record.toObject();
    }

    const record = {
      ...payload,
      _id: createMemoryId(),
      createdAt: new Date().toISOString()
    };
    memoryStore.history.unshift(record);
    memoryStore.history = memoryStore.history.slice(0, 50);
    return record;
  },

  async listHistory() {
    if (isMongoReady()) {
      return Verification.find().sort({ createdAt: -1 }).limit(30).lean();
    }

    return memoryStore.history;
  }
};
