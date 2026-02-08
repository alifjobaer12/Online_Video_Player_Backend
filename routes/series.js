import express from "express";
import { connectDB } from "../db/mongo.js";

const router = express.Router();

/* GET ALL SERIES */
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const series = await db
      .collection("series")
      .find({})
      .sort({ series: 1 })
      .toArray();

    res.json(series);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* SEARCH SERIES */
router.get("/search", async (req, res) => {
  try {
    const db = await connectDB();
    const q = req.query.q || "";

    const result = await db
      .collection("series")
      .find({
        series: { $regex: q, $options: "i" },
      })
      .sort({ series: 1 })
      .toArray();

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
