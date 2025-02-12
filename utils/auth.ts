import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export const generateToken = (userId: Types.ObjectId): string => {
    return jwt.sign(
        { userId: userId.toString() },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

export const verifyToken = (token: string): { userId: string } => {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
};