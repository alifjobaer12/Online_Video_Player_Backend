import express from "express";
import { connectDB } from "../db/mongo.js";

const router = express.Router();
const PAGE_SIZE = 10;

/* GET ALL SERIES */
router.get("/", async (req, res) => {
	try {
		const db = await connectDB();
		const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
		const skip = (page - 1) * PAGE_SIZE;

		const total = await db.collection("series").countDocuments({});
		const series = await db
			.collection("series")
			.find({})
			.sort({ _id: -1 })
			.skip(skip)
			.limit(PAGE_SIZE)
			.toArray();

		res.json({
			series,
			page,
			limit: PAGE_SIZE,
			total,
			totalPages: Math.ceil(total / PAGE_SIZE),
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

/* SEARCH SERIES */
router.get("/search", async (req, res) => {
	try {
		const db = await connectDB();
		const q = req.query.q || "";
		const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
		const skip = (page - 1) * PAGE_SIZE;

		const filter = {
			series: { $regex: q, $options: "i" },
		};

		const total = await db.collection("series").countDocuments(filter);

		const result = await db
			.collection("series")
			.find(filter)
			.sort({ series: 1 })
			.skip(skip)
			.limit(PAGE_SIZE)
			.toArray();

		res.json({
			series: result,
			page,
			limit: PAGE_SIZE,
			total,
			totalPages: Math.ceil(total / PAGE_SIZE),
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;
