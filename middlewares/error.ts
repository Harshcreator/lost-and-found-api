import { Request, Response, NextFunction } from 'express';
import { AuthError } from '../types/errors';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if(err instanceof AuthError) {
        return res.status(err.statusCode).json({ 
            message: err.message,
            success: false 
        });
    }

    console.error(err);
    res.status(500).json({
        message: 'Internal server error',
        success: false
    });
};