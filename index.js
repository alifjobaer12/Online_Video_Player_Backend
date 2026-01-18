import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

/* ✅ CORS CONFIG */
const allowedOrigins = [
  "https://online-video-player-frontend.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET"],
  })
);

/* FIX __dirname FOR ES MODULE */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* LOAD RAW DATA FROM JSON FILE */
const dataPath = path.join(__dirname, "data", "episodes.json");
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
  const episodes = parseEpisodes();

  res.json({
    series: rawData.series || "Unknown Series",
    total: episodes.length,
    episodes
  });
});

app.listen(5000, () => {
  console.log("✅ API running at http://localhost:5000/api/episodes");
});
