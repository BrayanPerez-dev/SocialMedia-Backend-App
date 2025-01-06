import amqplib,{Connection,Channel} from "amqplib";
import { logger } from "./logger";
import {EventDataType} from '../types/search';

class RabbitMqSerivce{
    private connection:Connection | null =null;
    private channel:Channel | null = null;
    private EXCHANGE_NAME:string="facebook_events";

     connectToRabbitMQ=async():Promise<void> =>{
        try {
          this.connection = await amqplib.connect(process.env.RABBITMQ_URL!);
          this.channel = await this.connection.createChannel();
      
          await this.channel.assertExchange(this.EXCHANGE_NAME, "topic", { durable: false });
          logger.info("Connected to rabbit mq");
        } catch (error:any) {
          logger.error("Error connecting to rabbit mq", error);
        }
      }

        consumeEvent=async(routingKey:string, callback:(event:EventDataType)=>void):Promise<void>=> {
        if (!this.channel) {
          await this.connectToRabbitMQ();
        }
      
        const q = await this.channel?.assertQueue("", { exclusive: true })!;
        this.channel && await this.channel.bindQueue(q.queue, this.EXCHANGE_NAME, routingKey);
        this.channel?.consume(q.queue, (msg) => {
          if (msg !== null) {
            const content = JSON.parse(msg.content.toString()) as EventDataType;
            callback(content);
            this.channel?.ack(msg);
          }
        });
      
        logger.info(`Subscribed to event: ${routingKey}`);
      }
      
}


export default new RabbitMqSerivce();