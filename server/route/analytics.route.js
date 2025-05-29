import express from "express";
import { getAnalyticsData } from "../controllers/analytics.controller.js";

const router = express.Router();

// Rute GET untuk ambil data analytics
router.get("/", getAnalyticsData);

export default router;
