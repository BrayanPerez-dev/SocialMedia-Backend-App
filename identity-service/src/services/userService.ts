import userModel from "../models/userModel";
import { RegisterPayloadType } from "../types/user";

export class UserService{

    createUser=async(user:RegisterPayloadType):Promise<any>=>{
      if(!user.username ||!user.email ||!user.password){
        throw new Error("All fields are required");
        
      }
      const isUserAlreadyExists=await userModel.findOne({$or:[{username:user.username},{email:user.email}]});
      if(isUserAlreadyExists) throw new Error("User Already Exists");
      const newUser=await userModel.create(user);
      return newUser;
    }

     validateUser = async (payload: { email: string; password: string }): Promise<any> => {
  
      const user = await userModel.findOne({ email: payload.email });
      if (!user) throw new Error("Invalid Credentials");
      const isPasswordCorrect = await user.comparePassword(payload.password);
      if (!isPasswordCorrect) throw new Error("Invalid Credentials");
      return user;
    };
}