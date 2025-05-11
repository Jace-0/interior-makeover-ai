import express from 'express';
import { uploadMiddleware } from '../middleware/uploadMiddleware';
import { generateDesign } from '../controllers/designController';

const router = express.Router();

// POST /api/redesign - Generate a new design
router.post('/redesign', uploadMiddleware.single('image'), generateDesign);


export default router;