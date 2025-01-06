import express,{Request,Response,NextFunction} from 'express';
import helmet from 'helmet';
import cors from 'cors';
import  dotenv from 'dotenv';
import {logger} from './utils/logger';
import {errorHandler} from './middlewares/errorHandler';
import postRoutes from './routes/post-route';
import { connectDB } from './utils/db';
import rabbitMqService from './utils/rabbitmq';



const app=express();
dotenv.config();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(errorHandler);

const PORT=process.env.PORT || 3002

app.use('/api/posts',postRoutes);
app.use('/api/posts',(req:Request,res:Response)=>{

})

app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`Processing request for ${req.method} ${req.url}`);
    logger.info(`Request body : ${JSON.stringify(req.body)}`);
  })


  app.listen(PORT, () => {
    connectDB();
    rabbitMqService.connectToRabbitMQ();
    logger.info(`Post Service is running on port ${PORT}`);
  }); 