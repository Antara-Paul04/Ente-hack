import { useState, useRef, useEffect } from 'react';
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
import AvatarPreview from './components/AvatarPreview';
import ShareModal from './components/ShareModal';
import DownloadModal from './components/DownloadModal';
import CategoryPanel from './components/CategoryPanel';
import OptionGrid from './components/OptionGrid';
import ConfettiCanvas from './components/ConfettiCanvas';

const DOWNLOAD_SLANGS = [
  'Secure the drip \u{1F525}',
  'Main character moment \u{1F485}',
  'No cap, save it \u{1F9E2}',
  'Ate and left no crumbs \u2728',
  'It\'s giving downloads \u{1F44F}',
  'Understood the assignment \u{1F3AF}',
  'Bussin\' fr fr \u{1F624}',
  'Rizz to camera roll \u{1F4F8}',
  'Periodt. Save it. \u{1F4AF}',
  'Caught in 4K \u{1F440}',
  'Slay and save bestie \u{1F98B}',
  'That\'s lowkey fire \u{1FAF6}',
  'We\'re so back \u{1F425}',
  'This slaps, keep it \u{1F3B5}',
  'Not me obsessed \u{1F62D}',
];

// Parse URL hash into selected items
const parseHashState = () => {
  const items = { cap: null, glasses: null, accessories: null, shoes: null };
  const hash = window.location.hash.slice(1);
  if (!hash) return items;
  const params = new URLSearchParams(hash);
  for (const [key, val] of params) {
    if (key in items && val) {
      if (categoryOptions[key]?.some(o => o.id === val)) {
        items[key] = val;
      }
    }
  }
  return items;
};

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('glasses');
  const [selectedItems, setSelectedItems] = useState(parseHashState);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [downloadSlang, setDownloadSlang] = useState('');
  const [showShareCard, setShowShareCard] = useState(false);
  const [shareCardItems, setShareCardItems] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [duckyLanding, setDuckyLanding] = useState(false);
  const [previewItems, setPreviewItems] = useState(null);
  const [removingItems, setRemovingItems] = useState({});
  const [deselectingCard, setDeselectingCard] = useState(null);

  const [holdPreview, setHoldPreview] = useState(null);
  const holdTimerRef = useRef(null);
  const swipeRef = useRef({ startX: 0, startY: 0 });
  const optionsGridRef = useRef(null);

  const avatarRef = useRef(null);
  const canvasRef = useRef(null);
  const confettiRef = useRef(null);

  // Create canvas for rendering avatar
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 4096;
    canvasRef.current = canvas;
  }, []);

  // Sync selected items to URL hash
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(selectedItems).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    const hash = params.toString();
    const newUrl = hash ? `#${hash}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [selectedItems]);

  // Preload current category's preview images
  useEffect(() => {
    const opts = categoryOptions[selectedCategory];
    if (!opts) return;
    opts.forEach(opt => {
      const img = new Image();
      img.src = opt.preview || opt.src;
    });
  }, [selectedCategory]);

  // Mobile haptic feedback
  const haptic = (ms = 10) => {
    if (navigator.vibrate) navigator.vibrate(ms);
  };

  // Category order for swipe navigation (exclude 'random')
  const catOrder = categories.filter(c => c.id !== 'random').map(c => c.id);

  // Scroll to selected item when switching categories
  useEffect(() => {
    if (!optionsGridRef.current) return;
    const selectedId = selectedItems[selectedCategory];
    if (!selectedId) return;
    const selectedEl = optionsGridRef.current.querySelector('.option-card.selected');
    if (selectedEl) {
      setTimeout(() => selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 50);
    }
  }, [selectedCategory, selectedItems]);

  // Swipe to switch categories on mobile
  const handleSwipeStart = (e) => {
    const touch = e.touches[0];
    swipeRef.current = { startX: touch.clientX, startY: touch.clientY };
  };

  const handleSwipeEnd = (e) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - swipeRef.current.startX;
    const dy = touch.clientY - swipeRef.current.startY;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;

    const currentIdx = catOrder.indexOf(selectedCategory);
    if (dx < 0 && currentIdx < catOrder.length - 1) {
      haptic();
      setSelectedCategory(catOrder[currentIdx + 1]);
    } else if (dx > 0 && currentIdx > 0) {
      haptic();
      setSelectedCategory(catOrder[currentIdx - 1]);
    }
  };

  // Hold-to-preview on mobile
  const handleHoldStart = (category, optionId) => {
    holdTimerRef.current = setTimeout(() => {
      haptic(5);
      setHoldPreview({ category, optionId });
    }, 400);
  };

  const handleHoldEnd = () => {
    clearTimeout(holdTimerRef.current);
    setHoldPreview(null);
  };

  // Clear all selections
  const handleClearAll = () => {
    haptic();
    setSelectedItems({ cap: null, glasses: null, accessories: null, shoes: null });
  };

  const hasAnySelection = Object.values(selectedItems).some(Boolean);

  // Handle category click with randomizer
  const handleCategoryClick = (categoryId) => {
    haptic();
    if (categoryId === 'random') {
      handleRandomize();
    } else {
      setSelectedCategory(categoryId);
    }
  };

  // Handle option selection with smooth removal animation
  const handleOptionClick = (category, optionId) => {
    haptic();
    const isDeselecting = selectedItems[category] === optionId;

    if (isDeselecting) {
      setDeselectingCard(`${category}-${optionId}`);
      setTimeout(() => setDeselectingCard(null), 250);

      setRemovingItems(prev => ({ ...prev, [category]: optionId }));
      setTimeout(() => {
        setRemovingItems(prev => ({ ...prev, [category]: null }));
        setSelectedItems(prev => ({ ...prev, [category]: null }));
      }, 180);
    } else {
      setSelectedItems(prev => ({ ...prev, [category]: optionId }));
    }
  };

  // Get current category options
  const getCurrentOptions = () => {
    if (selectedCategory === 'random') return [];
    return categoryOptions[selectedCategory] || [];
  };

  // Render avatar to canvas for transparent download
  const renderAvatarToCanvas = async (itemsToRender = selectedItems) => {
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

      for (const category of ['cap', 'glasses', 'shoes', 'accessories']) {
        const selectedId = itemsToRender[category];
        if (selectedId && categoryOptions[category]) {
          const option = categoryOptions[category].find(item => item.id === selectedId);
          if (option) {
            const overlayImage = await loadImage(option.src);
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
    haptic(15);
    setIsShuffling(true);

    const cats = ['cap', 'glasses', 'accessories', 'shoes'];
    const finalItems = randomizeAvatar(categoryOptions);

    const shuffleFrames = {};
    cats.forEach(cat => {
      const opts = categoryOptions[cat];
      const shuffled = [...opts].sort(() => Math.random() - 0.5);
      shuffleFrames[cat] = shuffled.slice(0, 10).map(o => o.id);
    });

    const ticks = 18;
    const lockTick = { cap: 10, glasses: 13, accessories: 15, shoes: 18 };

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

  // Share handler
  const handleShare = () => {
    const hasSelection = Object.values(selectedItems).some(Boolean);
    setShareCardItems(hasSelection ? selectedItems : randomizeAvatar(categoryOptions));
    setShowShareCard(true);
  };

  // Native share from share card
  const handleNativeShare = async () => {
    try {
      const dataUrl = await renderAvatarToCanvas(shareCardItems || selectedItems);
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

  const triggerDownloadSuccess = () => {
    confettiRef.current?.fire();
    haptic(20);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
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
        triggerDownloadSuccess();
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
        ducky_base, selectedItems, categoryOptions, 'ducky-drip-avatar-bg.png', duckyStand
      );
      if (success) {
        triggerDownloadSuccess();
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

  const displayCategories = categories.filter(cat => cat.id !== 'random');
  const currentOptions = getCurrentOptions();

  return (
    <div className="app-container">
      <section className="preview-panel">
        <div className="preview-shell">
          <div className="header">
            <h1 className="title">
              Ducky Drip<span className="reg">&reg;</span>
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
                <AvatarPreview
                  avatarRef={avatarRef}
                  duckyLanding={duckyLanding}
                  isShuffling={isShuffling}
                  previewItems={previewItems}
                  selectedItems={selectedItems}
                  removingItems={removingItems}
                  holdPreview={holdPreview}
                />
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="action-btn action-btn-primary" onClick={handleRandomize} title="Randomize" disabled={isShuffling}>
              {isShuffling ? <span className="circle-loader" /> : <img src={randomIcon} alt="Randomize" className="action-icon" />}
              <span>{isShuffling ? 'Shuffling\u2026' : 'Randomize'}</span>
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
            {hasAnySelection && (
              <button className="clear-all-btn" onClick={handleClearAll}>Clear all</button>
            )}
          </div>

          <div className="category-section">
            <CategoryPanel
              categories={displayCategories}
              selectedCategory={selectedCategory}
              selectedItems={selectedItems}
              onCategoryClick={handleCategoryClick}
            />
          </div>

          <OptionGrid
            ref={optionsGridRef}
            options={currentOptions}
            selectedCategory={selectedCategory}
            selectedItemId={selectedItems[selectedCategory]}
            deselectingCard={deselectingCard}
            onOptionClick={handleOptionClick}
            onSwipeStart={handleSwipeStart}
            onSwipeEnd={handleSwipeEnd}
            onHoldStart={handleHoldStart}
            onHoldEnd={handleHoldEnd}
          />
        </div>
      </aside>

      {showShareCard && shareCardItems && (
        <ShareModal
          shareCardItems={shareCardItems}
          onClose={() => setShowShareCard(false)}
          onNativeShare={handleNativeShare}
        />
      )}

      {showDownloadMenu && (
        <DownloadModal
          downloadSlang={downloadSlang}
          onClose={() => setShowDownloadMenu(false)}
          onDownloadWithBg={handleDownloadWithBg}
          onDownloadTransparent={handleDownloadTransparent}
        />
      )}

      {showSuccess && (
        <div className="download-success">
          Avatar downloaded successfully!
        </div>
      )}

      <ConfettiCanvas ref={confettiRef} />
    </div>
  );
};

export default App;
