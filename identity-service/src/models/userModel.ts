import mongoose, { Document, Model } from "mongoose";
import argon2 from "argon2";

// Define the User Interface
interface IUser {
  username: string;
  email: string;
  password: string;
  craetedAt: Date;
}

// Extend the Document interface to include methods
interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Extend the Model interface to support statics if needed
interface IUserModel extends Model<IUserDocument> {}

// Define the schema
const userSchema = new mongoose.Schema<IUserDocument>(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be at least 6 characters long"],
    },
    craetedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash the password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await argon2.hash(this.password);
    } catch (error: any) {
      next(error);
    }
  }
});

// Add methods to the schema
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return argon2.verify(this.password, candidatePassword);
};

// Create and export the model
const User = mongoose.model<IUserDocument, IUserModel>("User", userSchema);
export default User;
