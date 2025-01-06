import Jwt  from "jsonwebtoken";


export const generateToken=async(user:{_id:string,username:string}):Promise<{accessToken:string,refreshToken:string}>=>{
const accessToken=await Jwt.sign({userId:user._id,username:user.username},process.env.JWT_SECRET!,{expiresIn:"1h"});
const refreshToken=await Jwt.sign({userId:user._id,username:user.username},process.env.JWT_SECRET!,{expiresIn:"7d"});
return {accessToken,refreshToken}
}