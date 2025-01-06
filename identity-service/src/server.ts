import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { logger } from "./utils/logger";
import Redis from "ioredis";
import { RateLimiterRedis } from "rate-limiter-flexible";
import userRoutes from "./routes/userRoute";
import { connectDB } from "./utils/db";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();
const redisClient = new Redis(process.env.RADIS_URL!);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(errorHandler)

// Logger Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  next();
});

// Global Rate Limiter using `rate-limiter-flexible`
const globalRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10, // Maximum 10 requests
  duration: 1, // Per second
});

app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await globalRateLimiter.consume(req.ip!); // Consume 1 point for each request
    next();
  } catch (error: any) {
    logger.warn(`Rate limit exceeded for IP address: ${req.ip}`);
    res.status(429).json({ success: false, message: "Too many requests" });
  }
});

// Specific Rate Limiter for sensitive endpoints
const sensitiveEndpointsLimiter = rateLimit({
  windowMs: 2000, // 2 seconds window
  max: 100, // Limit each IP to 2 requests per windowMs
  standardHeaders: true, // Add standard HTTP headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: "Too many requests, please try again later.",
  handler: (req: Request, res: Response, next: NextFunction) => {
    logger.warn(`Too many requests for IP address: ${req.ip}`);
    res.status(429).json({ success: false, message: "Too many requests" });
  },
  
});


// Apply sensitive rate limiting to the `/register` route
app.use("/api/auth/register", sensitiveEndpointsLimiter);

// Routes
app.use("/api/auth", userRoutes);

// Base Route
app.get("/", (_: Request, res: Response) => {
  res.json("Welcome to Identity Service!");
});

// Start Server
app.listen(PORT, () => {
  connectDB();
  console.log(`Identity Server is running on port ${PORT}`);
});
