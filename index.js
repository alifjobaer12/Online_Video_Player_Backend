import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import seriesRoutes from "./routes/series.js";
import { connectDB } from "./db/mongo.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// connect database
await connectDB();

app.use("/api/series", seriesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);
