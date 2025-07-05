// src/app.ts
import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import connectDB from './config/db';
dotenv.config();
import './config/passport-setup'; 


// --- Route Imports ---
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import conceptRoutes from './routes/conceptRoutes';
import adminRoutes from './routes/adminRoutes';
import quizRoutes from './routes/quizRoutes';
import recommendationRoutes from './routes/recommendation.routes';
import learningPathRoutes from './routes/learningPathRoutes';

const app: Express = express();

// Connect to database
connectDB();

// --- THIS IS THE CRUCIAL FIX ---
// Configure CORS to allow requests from your frontend's origin
// and to allow cookies to be sent back and forth.
app.use(cors({
    origin: [
        process.env.CLIENT_URL || 'http://localhost:3000',
        'https://masterly-deploy-frontend.vercel.app',
        'https://masterly-deploy.vercel.app',
        'file://', // Allow local file access for testing
        'null', // Allow null origin for testing
        '*' // Allow all origins temporarily for testing
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// --- Core Middlewares ---
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// --- API Route Mounting ---
console.log('Mounting API routes...');
app.use('/api/auth', authRoutes);
console.log('Auth routes mounted at /api/auth');
app.use('/api/users', userRoutes);
console.log('User routes mounted at /api/users');
app.use('/api/concepts', conceptRoutes);
console.log('Concept routes mounted at /api/concepts');
// app.use('/api/quizzes', quizRoutes);
app.use('/api/admin', adminRoutes);
console.log('Admin routes mounted at /api/admin');
app.use("/api/quiz", quizRoutes);
console.log('Quiz routes mounted at /api/quiz');
app.use("/api/recommendation", recommendationRoutes);
console.log('Recommendation routes mounted at /api/recommendation');
app.use('/api/learning-path', learningPathRoutes);
console.log('Learning path routes mounted at /api/learning-path');

// Root endpoint for testing
app.get('/', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Masterly Backend API is running',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            users: '/api/users',
            concepts: '/api/concepts',
            admin: '/api/admin',
            quiz: '/api/quiz',
            recommendation: '/api/recommendation',
            learningPath: '/api/learning-path'
        }
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Database connection test endpoint
app.get('/api/test-db', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const connectionState = mongoose.connection.readyState;
        const states: { [key: number]: string } = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        
        res.json({ 
            status: 'OK', 
            database: states[connectionState] || 'unknown',
            connectionState,
            env: {
                hasMongoUri: !!process.env.MONGODB_URI,
                hasJwtSecret: !!process.env.JWT_SECRET,
                nodeEnv: process.env.NODE_ENV
            }
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ 
            status: 'ERROR', 
            error: errorMessage,
            env: {
                hasMongoUri: !!process.env.MONGODB_URI,
                hasJwtSecret: !!process.env.JWT_SECRET,
                nodeEnv: process.env.NODE_ENV
            }
        });
    }
});

// Debug route to see all available routes
app.get('/api/debug/routes', (req, res) => {
    const routes: any[] = [];
    app._router.stack.forEach((middleware: any) => {
        if (middleware.route) {
            routes.push({
                path: middleware.route.path,
                methods: Object.keys(middleware.route.methods)
            });
        } else if (middleware.name === 'router') {
            middleware.handle.stack.forEach((handler: any) => {
                if (handler.route) {
                    routes.push({
                        path: handler.route.path,
                        methods: Object.keys(handler.route.methods)
                    });
                }
            });
        }
    });
    res.json({ routes });
});

// Catch-all route for debugging
app.use('*', (req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ 
        error: 'Route not found', 
        method: req.method, 
        url: req.originalUrl,
        availableRoutes: ['/api/auth', '/api/users', '/api/concepts', '/api/admin', '/api/quiz', '/api/recommendation', '/api/learning-path']
    });
});

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running in '${process.env.NODE_ENV || 'development'}' mode on port ${PORT}`);
});

export default app;
