import { Request } from "express";



export interface CustomRequest extends Request {
    userId?: string;
}

export interface FileUploadResponseType{
    public_id: string;
    version: number;
    signature: string;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    bytes: number;
    type: string;
    url: string;
    secure_url: string;
}