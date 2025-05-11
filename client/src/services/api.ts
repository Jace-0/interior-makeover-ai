import axios from 'axios';
import type { DesignResult, DesignRequest } from '../../../shared/types';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Generate a new interior design
 */
export const generateDesign = async (data: DesignRequest): Promise <DesignResult> => {
  const formData = new FormData();
  formData.append('image', data.image);
  formData.append('theme', data.theme);
  
  const response = await api.post('/redesign', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};
