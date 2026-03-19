/**
 * Download avatar with background utility
 * Renders the avatar on a styled background and downloads as PNG
 */

/**
 * Creates a gradient background matching the preview panel
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
const drawBackground = (ctx, width, height) => {
  // Create gradient matching preview-box: #42A5F5 to #1E88E5
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#42A5F5');
  gradient.addColorStop(1, '#1E88E5');
  
  // Fill background with gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Draw subtle radial light rays effect
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.translate(width / 2, height / 2);
  
  const rayCount = 18;
  for (let i = 0; i < rayCount; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    const angle = (i * 2 * Math.PI) / rayCount;
    const nextAngle = ((i + 0.5) * 2 * Math.PI) / rayCount;
    const radius = Math.max(width, height);
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    ctx.lineTo(Math.cos(nextAngle) * radius, Math.sin(nextAngle) * radius);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }
  
  ctx.restore();
};

/**
 * Loads an image from a source URL
 * @param {string} src - Image source URL
 * @returns {Promise<HTMLImageElement>} - Loaded image element
 */
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

/**
 * Renders avatar with background to canvas and returns data URL
 * @param {string} ducky_base - Base duck image source
 * @param {Object} selectedItems - Selected items for each category
 * @param {Object} categoryOptions - All available options per category
 * @param {number} size - Output image size (square)
 * @returns {Promise<string|null>} - Data URL of rendered image or null on error
 */
export const renderAvatarWithBackground = async (
  ducky_base,
  selectedItems,
  categoryOptions,
  standSrc = null,
  size = 4096
) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  try {
    drawBackground(ctx, size, size);

    // Duck: same fill logic as transparent download (aspect-ratio contain, full canvas)
    const baseImage = await loadImage(ducky_base);
    const imgAspect = baseImage.naturalWidth / baseImage.naturalHeight;

    let duckyW, duckyH, duckyX, duckyY;
    if (imgAspect > 1) {
      duckyW = size;
      duckyH = size / imgAspect;
      duckyX = 0;
      duckyY = (size - duckyH) / 2;
    } else {
      duckyH = size;
      duckyW = size * imgAspect;
      duckyX = (size - duckyW) / 2;
      duckyY = 0;
    }

    // Stand: drawn first so it's behind the ducky
    if (standSrc) {
      const standImg = await loadImage(standSrc);
      const standW = size * 0.52 * 1.3 * 1.1;
      const standH = standW * (179 / 388);
      const standX = (size - standW) / 2;
      const standTopY = size - standH + size * 0.1;
      ctx.drawImage(standImg, standX, standTopY, standW, standH);
    }

    ctx.drawImage(baseImage, duckyX, duckyY, duckyW, duckyH);

    const categoriesToRender = ['cap', 'glasses', 'shoes', 'accessories'];
    for (const category of categoriesToRender) {
      const selectedId = selectedItems[category];
      if (selectedId && categoryOptions[category]) {
        const option = categoryOptions[category].find(item => item.id === selectedId);
        if (option) {
          const overlayImage = await loadImage(option.src);
          ctx.drawImage(overlayImage, duckyX, duckyY, duckyW, duckyH);
        }
      }
    }

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error rendering avatar with background:', error);
    return null;
  }
};

/**
 * Downloads the avatar with background
 * @param {string} ducky_base - Base duck image source
 * @param {Object} selectedItems - Selected items for each category
 * @param {Object} categoryOptions - All available options per category
 * @param {string} filename - Download filename
 * @returns {Promise<boolean>} - Success status
 */
export const downloadAvatarWithBackground = async (
  ducky_base,
  selectedItems,
  categoryOptions,
  filename = 'ducky-drip-avatar-bg.png',
  standSrc = null
) => {
  try {
    const dataUrl = await renderAvatarWithBackground(
      ducky_base,
      selectedItems,
      categoryOptions,
      standSrc
    );
    
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Download with background failed:', error);
    return false;
  }
};

export default downloadAvatarWithBackground;