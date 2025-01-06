import mongoose, { Document, Model, Schema } from "mongoose";


interface ISearchPost extends Document{
    postId:string,
    userId:string,
    content:string,
    createdAt:Date,
    likes:string[],
    comments:string[]
}
const searchPostSchema = new Schema<ISearchPost>(
  {
    postId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    likes:[{type:String}],
    comments:[{type:String}]

  },
  { timestamps: true }
);

searchPostSchema.index({ content: "text" });
searchPostSchema.index({ createdAt: -1 });
const SearchModel: Model<ISearchPost>=mongoose.model("Search", searchPostSchema);
export default SearchModel;
