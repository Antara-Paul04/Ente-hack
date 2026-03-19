const CategoryPanel = ({ categories, selectedCategory, selectedItems, onCategoryClick }) => {
  return (
    <div className="category-icons" role="tablist" aria-label="Customization categories">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryClick(category.id)}
          className={`category-icon-btn ${
            selectedCategory === category.id ? "active" : ""
          }`}
          title={category.label}
          aria-pressed={selectedCategory === category.id}
        >
          {selectedItems[category.id] && <span className="category-dot" />}
          <span className="icon">
            <img src={category.icon} alt={category.label} />
          </span>
          <span className="category-label">{category.label}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryPanel;
