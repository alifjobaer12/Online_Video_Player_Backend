import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

/* 🔐 TRUST PROXY (required for real IP on Vercel) */
app.set("trust proxy", true);

/* ✅ CORS */
app.use(
  cors({
    origin: true,
    methods: ["GET", "OPTIONS"],
  })
);

/* 🧾 LOG EVERY REQUEST + IP */
app.use((req, res, next) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  console.log("📡 Client IP:", ip);
  console.log("➡️", req.method, req.originalUrl);

  next();
});

/* FIX __dirname FOR ES MODULE */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* LOAD RAW DATA FROM JSON FILE */
const dataPath = path.join(__dirname, "data", "Spring_Fever.json");
const rawData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

/* PARSE + SORT EPISODES */
const parseEpisodes = () => {
  return Object.values(rawData.info)
    .map(item => {
      const match = item.name.match(/E(\d+)/i);
      const epNum = match ? Number(match[1]) : 0;

      return {
        title: `Episode ${String(epNum).padStart(2, "0")} - ${item.name}`,
        ep: epNum,
        servers: {
          streamwish: item.streamwish_res || null,
          streamtape: item.streamtape_res || null
        }
      };
    })
    .filter(ep => ep.ep > 0)
    .sort((a, b) => a.ep - b.ep);
};

/* API */
app.get("/api/episodes", (req, res) => {
  console.log("📡 API hit from IP:", req.ip);

  const episodes = parseEpisodes();

  res.json({
    series: rawData.series || "Unknown Series",
    total: episodes.length,
    episodes
  });

  console.log("✅ API call successful.");
});

app.listen(5000, () => {
  console.log("✅ API running at http://localhost:5000/api/episodes");
});
