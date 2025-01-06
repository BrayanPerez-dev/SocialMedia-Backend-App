import express from "express";
import searchController from "../controllers/searchController";
import { authenticateRequest } from "../middlewares/authMiddleware";

const router = express.Router();



router.get("/posts",authenticateRequest, searchController.searchPostController);

export default router;