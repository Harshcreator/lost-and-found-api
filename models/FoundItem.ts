import { Schema, model } from 'mongoose';

interface Item {
    description: string;
    location: string;
    date: Date;
    user: Schema.Types.ObjectId;
    image?: string;
  }
  
  const itemSchema = new Schema<Item>({
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    image: String
  });
  
  export const FoundItem = model<Item>('FoundItem', itemSchema);