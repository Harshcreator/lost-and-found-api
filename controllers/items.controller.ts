import { Request, Response } from 'express';
import { FoundItem } from '../models/FoundItem';
import { LostItem } from '../models/LostItem';


export const reportLostItem = async (req: Request, res: Response) => {
  try {
    const item = await LostItem.create({ ...req.body, user: req.userId });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error reporting lost item' });
  }
};

export const reportFoundItem = async (req: Request, res: Response) => {
  try {
    const item = await FoundItem.create({ ...req.body, user: req.userId });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error reporting found item' });
  }
};

// Similar controllers for found items, get items, delete items