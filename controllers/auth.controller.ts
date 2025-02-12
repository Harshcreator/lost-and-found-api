import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { generateToken } from '../utils/auth';
import { validateemail, validatePassword } from '../utils/validation';
import { AuthError } from '../types/errors';
import { Types } from 'mongoose';

interface AuthResponse {
    success: boolean;
    message?: string;
    data?: {
        user: Omit<IUser, 'password'>;
        token: string;
    };
}

export class AuthController {
    public async register(req: Request, res: Response<AuthResponse>): Promise<Response> {
        try {
            const { email, password } = req.body;

            // Input validation
            if (!email || !password) {
                return res.status(400).json({ 
                    success: false,
                    message: 'email and password are required' 
                });
            }

            // Validate email format
            if (!validateemail(email)) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Invalid email format. email must be 3-20 characters long and contain only letters, numbers, and underscores.' 
                });
            }

            // Validate password strength
            if (!validatePassword(password)) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Password must be at least 8 characters long and contain at least one letter and one number' 
                });
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email }).exec();
            if (existingUser) {
                return res.status(409).json({ 
                    success: false,
                    message: 'email already exists' 
                });
            }

            const user = new User({ email, password });
            await user.save();

            // Create safe user object without password
            const { _id, email: userEmail } = user;
            const userObject = user.toObject();
            delete userObject.password;
            const userResponse: Omit<IUser, 'password'> = userObject;

            const token = generateToken(user._id as Types.ObjectId);
            return res.status(201).json({
                success: true,
                data: {
                    user: userResponse,
                    token
                }
            });
        } catch (error) {
            return this.handleError(error, res);
        }
    }

    private handleError(error: unknown, res: Response<AuthResponse>): Response {
        console.error('Auth error:', error);
        
        if (error instanceof AuthError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }

    public async login(req: Request, res: Response<AuthResponse>): Promise<Response> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ 
                    success: false,
                    message: 'email and password are required' 
                });
            }

            const user = await User.findOne({ email }).select('+password').exec();
            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Invalid credentials' 
                });
            }

            // Create safe user object without password
            const userObject = user.toObject();
            delete userObject.password;
            const userResponse: Omit<IUser, 'password'> = userObject;

            const token = generateToken(user._id as Types.ObjectId);
            return res.status(200).json({
                success: true,
                data: {
                    user: userResponse,
                    token
                }
            });
        } catch (error) {
            return this.handleError(error, res);
        }
    }
}