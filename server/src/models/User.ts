
import mongoose, {Schema} from "mongoose";


import type {IUser} from '../types/index.ts';


const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});





export default mongoose.model<IUser>('User', userSchema);

