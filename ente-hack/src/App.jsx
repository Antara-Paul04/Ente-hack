import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import heartIcon from './assets/images/heart.svg';
import shareIcon from './assets/images/share.svg';
import downloadIcon from './assets/images/download.svg';
import randomIcon from './assets/images/random.svg';
import ducky_base from './assets/duckies/ducky_base.svg';
import duckyStand from './ducky stand.svg';
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
  const [downloadSlang, setDownloadSlang] = useState('');

  const DOWNLOAD_SLANGS = [
    'Secure the drip 🔥',
    'Main character moment 💅',
    'No cap, save it 🧢',
    'Ate and left no crumbs ✨',
    'It\'s giving downloads 👏',
    'Understood the assignment 🎯',
    'Bussin\' fr fr 😤',
    'Rizz to camera roll 📸',
    'Periodt. Save it. 💯',
    'Caught in 4K 👀',
    'Slay and save bestie 🦋',
    'That\'s lowkey fire 🫶',
    'We\'re so back 🐥',
    'This slaps, keep it 🎵',
    'Not me obsessed 😭',
  ];
  const [showShareCard, setShowShareCard] = useState(false);
  const [shareCardItems, setShareCardItems] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [duckyLanding, setDuckyLanding] = useState(false);
  const [previewItems, setPreviewItems] = useState(null);
  
  const avatarRef = useRef(null);
  const canvasRef = useRef(null);

  // Create canvas for rendering avatar
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 4096;
    canvasRef.current = canvas;
  }, []);

  // Handle category click with randomizer
  const handleCategoryClick = (categoryId) => {
    if (categoryId === 'random') {
      handleRandomize();
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
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgAspect;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgAspect;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      }

      // Draw stand first so it's behind the ducky
      const standImage = await loadImage(duckyStand);
      const standWidth = drawWidth * 0.88;
      const standX = offsetX + (drawWidth - standWidth) / 2;
      const standY = offsetY + drawHeight * 0.72;
      ctx.drawImage(standImage, standX, standY, standWidth, drawHeight * 0.32);

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

  // Randomize handler — smooth slot-machine animation
  const handleRandomize = () => {
    if (isShuffling) return;
    setIsShuffling(true);

    const cats = ['cap', 'glasses', 'accessories', 'shoes'];
    const finalItems = randomizeAvatar(categoryOptions);

    // 10 unique random frames per category (no repeats feel)
    const shuffleFrames = {};
    cats.forEach(cat => {
      const opts = categoryOptions[cat];
      const shuffled = [...opts].sort(() => Math.random() - 0.5);
      shuffleFrames[cat] = shuffled.slice(0, 10).map(o => o.id);
    });

    // Categories lock in sequence: cap first, shoes last
    const ticks = 18;
    const lockTick = { cap: 10, glasses: 13, accessories: 15, shoes: 18 };

    // Cubic ease-out: starts snappy (~35ms), ends slow (~150ms) ≈ 1.4s total
    let cumDelay = 0;
    for (let i = 1; i <= ticks; i++) {
      const t = i / ticks;
      const interval = 35 + Math.pow(t, 3) * 115;
      cumDelay += interval;
      const tick = i;

      setTimeout(() => {
        const next = {};
        cats.forEach(cat => {
          if (tick <= lockTick[cat]) {
            next[cat] = shuffleFrames[cat][tick % shuffleFrames[cat].length];
          } else {
            next[cat] = finalItems[cat];
          }
        });
        setPreviewItems(next);

        if (tick === ticks) {
          setSelectedItems(finalItems);
          setPreviewItems(null);
          setIsShuffling(false);
          setDuckyLanding(true);
          setTimeout(() => setDuckyLanding(false), 500);
        }
      }, cumDelay);
    }
  };

  // Share handler — show user's ducky if they picked anything, else random
  const handleShare = () => {
    const hasSelection = Object.values(selectedItems).some(Boolean);
    setShareCardItems(hasSelection ? selectedItems : randomizeAvatar(categoryOptions));
    setShowShareCard(true);
  };

  // Native share from share card
  const handleNativeShare = async () => {
    try {
      const dataUrl = await renderAvatarToCanvas();
      if (dataUrl && navigator.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'ducky-drip-avatar.png', { type: 'image/png' });
        await navigator.share({ title: 'My Ducky Drip Avatar', files: [file] });
      } else {
        alert('Share is not available on this device.');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  // Toggle download menu
  const handleDownloadClick = () => {
    setDownloadSlang(DOWNLOAD_SLANGS[Math.floor(Math.random() * DOWNLOAD_SLANGS.length)]);
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
        'ducky-drip-avatar-bg.png',
        duckyStand
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
    const displayItems = previewItems || selectedItems;
    return (
      <div
        ref={avatarRef}
        className={`avatar-container${duckyLanding ? ' ducky-landing' : ''}`}
      >
        {/* Stand — rendered first so it's behind the ducky */}
        <img
          src={duckyStand}
          alt="Ducky stand"
          className="ducky-stand"
        />

        {/* Ducky + overlays wrapper */}
        <div className={`ducky-wrapper${isShuffling ? ' squishing' : ''}`}>
        {/* Base Avatar */}
        <img
          src={ducky_base}
          alt="Ducky avatar"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />

        {/* Selected Cap Overlay */}
        {displayItems.cap && categoryOptions.cap && (
          <img
            key={`cap-${displayItems.cap}`}
            src={categoryOptions.cap.find(item => item.id === displayItems.cap)?.src}
            alt="Selected cap"
            className={previewItems ? 'accessory-shuffle' : 'accessory-overlay'}
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
        {displayItems.glasses && categoryOptions.glasses && (
          <img
            key={`glasses-${displayItems.glasses}`}
            src={categoryOptions.glasses.find(item => item.id === displayItems.glasses)?.src}
            alt="Selected glasses"
            className={previewItems ? 'accessory-shuffle' : 'accessory-overlay'}
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
        {displayItems.shoes && categoryOptions.shoes && (
          <img
            key={`shoes-${displayItems.shoes}`}
            src={categoryOptions.shoes.find(item => item.id === displayItems.shoes)?.src}
            alt="Selected shoes"
            className={previewItems ? 'accessory-shuffle' : 'accessory-overlay'}
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
        {displayItems.accessories && categoryOptions.accessories && (
          <img
            key={`accessories-${displayItems.accessories}`}
            src={
              categoryOptions.accessories.find(
                item => item.id === displayItems.accessories
              )?.src
            }
            alt="Selected accessory"
            className={previewItems ? 'accessory-shuffle' : 'accessory-overlay'}
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
      </div>
    );
  };

  // Filter out 'random' from visible categories (it's the dice button)
  const displayCategories = categories.filter(cat => cat.id !== 'random');
  const currentOptions = getCurrentOptions();

  return (
    <div className="app-container">
      <section className="preview-panel">
        <div className="preview-shell">
          <div className="header">
            <h1 className="title">
              Ducky Drip<span className="reg">®</span>
            </h1>
            <p className="subtitle">
              Crafted with
              <img src={heartIcon} alt="heart" className="heart-icon" />
              by{" "}
              <a
                href="https://ente.io/?utm_source=duckyDrip"
                target="_blank"
                rel="noopener noreferrer"
                className="ente-link"
              >
                ente
              </a>
            </p>
          </div>

          <div className="preview-wrapper">
            <div className="preview-box">
              <div className="avatar-preview-box">
                {renderAvatar()}
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="action-btn action-btn-primary" onClick={handleRandomize} title="Randomize" disabled={isShuffling}>
              {isShuffling ? <span className="circle-loader" /> : <img src={randomIcon} alt="Randomize" className="action-icon" />}
              <span>{isShuffling ? 'Shuffling…' : 'Randomize'}</span>
            </button>
            <button className="action-btn" onClick={handleShare} title="Share">
              <img src={shareIcon} alt="Share" className="action-icon" />
              <span>Share</span>
            </button>

            <button
              className="action-btn action-btn-strong"
              onClick={handleDownloadClick}
              title="Download"
              disabled={isDownloading}
            >
              <img src={downloadIcon} alt="Download" className="action-icon" />
              <span>{isDownloading ? 'Preparing...' : 'Download'}</span>
            </button>
          </div>
        </div>
      </section>

      <aside className="main-wrapper">
        <div className="customization-panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Dress up your ducky</h2>
            </div>
          </div>

          <div className="category-section">
            <div className="category-icons" role="tablist" aria-label="Customization categories">
              {displayCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`category-icon-btn ${
                    selectedCategory === category.id ? "active" : ""
                  }`}
                  title={category.label}
                  aria-pressed={selectedCategory === category.id}
                >
                  <span className="icon">
                    <img src={category.icon} alt={category.label} />
                  </span>
                  <span className="category-label">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="options-section">
            <div key={selectedCategory} className={`options-card-container category-${selectedCategory}`}>
              {currentOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(selectedCategory, option.id)}
                  className={`option-card ${
                    selectedItems[selectedCategory] === option.id ? "selected" : ""
                  }`}
                  type="button"
                  aria-pressed={selectedItems[selectedCategory] === option.id}
                >
                  <img
                    src={option.preview || option.src}
                    alt={option.label}
                    className="option-card-image"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
      
      {/* Share Card Modal */}
      {showShareCard && shareCardItems && (
        <div className="download-modal-overlay" onClick={() => setShowShareCard(false)}>
          <div className="share-card-modal" onClick={e => e.stopPropagation()}>
            <button className="download-modal-close" onClick={() => setShowShareCard(false)}>✕</button>

            <div className="share-card-preview">
              <div className="share-card-avatar">
                <img src={ducky_base} alt="" />
                {['cap','glasses','shoes','accessories'].map(cat =>
                  shareCardItems[cat] && categoryOptions[cat] ? (
                    <img key={cat} src={categoryOptions[cat].find(i => i.id === shareCardItems[cat])?.src} alt="" />
                  ) : null
                )}
              </div>
              <div className="share-card-brand">
                <span className="share-card-brand-title">Ducky Drip<sup>®</sup></span>
                <span className="share-card-brand-sub">Crafted by <a href="https://ente.io/about" target="_blank" rel="noopener noreferrer" className="share-card-brand-ente">ente designers</a></span>
              </div>
            </div>

            <div className="share-card-actions">
              <button className="share-card-btn share-card-btn-secondary" onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                Copy link
              </button>
              <button className="share-card-btn share-card-btn-primary" onClick={handleNativeShare}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Modal */}
      {showDownloadMenu && (
        <div className="download-modal-overlay" onClick={() => setShowDownloadMenu(false)}>
          <div className="download-modal" onClick={e => e.stopPropagation()}>
            <button className="download-modal-close" onClick={() => setShowDownloadMenu(false)}>✕</button>
            <h2 className="download-modal-title">{downloadSlang}</h2>
            <p className="download-modal-subtitle">Choose how you want to save your Ducky.</p>
            <div className="download-modal-actions">
              <button className="download-modal-btn download-modal-btn-primary" onClick={handleDownloadWithBg}>
                With background
              </button>
              <button className="download-modal-btn download-modal-btn-secondary" onClick={handleDownloadTransparent}>
                Without background
              </button>
            </div>
          </div>
        </div>
      )}

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
