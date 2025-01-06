import { Schema } from "mongoose";

export interface PostPayloadType{
    userId:Schema.Types.ObjectId
    content:string
}

export interface EventDataType{
    postId:Schema.Types.ObjectId,
    userId:Schema.Types.ObjectId,
    content:string,
    createdAt:Date,
    likes:number[],
    comments:string[]

}