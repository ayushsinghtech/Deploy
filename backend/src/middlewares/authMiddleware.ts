import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import Admin from '../models/adminModel';
import { IUser } from '../types';

/**
 * Verifies the JWT token from the cookie, finds the associated user,
 * and attaches the user's data to the request object.
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        // Get user from the token's ID and attach to the request object
        // This is the crucial step that makes req.user available
        req.user = await User.findById(decoded.id).select('-password') || undefined;

        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        next(); // Proceed to the next middleware or controller
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

/**
 * Verifies the admin JWT token from the cookie or authorization header,
 * finds the associated admin, and attaches the admin's data to the request object.
 */
export const protectAdmin = async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (req.cookies && req.cookies.admin_token) {
        token = req.cookies.admin_token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        const admin = await Admin.findById(decoded.id).select('-password');
        if (!admin) {
            return res.status(401).json({ message: 'Not authorized, admin not found' });
        }
        req.user = admin;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};