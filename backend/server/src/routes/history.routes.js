import { Router } from "express";
import { storageService } from "../services/storageService.js";

const router = Router();

router.get("/", async (_request, response) => {
  try {
    const history = await storageService.listHistory();
    response.json({ history });
  } catch (error) {
    response.status(500).json({ message: error.message || "Failed to load history." });
  }
});

export default router;
