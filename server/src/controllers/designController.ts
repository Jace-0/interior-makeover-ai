import { Request, Response, NextFunction } from 'express';
import * as designService from '../services/designService';
import logger from '../utils/logger';
import { ApiError } from '../utils/errorHandler';

/**
 * Generate a new interior design based on uploaded image and theme
 */
export const generateDesign = async (req: Request, res: Response, next: NextFunction) : Promise<void>=> {
  try {
    // Check if file exists
    if (!req.file) {
      throw new ApiError('No image provided', 400);
    }

    // Get theme from request
    const theme = req.body.theme || 'Modern';
    
    // Get file path
    const imagePath = req.file.path;
    
    logger.info(`Generating design with theme: ${theme}`);
    
    // Generate design
    const result = await designService.generateInteriorDesign(imagePath, theme);
    
    // Return result
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

