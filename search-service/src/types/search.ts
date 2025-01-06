import { Request } from "express";
import {Schema} from 'mongoose';


export interface CustomRequest extends Request {
    userId?: string;
}

export interface EventDataType{
   postData?:{
    postId:Schema.Types.ObjectId,
    userId:Schema.Types.ObjectId,
    content:string,
    createdAt:Date,
    likes:number[],
    comments:string[]
   } 
  postId?:string,
}