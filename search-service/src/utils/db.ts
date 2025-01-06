import mongoose from "mongoose";
import { logger } from "./logger";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL!);
        logger.info("Connected to MongoDB");
    } catch (error) {
        logger.error("Error connecting to MongoDB", error);
        process.exit(1);
    }
}