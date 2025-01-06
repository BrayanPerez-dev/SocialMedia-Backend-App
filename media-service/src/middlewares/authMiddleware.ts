import { CustomRequest } from "../types/media";
import {logger} from "../utils/logger";
import { Response,NextFunction } from "express";

export const authenticateRequest = (req:CustomRequest, res:Response, next:NextFunction):any => {
  const userId = req.headers["x-user-id"];


  if (!userId) {
    logger.warn(`Access attempted without user ID`);
    return res.status(401).json({
      success: false,
      message: "Authencation required! Please login to continue",
    });
  }


  req.userId = typeof userId === 'string' ? userId : userId[0];

  next();
};

