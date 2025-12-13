import React, { useState, useRef } from 'react';
import './App.css';
import heartIcon from './assets/images/heart.svg';
import ducky_base from './assets/duckies/ducky_base.svg';
import { categories } from './categories';
import { categoryOptions } from './categoryOptions';
import { randomizeAvatar } from './randomizer';

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('glasses');
  
  // Independent state for each category
  const [selectedItems, setSelectedItems] = useState({
    cap: null,
    glasses: null,
    accessories: null,
    shoes: null
  });
  
  const avatarRef = useRef(null);

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

  // Render avatar based on selected options
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
            Ducky Drip <span className="reg">®</span>
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
        </div>
      </div>

      {/* Right Panel */}
      <div className="preview-panel">
        <div className="avatar-preview-box">{renderAvatar()}</div>
      </div>
    </div>
  );
};

export default App;