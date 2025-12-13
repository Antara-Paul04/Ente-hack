import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import heartIcon from './assets/images/heart.svg';
import shareIcon from './assets/images/share.svg';
import downloadIcon from './assets/images/download.svg';
import randomIcon from './assets/images/random.svg';
import ducky_base from './assets/duckies/ducky_base.svg';
import { categories } from './categories';
import { categoryOptions } from './categoryOptions';
import { randomizeAvatar } from './randomizer';
import { downloadAvatarWithBackground } from './downloadWithBg';

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
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  
  const avatarRef = useRef(null);
  const canvasRef = useRef(null);
  const downloadMenuRef = useRef(null);

  // Create canvas for rendering avatar
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    canvasRef.current = canvas;
  }, []);

  // Close download menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target)) {
        setShowDownloadMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  // Render avatar to canvas for transparent download
  const renderAvatarToCanvas = async () => {
    if (!canvasRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
      const baseImage = await loadImage(ducky_base);

      // Calculate dimensions to preserve aspect ratio (object-fit: contain)
      const imgAspect = baseImage.naturalWidth / baseImage.naturalHeight;
      const canvasAspect = canvas.width / canvas.height;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgAspect > canvasAspect) {
        // Image is wider than canvas - fit to width
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgAspect;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        // Image is taller than canvas - fit to height
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgAspect;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      }

      ctx.drawImage(baseImage, offsetX, offsetY, drawWidth, drawHeight);

      const categoriesToRender = ['cap', 'glasses', 'shoes', 'accessories'];

      for (const category of categoriesToRender) {
        const selectedId = selectedItems[category];
        if (selectedId && categoryOptions[category]) {
          const option = categoryOptions[category].find(item => item.id === selectedId);
          if (option) {
            const overlayImage = await loadImage(option.src);
            // Use same dimensions and offset for overlays
            ctx.drawImage(overlayImage, offsetX, offsetY, drawWidth, drawHeight);
          }
        }
      }

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error rendering avatar:', error);
      return null;
    }
  };

  // Randomize handler
  const handleRandomize = () => {
    const randomItems = randomizeAvatar(categoryOptions);
    setSelectedItems(randomItems);
  };

  // Share handler
  const handleShare = async () => {
    try {
      const dataUrl = await renderAvatarToCanvas();
      if (dataUrl && navigator.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'ducky-drip-avatar.png', { type: 'image/png' });
        await navigator.share({
          title: 'My Ducky Drip Avatar',
          files: [file]
        });
      } else {
        alert('Share functionality is not available on this device. Try downloading instead!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  // Toggle download menu
  const handleDownloadClick = () => {
    setShowDownloadMenu(!showDownloadMenu);
  };

  // Download transparent handler
  const handleDownloadTransparent = async () => {
    setIsDownloading(true);
    setShowDownloadMenu(false);
    
    try {
      const dataUrl = await renderAvatarToCanvas();
      
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = 'ducky-drip-avatar.png';
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
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

  // Download with background handler
  const handleDownloadWithBg = async () => {
    setIsDownloading(true);
    setShowDownloadMenu(false);
    
    try {
      const success = await downloadAvatarWithBackground(
        ducky_base,
        selectedItems,
        categoryOptions,
        'ducky-drip-avatar-bg.png'
      );
      
      if (success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert('Failed to download avatar. Please try again.');
      }
    } catch (error) {
      console.error('Download with background failed:', error);
      alert('Failed to download avatar. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Render avatar preview
  const renderAvatar = () => {
    return (
      <div
        ref={avatarRef}
        className="avatar-container"
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

  // Filter out 'random' from visible categories (it's the dice button)
  const displayCategories = categories.filter(cat => cat.id !== 'random');

  return (
    <div className="app-container">
      {/* Left Side */}
      <div className="main-wrapper">
        {/* Header */}
        <div className="header">
          <h1 className="title">
            Ducky Drip<span className="reg">®</span>
          </h1>
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

        {/* Customization Panel */}
        <div className="customization-panel">
          {/* Category Icons */}
          <div className="category-icons">
            {displayCategories.map((category) => (
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

          {/* Option Cards */}
          <div className={`options-card-container category-${selectedCategory}`}>
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
        </div>
      </div>

      {/* Right Side - Preview */}
      <div className="preview-panel">
        <div className="preview-wrapper">
          <div className="preview-box">
            <div className="avatar-preview-box">
              {renderAvatar()}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="action-btn" onClick={handleRandomize} title="Randomize">
              <img src={randomIcon} alt="Randomize" className="action-icon" />
            </button>
            <button className="action-btn" onClick={handleShare} title="Share">
              <img src={shareIcon} alt="Share" className="action-icon" />
            </button>
            
            {/* Download Button with Dropdown */}
            <div className="download-btn-wrapper" ref={downloadMenuRef}>
              <button 
                className="action-btn" 
                onClick={handleDownloadClick} 
                title="Download"
                disabled={isDownloading}
              >
                <img src={downloadIcon} alt="Download" className="action-icon" />
              </button>
              
              {/* Download Dropdown Menu */}
              {showDownloadMenu && (
                <div className="download-menu">
                  <button 
                    className="download-menu-item"
                    onClick={handleDownloadTransparent}
                  >
                    <span className="download-menu-icon">🔍</span>
                    <span className="download-menu-text">
                      <span className="download-menu-title">Transparent</span>
                      <span className="download-menu-subtitle">PNG with no background</span>
                    </span>
                  </button>
                  <button 
                    className="download-menu-item"
                    onClick={handleDownloadWithBg}
                  >
                    <span className="download-menu-icon">🎨</span>
                    <span className="download-menu-text">
                      <span className="download-menu-title">With Background</span>
                      <span className="download-menu-subtitle">PNG with blue gradient</span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
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