import { Schema } from "mongoose";
import postModel, { IPost } from "../models/postModel";
import { PostPayloadType } from "../types/post-types";

export class PostService{
    createPost=async(payload:PostPayloadType):Promise<IPost>=>{
      if(!payload.userId || !payload.content){
        throw new Error("All fields are required");
      }

        // Performing database operations here to create a new post
      const newPost=await postModel.create(payload);
      return newPost;
        
    }

    deletePost=async(id:Schema.Types.ObjectId):Promise<IPost| null>=>{
        if(!id) throw new Error("Post Id id required");
        const deletedPost=await postModel.findByIdAndDelete(id);
        return deletedPost;
    }

    findAllPost=async(page:number,limit:number,isAll:boolean):Promise<IPost[]>=>{
        if(isAll){
            return await postModel.find();
        }
        const startIndex=(page-1)*limit;
        return await postModel.find().skip(startIndex).limit(limit);
    }

    findPostById=async(id:Schema.Types.ObjectId):Promise<IPost | null>=>{
        if(!id) throw new Error("Post Id is required");
        return await postModel.findById(id);
    }
}