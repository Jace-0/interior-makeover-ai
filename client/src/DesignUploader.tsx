import React, { type ChangeEvent, type FormEvent, useState } from 'react';
import { generateDesign } from './services/api';
// import './DesignUploader.css';

const themes: string [] = [
  'Minimalist Scandinavian',
  'Modern Industrial',
  'Bohemian',
  'Mid-Century Modern',
  'Contemporary',
  'Traditional',
  'Rustic Farmhouse',
  'Art Deco',
  'Coastal',
  'Japanese Zen'
];

const DesignUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>(themes[0]);
  const [resultImage, setResultImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) : void => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0]
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultImage('');
      setError('');
    }
  };

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedTheme(event.target.value);
  };

  const handleSubmit = async (event : FormEvent<HTMLFormElement>) : Promise <void> => {
    event.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }
    
    setIsLoading(true);
    
    // const formData = new FormData();
    // formData.append('image', selectedFile);
    // formData.append('theme', selectedTheme);


    
    try {
      const data = {
        image: selectedFile, 
        theme: selectedTheme
      }

      const response = await generateDesign(data)
      
      console.log('Response image', response)
      // const imageUrl = URL.createObjectURL(response.resultImage);
      // setResultImage(imageUrl);
      setError('');
    } catch (err) {
      console.error('Error generating design:', err);
      setError('Failed to generate design. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="design-uploader">
      <h2>AI Interior Designer</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="upload-section">
          <label htmlFor="room-image" className="upload-label">
            {previewUrl ? (
              <img src={previewUrl} alt="Room preview" className="preview-image" />
            ) : (
              <div className="upload-placeholder">
                <i className="upload-icon">📷</i>
                <span>Upload room photo</span>
              </div>
            )}
          </label>
          <input
            type="file"
            id="room-image"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>
        
        <div className="theme-selector">
          <label htmlFor="theme">Select Design Theme:</label>
          <select
            id="theme"
            value={selectedTheme}
            onChange={handleThemeChange}
            disabled={isLoading}
          >
            {themes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          type="submit" 
          className="generate-btn"
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Design'}
        </button>
        
        {error && <p className="error-message">{error}</p>}
      </form>
      
      {resultImage && (
        <div className="results-section">
          <h3>Your Redesigned Room</h3>
          <div className="comparison">
            <div className="before">
              <h4>Before</h4>
              <img src={previewUrl} alt="Original room" />
            </div>
            <div className="after">
              <h4>After</h4>
              <img src={resultImage} alt="Redesigned room" />
            </div>
          </div>
          <a 
            href={resultImage} 
            download="redesigned-room.jpg"
            className="download-btn"
          >
            Download Result
          </a>
        </div>
      )}
    </div>
  );
};

export default DesignUploader;