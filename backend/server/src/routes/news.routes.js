import { Router } from "express";
import { fetchLatestNews } from "../services/newsService.js";
import { storageService } from "../services/storageService.js";

const router = Router();

router.get("/", async (request, response) => {
  try {
    const scope = request.query.scope;
    let news = await storageService.listNews();

    if (!news.length) {
      await Promise.all([fetchLatestNews("india"), fetchLatestNews("world")]);
      news = await storageService.listNews();
    }

    if (scope === "india" || scope === "world") {
      news = news.filter((item) => item.category === scope);
    }

    response.json({ news });
  } catch (error) {
    response.status(500).json({ message: error.message || "Failed to fetch news." });
  }
});

router.patch("/:id/bookmark", async (request, response) => {
  try {
    const news = await storageService.toggleBookmark(request.params.id);

    if (!news) {
      return response.status(404).json({ message: "News item not found." });
    }

    return response.json({ news });
  } catch (error) {
    return response.status(500).json({ message: error.message || "Failed to update bookmark." });
  }
});

export default router;
