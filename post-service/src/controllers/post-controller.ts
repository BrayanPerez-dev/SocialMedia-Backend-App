import { Request,Response } from "express";
import { logger } from "../utils/logger";
import { matchedData, validationResult } from "express-validator";
import { PostPayloadType } from "../types/post-types";
import { PostService } from "../services/post-service";
import rabbitMqService from "../utils/rabbitmq";
import {Schema} from 'mongoose';


class PostController{
    private postService:PostService=new PostService();

    addNewPost=async(req:Request,res:Response):Promise<any>=>{
        logger.info("Adding new post endpoint Hit");
        const result=validationResult(req);
        if(!result.isEmpty()){
            logger.error("Validation errors",result.array() );
            return res.status(400).json({errors:result.array()});
        }
        
        const payload=matchedData(req) as PostPayloadType;
        try{
          const result=await this.postService.createPost(payload);

          logger.info(`New post added, Content: ${result.content}`);
          rabbitMqService.publishEvent("post.created",{
            postId: result._id as Schema.Types.ObjectId,
            userId: result.userId,
            content: result.content,
            createdAt: result.createdAt,
            likes:result.likes,
            comments:result.comments
          })
          return res.status(201).json(result);
        }catch(error:any){
            logger.error("Error adding new post",error);
            return res.status(500).json({message:error.message || "Internal Server Error"});
        }
    }

    getAllPosts=async(req:Request,res:Response):Promise<any>=>{
      logger.info("Get All Post Endpoint Hit")  
      const {page,limit,all}=req.query 
      const isAll=all==="true";
      try{
         const posts=await this.postService.findAllPost(Number(page),Number(limit),isAll);
         logger.info("All Post Fetched Successfully")
         return res.status(200).json({success:true,posts});
      }catch(error:any){
        logger.error("Error fetching all post",error);
        return res.status(500).json({message:error.message || "Internal Server Error"});
      }
    }
    
    getPost=async(req:Request,res:Response):Promise<any>=>{
        logger.info("Get Single Post Endpoint Hit ")
        const result=validationResult(req);
        if(!result.isEmpty()){
            logger.error("Validation errors",result.array() );
            return res.status(400).json({errors:result.array()});
        }
        
        const {postId}=matchedData(req);
        try{
            
            const post=await this.postService.findPostById(postId);
            if(!post){
                logger.warn(`Post Not Found , PostID:${postId}`)
                return res.status(404).json({success:false,message:"Post Not Found"})
            } 
            logger.info(`Post Fetched SuccessFully,PostID: ${post._id}`)    

            return res.status(200).json({success:true,post});
        }catch(error:any){
            logger.error("Error fetching  post",error);
            return res.status(500).json({message:error.message || "Internal Server Error"});
        }
    }
   
    deletePostById=async(req:Request,res:Response):Promise<any>=>{
        logger.info("Delete Post Endpoin Hit");
        const result=validationResult(req);
        if(!result.isEmpty()){
            logger.error("Validation errors",result.array() );
            return res.status(400).json({errors:result.array()});
        }
        const {postId}=matchedData(req);
        try{
            const deletedPost=await this.postService.deletePost(postId);
            logger.info(`Post deleted successfully, PostId:${postId}`);
            rabbitMqService.publishEvent("post.deleted",postId);
            return res.status(200).json({success:true,message:"Post deleted successfully!",deletedPost})
        }catch(error:any){
            logger.error("Error deleting  post",error);
            return res.status(500).json({message:error.message || "Internal Server Error"});
        }
    }

}

export default new PostController();