import {Request,Response,NextFunction} from 'express'; 
import {logger} from '../utils/logger';
import Jwt from "jsonwebtoken";
export interface CustomRequest extends Request{
    user?: {userId:string,username:string}
}
export const validateToken = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) {
      logger.warn("Access attempt without valid token!");
      res.status(401).json({
        message: "Authentication required",
        success: false,
      });
      return; 
    }
  
    try {
      const result = (await Jwt.verify(token, process.env.JWT_SECRET!)) as {
        userId: string;
        username: string;
      };
      req.user = result;
      next(); 
    } catch (err: any) {
      logger.warn("Invalid token!");
      res.status(401).json({
        message: "Invalid token!",
        success: false,
      });
      return; 
    }
  };
  