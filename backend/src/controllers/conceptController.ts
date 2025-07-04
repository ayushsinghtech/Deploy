// src/controllers/conceptController.ts
import { Request, Response } from 'express';
import Concept from '../models/conceptModel';
import UserConceptProgress from '../models/userConceptProgress';
import { getQuizQuestions } from '../utils/conceptMapper';
import { Types } from 'mongoose';
import { IUser } from '../types';

/**
 * @desc    Fetch all available learning concepts (course catalog).
 * @route   GET /api/concepts
 * @access  Private
 */
export const getAllConcepts = async (req: Request, res: Response) => {
    try {
        // Only select fields needed for a catalog view to keep the payload small.
        const concepts = await Concept.find({})
            .select('title description complexity estLearningTimeHours level category Concept_Type conceptType prerequisites')
            .populate('prerequisites', '_id title');
        console.log('Found concepts:', concepts.length);
        res.status(200).json(concepts);
    } catch (error) {
        console.error(String(error));
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Search concepts by title
 * @route   GET /api/concepts/search?q=query
 * @access  Private
 */
export const searchConcepts = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        
        console.log('Searching for concepts with query:', q);
        
        if (!q || typeof q !== 'string') {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const concepts = await Concept.find({
            title: { $regex: q, $options: 'i' }
        }).select('title description complexity estLearningTimeHours level category Concept_Type conceptType _id');

        console.log('Search results:', concepts.length, 'concepts found');
        res.status(200).json(concepts);
    } catch (error) {
        console.error(String(error));
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Test endpoint to check if concepts exist
 * @route   GET /api/concepts/test
 * @access  Public
 */
export const testConcepts = async (req: Request, res: Response) => {
    try {
        const count = await Concept.countDocuments();
        const sampleConcepts = await Concept.find({}).limit(5).select('title _id');
        
        res.status(200).json({
            totalConcepts: count,
            sampleConcepts: sampleConcepts,
            message: count > 0 ? 'Concepts found in database' : 'No concepts found in database'
        });
    } catch (error) {
        console.error('Test concepts error:', error);
        const errMsg = error instanceof Error ? error.message : String(error);
        res.status(500).json({ message: 'Database error', error: errMsg });
    }
};

/**
 * @desc    Test endpoint to check quiz functionality
 * @route   GET /api/concepts/test-quiz
 * @access  Public
 */
export const testQuiz = async (req: Request, res: Response) => {
    try {
        const conceptsWithQuiz = await Concept.find({
            $or: [
                { 'Test_Questions.0': { $exists: true } },
                { 'quiz.0': { $exists: true } }
            ]
        }).select('title _id Test_Questions quiz');
        
        res.status(200).json({
            conceptsWithQuiz: conceptsWithQuiz.length,
            sampleConcepts: conceptsWithQuiz.slice(0, 3).map(c => ({
                title: c.title,
                id: c._id,
                hasTestQuestions: c.Test_Questions && c.Test_Questions.length > 0,
                hasOldQuiz: c.quiz && c.quiz.length > 0,
                testQuestionsCount: c.Test_Questions?.length || 0,
                oldQuizCount: c.quiz?.length || 0
            }))
        });
    } catch (error) {
        console.error('Test quiz error:', error);
        const errMsg = error instanceof Error ? error.message : String(error);
        res.status(500).json({ message: 'Database error', error: errMsg });
    }
};

/**
 * @desc    Fetch a single, detailed concept by its ID.
 * @route   GET /api/concepts/:id
 * @access  Private
 */
export const getConceptById = async (req: Request, res: Response) => {
    try {
        // Populate prerequisites to show their titles, creating the visible graph.
        const concept = await Concept.findById(req.params.id)
            .populate('prerequisites', 'title');
            
        if (concept) {
            res.status(200).json(concept);
        } else {
            res.status(404).json({ message: 'Concept not found' });
        }
    } catch (error) {
        console.error(String(error));
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get quiz questions for a specific concept
 * @route   GET /api/concepts/:id/quiz
 * @access  Private
 */
export const getConceptQuiz = async (req: Request, res: Response) => {
    try {
        const concept = await Concept.findById(req.params.id);
        
        if (!concept) {
            return res.status(404).json({ message: 'Concept not found' });
        }

        const quizQuestions = getQuizQuestions(concept);
        
        if (quizQuestions.length === 0) {
            return res.status(404).json({ message: 'No quiz questions found for this concept' });
        }

        res.status(200).json({
            conceptTitle: concept.title,
            conceptId: concept._id,
            questions: quizQuestions,
            totalQuestions: quizQuestions.length
        });
    } catch (error) {
        console.error(String(error));
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Enroll user in a concept
 * @route   POST /api/concepts/:id/enroll
 * @access  Private
 */
export const enrollInConcept = async (req: Request, res: Response) => {
    try {
        const { id: conceptId } = req.params;
        const userId = (req.user as IUser)?._id;

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Check if concept exists
        const concept = await Concept.findById(conceptId);
        if (!concept) {
            return res.status(404).json({ message: 'Concept not found' });
        }

        // Check if user is already enrolled
        let userProgress = await UserConceptProgress.findOne({ userId });
        
        if (!userProgress) {
            // Create new user progress document
            userProgress = new UserConceptProgress({
                userId,
                concepts: [{
                    conceptId,
                    score: 0,
                    attempts: 0,
                    lastUpdated: new Date(),
                    mastered: false
                }]
            });
        } else {
            // Check if already enrolled in this concept
            const existingConcept = userProgress.concepts.find(
                c => c.conceptId.toString() === conceptId
            );
            
            if (existingConcept) {
                return res.status(400).json({ message: 'Already enrolled in this concept' });
            }

            // Add new concept to user's progress
            userProgress.concepts.push({
                conceptId: new Types.ObjectId(conceptId),
                score: 0,
                attempts: 0,
                lastUpdated: new Date(),
                mastered: false
            });
        }

        await userProgress.save();

        res.status(200).json({ 
            message: 'Successfully enrolled in concept',
            conceptId,
            conceptTitle: concept.title
        });
    } catch (error) {
        console.error('Enrollment error:', error);
        const errMsg = error instanceof Error ? error.message : String(error);
        res.status(500).json({ message: 'Server Error', error: errMsg });
    }
};

/**
 * @desc    Check if user is enrolled in a concept
 * @route   GET /api/concepts/:id/enrollment-status
 * @access  Private
 */
export const getEnrollmentStatus = async (req: Request, res: Response) => {
    try {
        const { id: conceptId } = req.params;
        const userId = (req.user as IUser)?._id;

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const userProgress = await UserConceptProgress.findOne({ userId });
        
        if (!userProgress) {
            return res.status(200).json({ enrolled: false, progress: 0 });
        }

        const conceptProgress = userProgress.concepts.find(
            c => c.conceptId.toString() === conceptId
        );

        if (!conceptProgress) {
            return res.status(200).json({ enrolled: false, progress: 0 });
        }

        res.status(200).json({
            enrolled: true,
            progress: conceptProgress.score * 100, // Convert to percentage
            mastered: conceptProgress.mastered,
            attempts: conceptProgress.attempts
        });
    } catch (error) {
        console.error('Enrollment status error:', error);
        const errMsg = error instanceof Error ? error.message : String(error);
        res.status(500).json({ message: 'Server Error', error: errMsg });
    }
};
