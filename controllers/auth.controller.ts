import { Request, Response } from 'express';
import { User } from '../models/user';
import { generateToken } from '../utils/auth';
import { validateUsername, validatePassword } from '../utils/validation';

export class AuthController {
    public async register(req: Request, res: Response): Promise<Response> {
        try {
            const { username, password } = req.body;

            // Input validation
            if (!username || !password) {
                return res.status(400).json({ 
                    message: 'Username and password are required' 
                });
            }

            // Validate username format
            if (!validateUsername(username)) {
                return res.status(400).json({ 
                    message: 'Invalid username format' 
                });
            }

            // Validate password strength
            if (!validatePassword(password)) {
                return res.status(400).json({ 
                    message: 'Password must be at least 8 characters long and contain letters and numbers' 
                });
            }

            // Check if user already exists
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(409).json({ 
                    message: 'Username already exists' 
                });
            }

            const user = new User({ username, password });
            await user.save();

            // Don't send password in response
            const userResponse = user.toJSON();
            const { password, ...userWithoutPassword } = userResponse;

            const token = generateToken(user);
            return res.status(201).json({ user: userResponse, token });
        } catch (error) {
            console.error('Register error:', error);
            return res.status(500).json({ 
                message: 'Internal server error' 
            });
        }
    }

    public async login(req: Request, res: Response): Promise<Response> {
        try {
            const { username, password } = req.body;

            // Input validation
            if (!username || !password) {
                return res.status(400).json({ 
                    message: 'Username and password are required' 
                });
            }

            const user = await User.findOne({ username });
            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({ 
                    message: 'Invalid credentials' 
                });
            }

            // Don't send password in response
            const userResponse = user.toJSON();
            delete userResponse.password;

            const token = generateToken(user);
            return res.status(200).json({ user: userResponse, token });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ 
                message: 'Internal server error' 
            });
        }
    }
}