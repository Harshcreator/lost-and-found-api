import { Schema, model } from 'mongoose';

export interface IItem extends Document {
    description: string;
    location: string;
    date: Date;
    user: Schema.Types.ObjectId;
    image?: string;
  }

  const itemSchema = new Schema<IItem>({
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    image: String
  });

  export const LostItem = model<IItem>('LostItem', itemSchema);