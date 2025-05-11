/**
 * Design result interface
 */
export interface DesignResult {
  id: string;
  originalImage: string;
  resultImage: string;
  theme: string;
  createdAt: string;
}

/**
 * Design generation request interface
 */
export interface DesignRequest {
  theme: string;
  image: File;
}