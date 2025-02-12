import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-default-secret';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '24h';

export const generateToken = (userId: Types.ObjectId): string => {
    const options: SignOptions = {
        expiresIn: JWT_EXPIRES_IN
    };

    return jwt.sign(
        { userId: userId.toString() },
        JWT_SECRET,
        options
    );
};

export const verifyToken = (token: string): { userId: string } => {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
};