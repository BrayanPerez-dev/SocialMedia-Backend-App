import mongoose,{Document,Schema} from "mongoose";

export interface IRefreshToekn extends Document{
  token:string;
  userId:Schema.Types.ObjectId;
  expireAt:Date;
}
const refreshTokenSchema=new mongoose.Schema<IRefreshToekn>({
    token:{
        type:String,
        required:true,
        unique:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    expireAt:{
        type:Date,
        required:true
    }
},{timestamps:true})

refreshTokenSchema.index({expireAt:1},{expireAfterSeconds:0});

export default mongoose.model<IRefreshToekn>("RefreshToken",refreshTokenSchema);