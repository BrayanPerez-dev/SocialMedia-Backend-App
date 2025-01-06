import { Request,Response } from "express";
import { logger } from "../utils/logger";
import {generateToken} from '../utils/generateToken';
import { validationResult,matchedData } from "express-validator";
import { UserService } from "../services/userService";
import { RegisterPayloadType,LoginPayloadType } from "../types/user";


class UserController{

   
    private userService=new UserService();
    

    registerUser=async(req:Request,res:Response):Promise<any>=>{
      logger.info("Registering User endpoint hit");
      const result= validationResult(req);
      if(!result.isEmpty()){
        logger.error("Validation errors",result.array() );
        return res.status(400).json({errors:result.array()});
      }
      const payload=matchedData(req) as RegisterPayloadType;
      try{
          const result=await this.userService.createUser(payload) as {_id:string,username:string} ;
          logger.info(`New User Register, Username: ${result.username}`);
          const tokens=await generateToken({_id:result._id,username:result.username})
          return res.status(201).json({success:true,message:"User registered Successfully",user:result,tokens})

      }catch(error:any){
        logger.error("Error registering user",error);
        return res.status(500).json({message:error.message || "Internal Server Error"});
      }
    }

    loginUser=async(req:Request,res:Response):Promise<any>=>{
      logger.info('Login endpoint hit');
      const result= validationResult(req);
      if(!result.isEmpty()){
        logger.error("Validation errors",result.array() );
        return res.status(400).json({errors:result.array()});
      }
      const payload=matchedData(req) as LoginPayloadType;
      try{
           const result=await this.userService.validateUser(payload);
           logger.info(`User logged in successfully, ${result.username}`);
           const tokens=await generateToken({_id:result._id,username:result.username})
           return res.status(200).json({success:true,message:"User logged in successfully",user:result,tokens})
      }catch(error:any){
        logger.error("Error Loging user",error);
        return res.status(500).json({message:error.message || "Internal Server Error"});
      }
    }
}

export default  new UserController();