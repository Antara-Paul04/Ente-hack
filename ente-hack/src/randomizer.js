/**
 * Randomizer utility function for avatar customization
 * Randomly selects one item from each category that has options
 */

export const randomizeAvatar = (categoryOptions) => {
  const newSelectedItems = {};
  
  // Iterate through each category
  Object.keys(categoryOptions).forEach(category => {
    const options = categoryOptions[category];
    
    if (options.length > 0) {
      // Always select a random item from this category
      const randomIndex = Math.floor(Math.random() * options.length);
      newSelectedItems[category] = options[randomIndex].id;
    } else {
      // No options available for this category
      newSelectedItems[category] = null;
    }
  });
  
  return newSelectedItems;
};