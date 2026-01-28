import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const dataPath = path.join(process.cwd(), "data", "series.json");

/* HELPER: READ + SORT DATA */
function getSortedSeries() {
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  return data.sort((a, b) => a.series.localeCompare(b.series));
}

/* GET ALL SERIES (ALWAYS SORTED) */
router.get("/", (req, res) => {
  const sortedData = getSortedSeries();
  res.json(sortedData);
});

/* SEARCH BY NAME (FILTER + SORT) */
router.get("/search", (req, res) => {
  const { q = "" } = req.query;

  const result = getSortedSeries().filter((series) =>
    series.series.toLowerCase().includes(q.toLowerCase()),
  );

  res.json(result);
});

export default router;
