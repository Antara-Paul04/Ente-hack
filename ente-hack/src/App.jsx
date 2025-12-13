import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import heartIcon from './assets/images/heart.svg';
import ducky_base from './assets/duckies/ducky_base.svg';
import { categories } from './categories';
import { categoryOptions } from './categoryOptions';
import { randomizeAvatar } from './randomizer';

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('glasses');
  const [selectedItems, setSelectedItems] = useState({
    cap: null,
    glasses: null,
    accessories: null,
    shoes: null
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const avatarRef = useRef(null);
  const canvasRef = useRef(null);

  // Create canvas for rendering avatar
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    canvasRef.current = canvas;
  }, []);

  // Handle category click with randomizer
  const handleCategoryClick = (categoryId) => {
    if (categoryId === 'random') {
      const randomItems = randomizeAvatar(categoryOptions);
      setSelectedItems(randomItems);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  // Handle option selection
  const handleOptionClick = (category, optionId) => {
    setSelectedItems(prev => ({
      ...prev,
      [category]: prev[category] === optionId ? null : optionId
    }));
  };

  // Get current category options
  const getCurrentOptions = () => {
    if (selectedCategory === 'random') {
      return [];
    }
    return categoryOptions[selectedCategory] || [];
  };

  // Render avatar to canvas for download
  const renderAvatarToCanvas = async () => {
    if (!canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create a temporary container for rendering
    const tempContainer = document.createElement('div');
    tempContainer.style.width = `${canvas.width}px`;
    tempContainer.style.height = `${canvas.height}px`;
    tempContainer.style.position = 'relative';
    document.body.appendChild(tempContainer);
    
    // Function to load an image
    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };
    
    try {
      // Load base image
      const baseImage = await loadImage(ducky_base);
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      
      // Load and draw selected items
      const categoriesToRender = ['cap', 'glasses', 'shoes', 'accessories'];
      
      for (const category of categoriesToRender) {
        const selectedId = selectedItems[category];
        if (selectedId && categoryOptions[category]) {
          const option = categoryOptions[category].find(item => item.id === selectedId);
          if (option) {
            const overlayImage = await loadImage(option.src);
            ctx.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);
          }
        }
      }
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error rendering avatar:', error);
      return null;
    } finally {
      document.body.removeChild(tempContainer);
    }
  };

  // Download avatar as PNG
  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Render avatar to canvas
      const dataUrl = await renderAvatarToCanvas();
      
      if (dataUrl) {
        // Create download link
        const link = document.createElement('a');
        link.download = 'ducky-drip-avatar.png';
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download avatar. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Render avatar preview
  const renderAvatar = (size = "normal") => {
    const scale = size === "large" ? 1 : 1;
    const baseSize = 500 * scale;

    return (
      <div
        ref={size === "normal" ? avatarRef : null}
        className="avatar-container"
        style={{
          width: baseSize,
          height: baseSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative"
        }}
      >
        {/* Base Avatar */}
        <img
          src={ducky_base}
          alt="Ducky avatar"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
        
        {/* Selected Cap Overlay */}
        {selectedItems.cap && categoryOptions.cap && (
          <img
            src={categoryOptions.cap.find(item => item.id === selectedItems.cap)?.src}
            alt="Selected cap"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              pointerEvents: "none"
            }}
          />
        )}

        {/* Selected Glasses Overlay */}
        {selectedItems.glasses && categoryOptions.glasses && (
          <img
            src={categoryOptions.glasses.find(item => item.id === selectedItems.glasses)?.src}
            alt="Selected glasses"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              pointerEvents: "none"
            }}
          />
        )}

        {/* Selected Shoes Overlay */}
        {selectedItems.shoes && categoryOptions.shoes && (
          <img
            src={categoryOptions.shoes.find(item => item.id === selectedItems.shoes)?.src}
            alt="Selected shoes"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              pointerEvents: "none"
            }}
          />
        )}

        {/* Selected Accessories Overlay */}
        {selectedItems.accessories && categoryOptions.accessories && (
          <img
            src={
              categoryOptions.accessories.find(
                item => item.id === selectedItems.accessories
              )?.src
            }
            alt="Selected accessory"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              pointerEvents: "none"
            }}
          />
        )}

      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="main-wrapper">
        {/* Header */}
        <div className="header">
          <p className="title">
            Ducky Drip <span className="reg">®️</span>
          </p>

          <p className="subtitle">
            Crafted with
            <img src={heartIcon} alt="heart" className="heart-icon" />
            by{" "}
            <a
              href="https://ente.io"
              target="_blank"
              rel="noopener noreferrer"
              className="ente-link"
            >
              ente
            </a>
          </p>
        </div>

        {/* Left Panel */}
        <div className="customization-panel">
          <div className="category-icons">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`category-icon-btn ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                title={category.label}
              >
                <span className="icon">
                  <img src={category.icon} alt={category.label} />
                </span>
              </button>
            ))}
          </div>

          {/* Option Cards - displays current category options */}
          <div className="options-card-container">
            {getCurrentOptions().map((option) => (
              <div
                key={option.id}
                onClick={() => handleOptionClick(selectedCategory, option.id)}
                className={`option-card ${
                  selectedItems[selectedCategory] === option.id ? "selected" : ""
                }`}
              >
                <img 
                  src={option.src} 
                  alt={option.label}
                  className="option-card-image"
                />
              </div>
            ))}
          </div>
          
          {/* Download Button */}
          <div className="download-btn-container">
            <button 
              className="download-btn"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                'Downloading...'
              ) : (
                <>
                  <svg className="download-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16L12 4M12 16L8 12M12 16L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 20H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Download Avatar
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="preview-panel">
        <div className="avatar-preview-box">{renderAvatar()}</div>
      </div>
      
      {/* Success Message */}
      {showSuccess && (
        <div className="download-success">
          Avatar downloaded successfully!
        </div>
      )}
    </div>
  );
};

export default App;