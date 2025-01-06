import express,{NextFunction, Request,Response} from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';

import {connectDB} from './utils/db';
import { logger } from './utils/logger';
import rabbitmqService from './utils/rabbitmq';
import { handlePostCreated,handlePostDeleted } from './eventHandler/searchEventHandler';
import searchRoutes from  './routes/serachRoute';

const app=express();
dotenv.config();
const PORT=process.env.PORT || 3004;

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use((req:Request, res:Response, next:NextFunction) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request body, ${req.body}`);
    next();
  });
  
 app.use('/api/search',searchRoutes); 


app.get('/', (_: Request, res: Response) => {
    res.status(200).json('Hello from Search Service!');
});

app.listen(PORT, () => {
    connectDB();
    rabbitmqService.connectToRabbitMQ();
    rabbitmqService.consumeEvent('post.created',handlePostCreated);
    rabbitmqService.consumeEvent("post.deleted", handlePostDeleted);
    logger.info(`Search Service is running on port ${PORT}`);
});