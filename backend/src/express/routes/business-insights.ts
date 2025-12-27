import express from "express";
import verifyToken from "../middleware/auth";
import * as businessInsightsController from "../controllers/business-insight.controller";

const router = express.Router();

/**
 * @swagger
 * /api/business-insights/dashboard:
 *   get:
 *     summary: Get business insights dashboard data
 *     description: Returns comprehensive business insights data for the dashboard including bookings, revenue, and performance metrics
 *     tags: [Business Insights]
 *     responses:
 *       200:
 *         description: Business insights dashboard data
 */
router.get("/dashboard", verifyToken, businessInsightsController.getDashboard);

/**
 * @swagger
 * /api/business-insights/forecast:
 *   get:
 *     summary: Get booking and revenue forecasts
 *     description: Returns forecasting data for bookings and revenue based on historical trends
 *     tags: [Business Insights]
 *     responses:
 *       200:
 *         description: Forecasting data
 */
router.get("/forecast", verifyToken, businessInsightsController.getForecast);

/**
 * @swagger
 * /api/business-insights/performance:
 *   get:
 *     summary: Get performance metrics
 *     description: Returns detailed performance metrics for the application
 *     tags: [Business Insights]
 *     responses:
 *       200:
 *         description: Performance metrics
 */
router.get("/performance", verifyToken, businessInsightsController.getPerformance);

export default router;
