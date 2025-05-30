import dotenv from 'dotenv';
import app from './app';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});