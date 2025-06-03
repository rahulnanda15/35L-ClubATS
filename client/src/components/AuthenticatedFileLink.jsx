import React, { useState } from 'react';
import apiClient from '../utils/api';

const AuthenticatedFileLink = ({ href, children, filename, style, ...props }) => {
  const [downloading, setDownloading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    
    if (!href || downloading) return;

    setDownloading(true);
    
    try {
      // Use our API client to fetch with authentication
      const response = await fetch(href, {
        headers: {
          'Authorization': `Bearer ${apiClient.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
      
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      style={{
        ...style,
        cursor: downloading ? 'wait' : 'pointer',
        opacity: downloading ? 0.7 : 1
      }}
      {...props}
    >
      {downloading ? 'Downloading...' : children}
    </a>
  );
};

export default AuthenticatedFileLink; 