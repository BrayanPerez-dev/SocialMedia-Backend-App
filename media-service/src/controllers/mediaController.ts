import {  Response } from "express";
import { logger } from "../utils/logger";
import { uploadMediaToCloudinary } from "../utils/cloudinary";
import mediaModel from "../models/mediaModel";
import { CustomRequest, FileUploadResponseType } from "../types/media";

class MediaController {
 
     uploadMedia = async (req:CustomRequest, res:Response):Promise<any> => {
        logger.info("Starting media upload");
        try {
          console.log(req.file, "req.filereq.file");
      
          if (!req.file) {
            logger.error("No file found. Please add a file and try again!");
            return res.status(400).json({
              success: false,
              message: "No file found. Please add a file and try again!",
            });
          }
      
          const { originalname, mimetype } = req.file;
          const userId = req.userId;
      
          logger.info(`File details: name=${originalname}, type=${mimetype}`);
          logger.info("Uploading to cloudinary starting...");
      
          const cloudinaryUploadResult = await uploadMediaToCloudinary(req.file) as FileUploadResponseType;
          logger.info(
            `Cloudinary upload successfully. Public Id: - ${cloudinaryUploadResult.public_id}`
          );
      
          const newlyCreatedMedia = new mediaModel({
            publicId: cloudinaryUploadResult.public_id,
            originalName: originalname,
            mimeType: mimetype,
            url: cloudinaryUploadResult.secure_url,
            userId,
          });
      
          await newlyCreatedMedia.save();
      
          res.status(201).json({
            success: true,
            mediaId: newlyCreatedMedia._id,
            url: newlyCreatedMedia.url,
            message: "Media upload is successfully",
          });
        } catch (error:any) {
          logger.error("Error creating media", error);
          res.status(500).json({
            success: false,
            message: error.message || "Error creating media",
          });
        }
      };
      
       getAllMedias = async (req:CustomRequest, res:Response) : Promise<any>=> {
        logger.info("Fetching all medias Endpoint Hit");
        try {
          // const results = await mediaModel.find({});
          return res.status(200).json("Hello");
        } catch (error:any) {
          logger.error("Error fetching medias", error);
         return res.status(500).json({
            success: false,
            message: "Error fetching medias",
          });
        }
      };
      
}

export default new MediaController();
 