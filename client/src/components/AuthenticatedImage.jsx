import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';

const AuthenticatedImage = ({ src, alt, style, onError, ...props }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setLoading(false);
      setError(true);
      return;
    }

    const loadImage = async () => {
      try {
        // Extract the path from the full URL to use with our API client
        const urlPath = src.replace(/^https?:\/\/[^\/]+/, '');
        
        // Use our API client to fetch with authentication
        const response = await fetch(src, {
          headers: {
            'Authorization': `Bearer ${apiClient.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load image');
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setImageUrl(blobUrl);
        setLoading(false);
      } catch (err) {
        console.error('Error loading authenticated image:', err);
        setError(true);
        setLoading(false);
        if (onError) onError(err);
      }
    };

    loadImage();

    // Cleanup blob URL when component unmounts
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [src]);

  if (loading) {
    return (
      <div 
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          color: '#666'
        }}
        {...props}
      >
        Loading...
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div 
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          color: '#666',
          border: '2px dashed #ccc'
        }}
        {...props}
      >
        Photo unavailable
      </div>
    );
  }

  return (
    <img 
      src={imageUrl} 
      alt={alt} 
      style={style}
      {...props}
    />
  );
};

export default AuthenticatedImage; 