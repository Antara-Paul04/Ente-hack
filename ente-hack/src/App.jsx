import React, { useState, useRef } from 'react';
import './App.css';
import random from './assets/images/random.svg';
import glasses from './assets/images/glasses.svg';
import cap from './assets/images/cap.svg';
import hair from './assets/images/hair.svg';
import pants from './assets/images/pants.svg';
import shoe from './assets/images/shoe.svg';
import heartIcon from './assets/images/heart.svg';
import ducky_base from './assets/duckies/ducky_base.svg';
import policeHat from './assets/hats/police cap.svg';
import skydiverHat from './assets/hats/sky diving.svg';

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('glasses');
  const [selectedHat, setSelectedHat] = useState(null); // '1' or '2' or null
  const avatarRef = useRef(null);

  // Categories with icons
  const categories = [
    { 
      id: 'random', 
      label: 'Randomizer', 
      icon: <img src={random} alt="Randomizer" />
    },
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
      icon: <img src={hair} alt="Hair" />
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

  // Hat options
  const HatOptions = [
    { id: '1', src: policeHat, label: 'Police' },
    { id: '2', src: skydiverHat, label: 'Sky diver' }
  ];

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
        
        {/* Selected Hat Overlay */}
        {selectedHat && (
          <img
            src={selectedHat === '1' ? policeHat : skydiverHat}
            alt={`${selectedHat} hat`}
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

          {/* Option Cards for Hats */}
          <div className="options-card-container">
            {HatOptions.map((hat) => (
              <div
                key={hat.id}
                onClick={() => setSelectedHat(
                  selectedHat === hat.id ? null : hat.id
                )}
                className={`option-card ${
                  selectedHat === hat.id ? "selected" : ""
                }`}
              >
                <img 
                  src={hat.src} 
                  alt={hat.label}
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