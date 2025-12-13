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
  size = 512
) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  try {
    // Draw the gradient background
    drawBackground(ctx, size, size);

    // Load base image first to get its aspect ratio
    const baseImage = await loadImage(ducky_base);

    // Calculate avatar size (85% of canvas area)
    const maxSize = size * 0.85;

    // Preserve aspect ratio (object-fit: contain behavior)
    const imgAspect = baseImage.naturalWidth / baseImage.naturalHeight;

    let drawWidth, drawHeight;

    if (imgAspect > 1) {
      // Image is wider than tall - fit to width
      drawWidth = maxSize;
      drawHeight = maxSize / imgAspect;
    } else {
      // Image is taller than wide - fit to height
      drawHeight = maxSize;
      drawWidth = maxSize * imgAspect;
    }

    // Center the avatar on the canvas
    const offsetX = (size - drawWidth) / 2;
    const offsetY = (size - drawHeight) / 2;

    // Draw base avatar
    ctx.drawImage(baseImage, offsetX, offsetY, drawWidth, drawHeight);

    // Layer order for overlays
    const categoriesToRender = ['cap', 'glasses', 'shoes', 'accessories'];

    // Draw each selected overlay with same dimensions
    for (const category of categoriesToRender) {
      const selectedId = selectedItems[category];
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
  filename = 'ducky-drip-avatar-bg.png'
) => {
  try {
    const dataUrl = await renderAvatarWithBackground(
      ducky_base,
      selectedItems,
      categoryOptions
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