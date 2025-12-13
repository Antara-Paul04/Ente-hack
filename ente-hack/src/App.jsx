import React, { useState, useRef } from 'react';
import './App.css';
import random from './assets/images/random.svg';
import glasses from './assets/images/glasses.svg';
import cap from './assets/images/cap.svg';
import hair from './assets/images/hair.svg';
import pants from './assets/images/pants.svg';
import shoe from './assets/images/shoe.svg';
import heartIcon from './assets/images/heart.svg'
import ducky_base from './assets/duckies/ducky_base.svg';

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('face');
  const [selectedOptions, setSelectedOptions] = useState({
    face: 0,
    eyes: 0,
    mouth: 0,
    hair: 0,
    accessories: 0,
    clothes: 0
  });

  const [showShareCard, setShowShareCard] = useState(false);
  const avatarRef = useRef(null);

  // Categories with icons
  const categories = [
  { 
    id: 'random', 
    label: 'Randomizer', 
    icon: <img src={random} alt="Randomizer" />},
  
  { 
    id: 'glasses', 
    label: 'Glasses', 
    icon: <img src={glasses} alt="Glasses" />
  },
  { 
    id: 'cap', 
    label: 'Cap', 
    icon: <img src={cap} alt="Cap" />
  },

  { 
    id: 'hair', 
    label: 'Hair', 
    icon: <img src={hair} alt="Hair"  />
  },
  { 
    id: 'clothes', 
    label: 'Clothes', 
    icon: <img src={pants} alt="Clothes" />
  },

  { 
    id: 'shoes', 
    label: 'Shoes', 
    icon: <img src={shoe} alt="Shoes" />
  },
];


  // Avatar component options with random shapes
  const avatarOptions = {
    glasses: [
      { color: '#FFD4A3', shape: 'circle' },
      { color: '#F4A460', shape: 'circle' },
      { color: '#DEB887', shape: 'circle' },
      { color: '#FFDAB9', shape: 'rounded' },
      { color: '#E6B89C', shape: 'rounded' },
      { color: '#FFE4B5', shape: 'circle' },
      { color: '#FAEBD7', shape: 'square' },
      { color: '#F5DEB3', shape: 'rounded' },
      { color: '#FFE4C4', shape: 'circle' },
      { color: '#FFDEAD', shape: 'rounded' }
    ],
    cap: [
      { type: 'dots', color: '#2C3E50' },
      { type: 'circles', color: '#34495E' },
      { type: 'stars', color: '#E74C3C' },
      { type: 'hearts', color: '#E91E63' },
      { type: 'squares', color: '#3498DB' },
      { type: 'triangles', color: '#9B59B6' },
      { type: 'lines', color: '#1ABC9C' },
      { type: 'crescents', color: '#F39C12' },
      { type: 'crosses', color: '#E67E22' },
      { type: 'sparkles', color: '#16A085' }
    ],
    hair: [
      { type: 'smile', color: '#E74C3C' },
      { type: 'grin', color: '#C0392B' },
      { type: 'line', color: '#8E44AD' },
      { type: 'wave', color: '#E91E63' },
      { type: 'circle', color: '#F39C12' },
      { type: 'triangle', color: '#D35400' },
      { type: 'heart', color: '#EC407A' },
      { type: 'zigzag', color: '#9C27B0' },
      { type: 'dots', color: '#E67E22' },
      { type: 'curved', color: '#AB47BC' }
    ],
    clothes: [
      { type: 'spiky', color: '#2C3E50' },
      { type: 'curly', color: '#8B4513' },
      { type: 'wavy', color: '#FFD700' },
      { type: 'straight', color: '#A0522D' },
      { type: 'messy', color: '#E74C3C' },
      { type: 'bob', color: '#9B59B6' },
      { type: 'bun', color: '#34495E' },
      { type: 'ponytail', color: '#E67E22' },
      { type: 'afro', color: '#1ABC9C' },
      { type: 'mohawk', color: '#3498DB' }
    ],
    shoes: [
      { type: 'none', color: 'transparent' },
      { type: 'glasses', color: '#2C3E50' },
      { type: 'sunglasses', color: '#34495E' },
      { type: 'hat', color: '#E74C3C' },
      { type: 'crown', color: '#F39C12' },
      { type: 'bow', color: '#E91E63' },
      { type: 'headband', color: '#9B59B6' },
      { type: 'earrings', color: '#FFD700' },
      { type: 'mask', color: '#1ABC9C' }
    ],
    clothes: [
      { type: 'tshirt', color: '#3498DB' },
      { type: 'hoodie', color: '#E74C3C' },
      { type: 'suit', color: '#2C3E50' },
      { type: 'dress', color: '#E91E63' },
      { type: 'sweater', color: '#9B59B6' },
      { type: 'tank', color: '#1ABC9C' },
      { type: 'jacket', color: '#E67E22' },
      { type: 'polo', color: '#27AE60' },
      { type: 'shirt', color: '#F39C12' }
    ]
  };

  const updateOption = (category, index) => {
    setSelectedOptions(prev => ({ ...prev, [category]: index }));
  };

  const randomize = () => {
    setSelectedOptions({
      face: Math.floor(Math.random() * 10),
      eyes: Math.floor(Math.random() * 10),
      mouth: Math.floor(Math.random() * 10),
      hair: Math.floor(Math.random() * 10),
      accessories: Math.floor(Math.random() * 9),
      clothes: Math.floor(Math.random() * 9)
    });
  };

  const reset = () => {
    setSelectedOptions({
      face: 0,
      eyes: 0,
      mouth: 0,
      hair: 0,
      accessories: 0,
      clothes: 0
    });
  };

  const downloadAvatar = async () => {
    try {
      const avatarElement = avatarRef.current;
      if (!avatarElement) return;

      // Dynamically import html2canvas
      const html2canvas = (await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm')).default;
      
      // Convert to canvas
      const canvas = await html2canvas(avatarElement, {
        backgroundColor: null,
        scale: 3, // Higher quality
        logging: false,
        useCORS: true,
        width: 200,
        height: 200
      });

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `my-avatar-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
      
    } catch (error) {
      console.error('Error downloading avatar:', error);
      alert('Failed to download avatar. Please try again.');
    }
  };

  const shareAvatar = () => {
    setShowShareCard(true);
  };

  // Render avatar based on selected options
  const renderAvatar = (size = "normal") => {
  const scale = size === "large" ? 1 : 1;
  const baseSize = 300 * scale;

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
                onClick={() => setSelectedCategory(category.id)}
                className={`category-icon-btn ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                title={category.label}
              >
                <span className="icon">{category.icon}</span>
              </button>
            ))}
          </div>

          <div className="options-grid-container">
            {avatarOptions[selectedCategory]?.map((option, index) => (
              <button
                key={index}
                onClick={() => updateOption(selectedCategory, index)}
                className={`option-box ${
                  selectedOptions[selectedCategory] === index ? "selected" : ""
                }`}
                style={{
                  backgroundColor:
                    option.color && option.color !== "transparent"
                      ? option.color
                      : "#F5F5F5",
                }}
              >
                {option.type === "none" && (
                  <span className="none-text">—</span>
                )}
              </button>
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