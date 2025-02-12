import { Schema, model } from 'mongoose';
import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

export const User = model<IUser>('User', userSchema); 