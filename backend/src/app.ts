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
        'https://masterly-deploy.vercel.app'
    ],
    credentials: true,
}));

// --- Core Middlewares ---
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// --- API Route Mounting ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/concepts', conceptRoutes);
// app.use('/api/quizzes', quizRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/recommendation", recommendationRoutes);
app.use('/api/learning-path', learningPathRoutes);

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

// --- Server Initialization ---
// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running in '${process.env.NODE_ENV || 'development'}' mode on port ${PORT}`);
    });
}

export default app;
