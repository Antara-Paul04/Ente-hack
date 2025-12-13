import React, { useState } from 'react';
import { Download, Share2, Shuffle, RotateCcw } from 'lucide-react';
import './App.css';

const App = () => {
  const [selectedOptions, setSelectedOptions] = useState({
    face: 0,
    eyes: 0,
    mouth: 0,
    hair: 0,
    accessories: 0,
    clothes: 0,
    background: 0
  });

  const [showShareCard, setShowShareCard] = useState(false);

  // Avatar component options with random shapes
  const avatarOptions = {
    face: [
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
    eyes: [
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
    mouth: [
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
    hair: [
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
    accessories: [
      { type: 'none', color: 'transparent' },
      { type: 'glasses', color: '#2C3E50' },
      { type: 'sunglasses', color: '#34495E' },
      { type: 'hat', color: '#E74C3C' },
      { type: 'crown', color: '#F39C12' },
      { type: 'bow', color: '#E91E63' },
      { type: 'headband', color: '#9B59B6' },
      { type: 'earrings', color: '#FFD700' },
      { type: 'mask', color: '#1ABC9C' },
      { type: 'bandana', color: '#E67E22' }
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
      { type: 'shirt', color: '#F39C12' },
      { type: 'vest', color: '#C0392B' }
    ],
    background: [
      { color: '#FFE5E5', pattern: 'solid' },
      { color: '#E5F3FF', pattern: 'solid' },
      { color: '#E8F5E9', pattern: 'solid' },
      { color: '#FFF8E1', pattern: 'solid' },
      { color: '#F3E5F5', pattern: 'solid' },
      { color: '#E0F2F1', pattern: 'solid' },
      { color: '#FBE9E7', pattern: 'dots' },
      { color: '#E8EAF6', pattern: 'dots' },
      { color: '#F1F8E9', pattern: 'lines' },
      { color: '#FFF3E0', pattern: 'grid' }
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
      accessories: Math.floor(Math.random() * 10),
      clothes: Math.floor(Math.random() * 10),
      background: Math.floor(Math.random() * 10)
    });
  };

  const reset = () => {
    setSelectedOptions({
      face: 0,
      eyes: 0,
      mouth: 0,
      hair: 0,
      accessories: 0,
      clothes: 0,
      background: 0
    });
  };

  const downloadAvatar = () => {
    // Simple download simulation
    alert('Download functionality would save the avatar as an image!');
  };

  const shareAvatar = () => {
    setShowShareCard(true);
  };

  // Render avatar based on selected options
  const renderAvatar = (size = 'normal') => {
    const scale = size === 'large' ? 1.5 : 1;
    const baseSize = 200 * scale;
    
    const face = avatarOptions.face[selectedOptions.face];
    const eyes = avatarOptions.eyes[selectedOptions.eyes];
    const mouth = avatarOptions.mouth[selectedOptions.mouth];
    const hair = avatarOptions.hair[selectedOptions.hair];
    const accessories = avatarOptions.accessories[selectedOptions.accessories];
    const clothes = avatarOptions.clothes[selectedOptions.clothes];
    const background = avatarOptions.background[selectedOptions.background];

    return (
      <div className="avatar-container" style={{
        width: `${baseSize}px`,
        height: `${baseSize}px`,
        backgroundColor: background.color,
        backgroundImage: background.pattern === 'dots' ? 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)' :
                         background.pattern === 'lines' ? 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)' :
                         background.pattern === 'grid' ? 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)' : 'none',
        backgroundSize: background.pattern === 'dots' ? '20px 20px' :
                       background.pattern === 'grid' ? '20px 20px' : 'auto',
      }}>
        {/* Clothes */}
        <div className="avatar-clothes" style={{
          width: `${baseSize * 0.7}px`,
          height: `${baseSize * 0.35}px`,
          backgroundColor: clothes.color,
          borderRadius: clothes.type === 'tshirt' ? '20% 20% 0 0' :
                        clothes.type === 'hoodie' ? '40% 40% 0 0' :
                        clothes.type === 'dress' ? '50% 50% 0 0' : '10% 10% 0 0'
        }} />

        {/* Face */}
        <div className="avatar-face" style={{
          width: `${baseSize * 0.5}px`,
          height: `${baseSize * 0.6}px`,
          backgroundColor: face.color,
          borderRadius: face.shape === 'circle' ? '50%' :
                        face.shape === 'rounded' ? '45%' :
                        face.shape === 'square' ? '15%' : '50%',
        }} />

        {/* Hair */}
        <div className="avatar-hair" style={{
          top: hair.type === 'bun' ? '10%' : '18%',
          width: hair.type === 'mohawk' ? `${baseSize * 0.15}px` :
                 hair.type === 'bun' ? `${baseSize * 0.25}px` : `${baseSize * 0.55}px`,
          height: hair.type === 'bun' ? `${baseSize * 0.25}px` :
                  hair.type === 'spiky' ? `${baseSize * 0.25}px` : `${baseSize * 0.3}px`,
          backgroundColor: hair.color,
          borderRadius: hair.type === 'curly' ? '50% 50% 20% 20%' :
                        hair.type === 'bob' ? '50% 50% 10% 10%' :
                        hair.type === 'bun' ? '50%' :
                        hair.type === 'afro' ? '50%' :
                        hair.type === 'spiky' ? '50% 50% 0 0' : '40% 40% 0 0',
          clipPath: hair.type === 'spiky' ? 'polygon(0% 80%, 10% 0%, 20% 80%, 30% 10%, 40% 80%, 50% 0%, 60% 80%, 70% 10%, 80% 80%, 90% 0%, 100% 80%, 100% 100%, 0% 100%)' :
                   hair.type === 'messy' ? 'polygon(5% 50%, 15% 10%, 25% 60%, 35% 20%, 45% 70%, 55% 15%, 65% 65%, 75% 25%, 85% 55%, 95% 30%, 100% 100%, 0% 100%)' : 'none'
        }}>
          {hair.type === 'ponytail' && (
            <div className="ponytail" style={{
              width: `${baseSize * 0.15}px`,
              height: `${baseSize * 0.3}px`,
              backgroundColor: hair.color,
            }} />
          )}
        </div>

        {/* Eyes */}
        <div className="avatar-eyes" style={{
          width: `${baseSize * 0.4}px`,
          height: `${baseSize * 0.1}px`,
        }}>
          {eyes.type === 'dots' && (
            <>
              <div className="eye-dot" style={{ backgroundColor: eyes.color }} />
              <div className="eye-dot" style={{ backgroundColor: eyes.color }} />
            </>
          )}
          {eyes.type === 'circles' && (
            <>
              <div className="eye-circle" style={{ border: `3px solid ${eyes.color}` }} />
              <div className="eye-circle" style={{ border: `3px solid ${eyes.color}` }} />
            </>
          )}
          {eyes.type === 'stars' && (
            <>
              <div className="eye-star" style={{ color: eyes.color }}>★</div>
              <div className="eye-star" style={{ color: eyes.color }}>★</div>
            </>
          )}
          {eyes.type === 'hearts' && (
            <>
              <div className="eye-heart" style={{ color: eyes.color }}>♥</div>
              <div className="eye-heart" style={{ color: eyes.color }}>♥</div>
            </>
          )}
          {eyes.type === 'squares' && (
            <>
              <div className="eye-square" style={{ backgroundColor: eyes.color }} />
              <div className="eye-square" style={{ backgroundColor: eyes.color }} />
            </>
          )}
          {eyes.type === 'triangles' && (
            <>
              <div className="eye-triangle" style={{ borderBottom: `14px solid ${eyes.color}` }} />
              <div className="eye-triangle" style={{ borderBottom: `14px solid ${eyes.color}` }} />
            </>
          )}
          {eyes.type === 'lines' && (
            <>
              <div className="eye-line" style={{ backgroundColor: eyes.color }} />
              <div className="eye-line" style={{ backgroundColor: eyes.color }} />
            </>
          )}
          {eyes.type === 'crescents' && (
            <>
              <div className="eye-crescent" style={{ color: eyes.color }}>⌢</div>
              <div className="eye-crescent" style={{ color: eyes.color }}>⌢</div>
            </>
          )}
          {eyes.type === 'crosses' && (
            <>
              <div className="eye-cross" style={{ color: eyes.color }}>+</div>
              <div className="eye-cross" style={{ color: eyes.color }}>+</div>
            </>
          )}
          {eyes.type === 'sparkles' && (
            <>
              <div className="eye-sparkle" style={{ color: eyes.color }}>✦</div>
              <div className="eye-sparkle" style={{ color: eyes.color }}>✦</div>
            </>
          )}
        </div>

        {/* Mouth */}
        <div className="avatar-mouth">
          {mouth.type === 'smile' && (
            <div className="mouth-smile" style={{ borderColor: mouth.color }} />
          )}
          {mouth.type === 'grin' && (
            <div className="mouth-grin" style={{ backgroundColor: mouth.color }} />
          )}
          {mouth.type === 'line' && (
            <div className="mouth-line" style={{ backgroundColor: mouth.color }} />
          )}
          {mouth.type === 'wave' && (
            <div className="mouth-wave" style={{ color: mouth.color }}>~</div>
          )}
          {mouth.type === 'circle' && (
            <div className="mouth-circle" style={{ borderColor: mouth.color }} />
          )}
          {mouth.type === 'triangle' && (
            <div className="mouth-triangle" style={{ borderTop: `20px solid ${mouth.color}` }} />
          )}
          {mouth.type === 'heart' && (
            <div className="mouth-heart" style={{ color: mouth.color }}>♥</div>
          )}
          {mouth.type === 'zigzag' && (
            <div className="mouth-zigzag" style={{ color: mouth.color }}>⌇</div>
          )}
          {mouth.type === 'dots' && (
            <div className="mouth-dots-container">
              <div className="mouth-dot" style={{ backgroundColor: mouth.color }} />
              <div className="mouth-dot" style={{ backgroundColor: mouth.color }} />
              <div className="mouth-dot" style={{ backgroundColor: mouth.color }} />
            </div>
          )}
          {mouth.type === 'curved' && (
            <svg width="40" height="20">
              <path d="M 0 10 Q 20 20 40 10" stroke={mouth.color} strokeWidth="3" fill="none" />
            </svg>
          )}
        </div>

        {/* Accessories */}
        {accessories.type === 'glasses' && (
          <div className="accessory-glasses" style={{
            width: `${baseSize * 0.45}px`,
          }}>
            <div className="glass-lens" style={{ border: `3px solid ${accessories.color}` }} />
            <div className="glass-bridge" style={{ backgroundColor: accessories.color }} />
            <div className="glass-lens" style={{ border: `3px solid ${accessories.color}` }} />
          </div>
        )}
        {accessories.type === 'sunglasses' && (
          <div className="accessory-sunglasses" style={{
            width: `${baseSize * 0.45}px`,
          }}>
            <div className="sunglass-lens" style={{ backgroundColor: accessories.color }} />
            <div className="sunglass-bridge" style={{ backgroundColor: accessories.color }} />
            <div className="sunglass-lens" style={{ backgroundColor: accessories.color }} />
          </div>
        )}
        {accessories.type === 'hat' && (
          <div className="accessory-hat">
            <div className="hat-top" style={{
              width: `${baseSize * 0.4}px`,
              backgroundColor: accessories.color,
            }} />
            <div className="hat-brim" style={{
              width: `${baseSize * 0.5}px`,
              backgroundColor: accessories.color,
            }} />
          </div>
        )}
        {accessories.type === 'crown' && (
          <div className="accessory-crown" style={{ color: accessories.color }}>♔</div>
        )}
        {accessories.type === 'bow' && (
          <div className="accessory-bow" style={{ color: accessories.color }}>🎀</div>
        )}
        {accessories.type === 'headband' && (
          <div className="accessory-headband" style={{
            width: `${baseSize * 0.5}px`,
            backgroundColor: accessories.color,
          }} />
        )}
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="main-wrapper">
        {/* Header */}
        <div className="header">
          <h1 className="title">Avatar Factory</h1>
          <p className="subtitle">Design your unique character</p>
        </div>

        {/* Main Content */}
        <div className="content-grid">
          {/* Avatar Preview */}
          <div className="preview-section">
            <div className="avatar-preview">
              {renderAvatar()}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button onClick={randomize} className="btn btn-shuffle">
                <Shuffle size={18} /> Shuffle
              </button>
              <button onClick={reset} className="btn btn-reset">
                <RotateCcw size={18} /> Reset
              </button>
            </div>

            <div className="share-buttons">
              <button onClick={downloadAvatar} className="btn btn-download">
                <Download size={20} /> Download
              </button>
              <button onClick={shareAvatar} className="btn btn-share">
                <Share2 size={20} /> Share
              </button>
            </div>
          </div>

          {/* Customization Options */}
          <div className="customization-section">
            <h2 className="customization-title">Customize</h2>

            {Object.keys(avatarOptions).map((category) => (
              <div key={category} className="category-section">
                <h3 className="category-title">{category}</h3>
                <div className="options-grid">
                  {avatarOptions[category].map((option, index) => (
                    <button
                      key={index}
                      onClick={() => updateOption(category, index)}
                      className={`option-button ${selectedOptions[category] === index ? 'selected' : ''}`}
                      style={{
                        backgroundColor: option.color || option.type === 'none' ? (option.color === 'transparent' ? '#f0f0f0' : option.color) : '#fff',
                      }}
                    >
                      {option.type === 'none' ? '—' : ''}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share Card Modal */}
        {showShareCard && (
          <div className="modal-overlay" onClick={() => setShowShareCard(false)}>
            <div className="share-card" onClick={(e) => e.stopPropagation()}>
              <h2 className="share-card-title">My Avatar</h2>
              
              <div className="share-card-avatar">
                {renderAvatar('large')}
              </div>

              <p className="share-card-text">
                Created with Avatar Factory ✨
              </p>

              <button onClick={() => setShowShareCard(false)} className="btn btn-close">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;