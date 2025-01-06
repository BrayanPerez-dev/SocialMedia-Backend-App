import amqplib, { Channel, Connection } from "amqplib";
import { logger } from "./logger";
import { EventDataType } from "../types/post-types";

class RabbitMqService{
 private connection:Connection | null = null;
 private channel: Channel | null = null;
 private EXCHANGE_NAME:string = "facebook_events";

   connectToRabbitMQ=async():Promise<void>=>{
    try { 
      this.connection = await amqplib.connect(process.env.RABBITMQ_URL!);
      this.channel = await this.connection.createChannel();
  
      await this.channel.assertExchange(this.EXCHANGE_NAME, "topic", { durable: false });
      logger.info("Connected to rabbit mq");
   
    } catch (error:any) {
      logger.error("Error connecting to rabbit mq", error);
    }
  }

  publishEvent=async(routingKey:string, message:EventDataType):Promise<void>=>  {
    if (!this.channel) {
      await this.connectToRabbitMQ();
    }
  
   this.channel && this.channel.publish(
      this.EXCHANGE_NAME,
      routingKey,
      Buffer.from(JSON.stringify(message))
    );
    logger.info(`Event published: ${routingKey}, Message:${JSON.stringify(message)}`);
  }
  
}
 

export default new RabbitMqService();