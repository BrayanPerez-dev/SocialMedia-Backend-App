import mongoose, { Document, Model, Schema } from "mongoose";

// Define the interface for the Media document
interface IMedia extends Document {
  publicId: string;
  originalName: string;
  mimeType: string;
  url: string;
  userId: mongoose.Types.ObjectId; // Reference to the User model
}

// Define the schema
const mediaSchema = new Schema<IMedia>(
  {
    publicId: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Create and export the model
const Media: Model<IMedia> = mongoose.model<IMedia>("Media", mediaSchema);
export default Media;
