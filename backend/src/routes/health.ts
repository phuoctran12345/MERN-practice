import express from "express";
import * as healthController from "../controllers/health.controller";

const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Get API health status
 *     description: Returns the current health status of the API including database connection, memory usage, and uptime
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 *                 database:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "connected"
 *                     collections:
 *                       type: number
 *                       description: Number of collections in database
 *                 memory:
 *                   type: object
 *                   properties:
 *                     used:
 *                       type: number
 *                       description: Memory usage in MB
 *                     total:
 *                       type: number
 *                       description: Total memory in MB
 *                     percentage:
 *                       type: number
 *                       description: Memory usage percentage
 *       503:
 *         description: API is unhealthy
 */
router.get("/", healthController.getHealth);

/**
 * @swagger
 * /api/health/detailed:
 *   get:
 *     summary: Get detailed API health status
 *     description: Returns detailed health information including system metrics and performance data
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed health information
 */
router.get("/detailed", healthController.getDetailedHealth);

export default router;
