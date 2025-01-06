import {v2 as cloudinary} from 'cloudinary';
import { logger } from './logger';
import dotenv from 'dotenv';
dotenv.config();


    // Configuration
cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME,  
        api_key: process.env.CLOUDINARY_API_KEY,   
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
  export const uploadMediaToCloudinary = async (file: any) => {
       return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type:"auto"
                },
                (err, result) => {
                    if(err) {
                        logger.error("Error uploading to cloudinary: ",err);
                        reject(err);
                    }
                    resolve(result);
                }
            )
            uploadStream.end(file.buffer);
       })
  }