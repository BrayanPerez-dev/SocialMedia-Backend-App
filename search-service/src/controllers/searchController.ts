import { Request, Response } from "express";
import { logger } from "../utils/logger";
import searchModel from "../models/searchModel";

class SearchController {
  // Implement caching here for 2 to 5 minutes
  searchPostController = async (req: Request, res: Response): Promise<any> => {
    logger.info("Search endpoint hit!");
    try {
      const query = req.query.query;

      // Ensure query is a string
      if (typeof query !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid query parameter. 'query' must be a string.",
        });
      }

      const results = await searchModel
        .find(
          {
            $text: { $search: query },
          },
          {
            score: { $meta: "textScore" },
          }
        )
        .sort({ score: { $meta: "textScore" } })
        .limit(10);

      return res.json(results);
    } catch (error: any) {
      logger.error("Error while searching post", error);
      res.status(500).json({
        success: false,
        message: "Error while searching post",
      });
    }
  };
}

export default new SearchController();
