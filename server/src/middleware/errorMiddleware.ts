import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import logger from '../utils/logger';
import { ApiError } from '../utils/errorHandler';

/**
 * Global error handling middleware
 */

export const errorHandler: ErrorRequestHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {  // Explicitly return void instead of Response
  // Log the error
  logger.error(err.message, { stack: err.stack });
  
  // Check if it's a known API error
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: err.message
    });
    return;
  }
  
  // Handle multer errors
  if (err.name === 'MulterError') {
    res.status(400).json({
      error: err.message
    });
    return;
  }
  
  // Handle other errors
  res.status(500).json({
    error: 'Internal Server Error'
  });
};