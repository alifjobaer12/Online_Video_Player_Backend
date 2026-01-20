import express from "express";
import cors from "cors";
import seriesRoutes from "./routes/series.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/series", seriesRoutes);

app.listen(5000, () =>
  console.log("🚀 Backend running on http://localhost:5000")
);
