import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import Redis from 'ioredis';
import dotenv from 'dotenv'
import {RedisReply, RedisStore} from 'rate-limit-redis';
import {rateLimit} from 'express-rate-limit';
import {Request,Response,NextFunction} from 'express'
import { logger } from './utils/logger';
import proxy from 'express-http-proxy';
import { errorHandler } from './middlewares/errorHandler';
import { validateToken,CustomRequest } from './middlewares/authMiddleware';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000

app.use(helmet());
app.use(cors());
app.use(express.json());

const redisClient = new Redis(process.env.REDIS_URL!);


//rate limiting
const ratelimitOptions = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({ success: false, message: "Too many requests" });
    },
    // store: new RedisStore({
    //   sendCommand: (...args:string[]) => redisClient.call(...args) as any,
    // }),
  });
  
  app.use(ratelimitOptions);
  

  const proxyOptions = {
    proxyReqPathResolver: (req:Request) => {
      return req.originalUrl.replace(/^\/v1/, "/api");
    },
    proxyErrorHandler: (err:any, res:Response, next:NextFunction) => {
      logger.error(`Proxy error: ${err.message}`);
      res.status(500).json({
        message: `Internal server error`,
        error: err,
      });
    },
  };

 //setting up proxy for our identity service
app.use(
    "/v1/auth",
    proxy(process.env.IDENTITY_SERVICE_URL!, {
      ...proxyOptions,
      proxyReqOptDecorator: (proxyReqOpts:any, srcReq) => {
        proxyReqOpts.headers["Content-Type"] = "application/json";
        return proxyReqOpts;
      },
      userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        logger.info(
          `Response received from Identity service: ${proxyRes.statusCode}`
        );
  
        return proxyResData;
      },
    })
  );
//setting up proxy for our post service
app.use(
  "/v1/posts",
  validateToken,
  proxy(process.env.POST_SERVICE_URL!, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts:any, srcReq:CustomRequest) => {
      proxyReqOpts.headers["Content-Type"] = "application/json";
      proxyReqOpts.headers["x-user-id"] = srcReq?.user?.userId;

      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Response received from Post service: ${proxyRes.statusCode}`
      );

      return proxyResData;
    },
  })
);

//setting up proxy for our media service
app.use(
  "/v1/media",
  validateToken,
  proxy(process.env.MEDIA_SERVICE_URL!, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts:any, srcReq:CustomRequest) => {
      proxyReqOpts.headers["x-user-id"] = srcReq?.user?.userId;
      if (srcReq.headers && srcReq.headers["content-type"] && !srcReq.headers["content-type"].startsWith("multipart/form-data")) {//+
        proxyReqOpts.headers["Content-Type"] = "application/json";
      }
 
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Response received from media service: ${proxyRes.statusCode}`
      );

      return proxyResData;
    },
    parseReqBody: false,
  })
);
//setting up proxy for our Search service
app.use(
  "/v1/search",
  validateToken,
  proxy(process.env.SEARCH_SERVICE_URL!, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts:any, srcReq:CustomRequest) => {
      proxyReqOpts.headers["x-user-id"] = srcReq?.user?.userId;
      if (srcReq.headers && srcReq.headers["content-type"] && !srcReq.headers["content-type"].startsWith("multipart/form-data")) {//+
        proxyReqOpts.headers["Content-Type"] = "application/json";
      }
 
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Response received from search service: ${proxyRes.statusCode}`
      );

      return proxyResData;
    },
    parseReqBody: false,
  })
);

  app.use(errorHandler)
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`Processing request for ${req.method} ${req.url}`);
    logger.info(`Request body : ${JSON.stringify(req.body)}`);
  })


  app.listen(PORT, () => {
    logger.info(`Api Gateway is running on port ${PORT}`);
    logger.info(`Identity Service is running on : ${process.env.IDENTITY_SERVICE_URL}`);
    logger.info(`Post service is running on port ${process.env.POST_SERVICE_URL}`);
    logger.info(`Media service is running on port ${process.env.MEDIA_SERVICE_URL}`);
    logger.info(`Search service is running on port ${process.env.SEARCH_SERVICE_URL}`);
  });

 