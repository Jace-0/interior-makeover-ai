import express from 'express';
import cors from 'cors';
import path from 'path';
import designRoutes from './routes/design';
import { errorHandler } from './middleware/errorMiddleware';
import logger from './utils/logger';

// Create Express app
const app = express();

// Get directory path in a CommonJS-compatible way
const currentDir = process.cwd();

console.log('Current Working Dir', currentDir)

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// API routes
app.use('/api', designRoutes);

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files
  app.use(express.static(path.resolve(currentDir, 'dist/client')));
  
  // Handle client-side routing
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/client/index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

export default app;