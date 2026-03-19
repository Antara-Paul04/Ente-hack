import { forwardRef } from 'react';

const OptionGrid = forwardRef(({
  options,
  selectedCategory,
  selectedItemId,
  deselectingCard,
  onOptionClick,
  onSwipeStart,
  onSwipeEnd,
  onHoldStart,
  onHoldEnd,
}, ref) => {
  return (
    <div
      className="options-section"
      onTouchStart={onSwipeStart}
      onTouchEnd={onSwipeEnd}
    >
      <div
        key={selectedCategory}
        ref={ref}
        className={`options-card-container category-${selectedCategory}`}
      >
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onOptionClick(selectedCategory, option.id)}
            onTouchStart={() => onHoldStart(selectedCategory, option.id)}
            onTouchEnd={onHoldEnd}
            onTouchCancel={onHoldEnd}
            className={`option-card${
              selectedItemId === option.id ? " selected" : ""
            }${deselectingCard === `${selectedCategory}-${option.id}` ? " deselecting" : ""}`}
            type="button"
            aria-pressed={selectedItemId === option.id}
          >
            <img
              src={option.preview || option.src}
              alt={option.label}
              className="option-card-image"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
});

OptionGrid.displayName = 'OptionGrid';

export default OptionGrid;
