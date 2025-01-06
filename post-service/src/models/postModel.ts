import mongoose,{Document} from "mongoose";

export interface IPost extends Document{
    userId:mongoose.Schema.Types.ObjectId,
    content:string,
    mediaUrl:string[],
    likes:number[],
    comments:string[],
    createdAt:Date
}

const postShema=new mongoose.Schema<IPost>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    content:{
        type:String,
        required:true
    },
    mediaUrl:[
        {
            type:String
        }
    ],
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }],
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }],
    
    createdAt:{
        type:Date,
        default:Date.now
    }
},{timestamps:true});


postShema.index({content:"text"});

export default mongoose.model<IPost>("Post",postShema);