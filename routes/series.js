import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const dataPath = path.join(process.cwd(), "data", "series.json");

/* GET ALL SERIES */
router.get("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath));
  res.json(data);
});

/* SEARCH BY NAME */
router.get("/search", (req, res) => {
  const { q } = req.query;
  const data = JSON.parse(fs.readFileSync(dataPath));

  const filtered = data.filter(s =>
    s.series.toLowerCase().includes(q.toLowerCase())
  );

  res.json(filtered);
});

export default router;
