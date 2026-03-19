import { categoryOptions } from '../categoryOptions';
import ducky_base from '../assets/duckies/ducky_base.svg';
import duckyStand from '../ducky stand.svg';

const AvatarPreview = ({ avatarRef, duckyLanding, isShuffling, previewItems, selectedItems, removingItems, holdPreview }) => {
  const getOverlayClass = (category) => {
    if (removingItems[category]) return 'accessory-removing';
    if (previewItems) return 'accessory-shuffle';
    return 'accessory-overlay';
  };

  const displayItems = previewItems || selectedItems;
  const visibleItems = { ...displayItems };
  Object.entries(removingItems).forEach(([cat, id]) => {
    if (id) visibleItems[cat] = id;
  });
  if (holdPreview) {
    visibleItems[holdPreview.category] = holdPreview.optionId;
  }

  return (
    <div
      ref={avatarRef}
      className={`avatar-container${duckyLanding ? ' ducky-landing' : ''}`}
    >
      <img src={duckyStand} alt="Ducky stand" className="ducky-stand" />

      <div className={`ducky-wrapper${isShuffling ? ' squishing' : ''}`}>
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

        {['cap', 'glasses', 'shoes', 'accessories'].map(cat =>
          visibleItems[cat] && categoryOptions[cat] ? (
            <img
              key={`${cat}-${visibleItems[cat]}`}
              src={categoryOptions[cat].find(item => item.id === visibleItems[cat])?.src}
              alt={`Selected ${cat}`}
              className={getOverlayClass(cat)}
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
          ) : null
        )}
      </div>
    </div>
  );
};

export default AvatarPreview;
