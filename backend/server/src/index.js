import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { connectDb } from "./config/db.js";
import newsRoutes from "./routes/news.routes.js";
import verifyRoutes from "./routes/verify.routes.js";
import historyRoutes from "./routes/history.routes.js";
import { initializeSocket } from "./socket.js";
import { fetchLatestNews } from "./services/newsService.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH"]
  }
});

initializeSocket(io);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);
app.use(express.json());

app.get("/", (_request, response) => {
  response.json({ message: "Smart News Verifier backend is running." });
});

app.use("/news", newsRoutes);
app.use("/verify", verifyRoutes);
app.use("/history", historyRoutes);

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
});

const start = async () => {
  await connectDb();

  try {
    await Promise.all([fetchLatestNews("india"), fetchLatestNews("world")]);
  } catch (error) {
    console.warn("Initial news fetch failed:", error.message);
  }

  const pollInterval = Number(process.env.POLL_INTERVAL_MS || 30000);
  setInterval(async () => {
    try {
      await Promise.all([fetchLatestNews("india"), fetchLatestNews("world")]);
    } catch (error) {
      console.warn("Scheduled news fetch failed:", error.message);
    }
  }, pollInterval);

  const port = Number(process.env.PORT || 4000);
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

start();
