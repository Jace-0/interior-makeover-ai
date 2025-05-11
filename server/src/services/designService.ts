import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';
import { ApiError } from '../utils/errorHandler';
import { DesignResult } from '../../../shared/types';


// Get directory path in a CommonJS-compatible way
const currentDir = process.cwd();
// Path for storing results
const RESULTS_DIR = path.resolve(currentDir, '../uploads/results');

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

/**
 * Generate interior design using Replicate API
 */
export const generateInteriorDesign = async (
  imagePath: string, 
  theme: string
): Promise<DesignResult> => {
  try {
    // Check if API token exists
    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
      throw new ApiError('API token not configured', 500);
    }

    // Read image file
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Create prompt based on theme
    const prompt = `Interior design in ${theme} style, professional photography, interior design magazine quality, detailed furniture and decor`;

    // Call Replicate API
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316',
        input: {
          prompt,
          negative_prompt: 'low quality, blurry, distorted proportions, unrealistic',
          image: `data:image/jpeg;base64,${base64Image}`,
          guidance_scale: 7.5,
          num_inference_steps: 30,
          controlnet_conditioning_scale: 0.8,
          control_mode: 'canny'
        }
      },
      {
        headers: {
          'Authorization': `Token ${apiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Get prediction ID
    const predictionId = response.data.id;
    
    // Poll for results
    const result = await pollForResult(predictionId, apiToken);
    
    // Generate unique ID for this design
    const designId = uuidv4();
    
    // Download and save the result image
    const imageResponse = await axios.get(result.output, { responseType: 'arraybuffer' });
    const resultPath = path.join(RESULTS_DIR, `${designId}.jpg`);
    fs.writeFileSync(resultPath, imageResponse.data);
    
    // Create result object
    const designResult: DesignResult = {
      id: designId,
      originalImage: imagePath,
      resultImage: `/api/redesign/${designId}`,
      theme,
      createdAt: new Date().toISOString()
    };
    
    return designResult;
  } catch (error) {
    logger.error('Error generating design:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to generate design', 500);
  }
};

/**
 * Poll Replicate API for result
 */
const pollForResult = async (predictionId: string, apiToken: string) => {
  const maxAttempts = 30;
  const pollingInterval = 2000; // 2 seconds
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await axios.get(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        headers: {
          'Authorization': `Token ${apiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const prediction = response.data;
    
    if (prediction.status === 'succeeded') {
      return prediction;
    } else if (prediction.status === 'failed') {
      throw new ApiError(`Prediction failed: ${prediction.error}`, 500);
    }
    
    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, pollingInterval));
  }
  
  throw new ApiError('Prediction timed out', 504);
};
