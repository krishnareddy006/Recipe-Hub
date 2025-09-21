import React from 'react';
import { IoClose } from 'react-icons/io5';
import { BsFillStopwatchFill } from "react-icons/bs";

function RecipeModal({ recipe, onClose }) {
  if (!recipe) return null;

  // Utility function to check if an ingredient string is unusually long
  const isLongIngredient = (ingredient) => {
    return ingredient.length > 50;
  };

  return (
    <div className="recipe-modal">
      <button className="recipe-modal-close" onClick={onClose}>
        <IoClose size={20} />
      </button>

      <div className="recipe-modal-content">
        <h2 className="recipe-modal-title">{recipe.title}</h2>

        <div className="recipe-modal-image-container">
          <img 
            src={`${import.meta.env.VITE_API_URL}/images/${recipe.coverImage}`} 
            alt={recipe.title}
            className="recipe-modal-image"
          />
        </div>

        {/* Recipe metadata section */}
        <div className="recipe-modal-details">
          {recipe.dietType && (
            <div className="recipe-modal-tag">
              {recipe.dietType}
            </div>
          )}
          
          {recipe.cuisineType && (
            <div className="recipe-modal-tag">
              {recipe.cuisineType}
            </div>
          )}
          
          {recipe.country && (
            <div className="recipe-modal-tag">
              {recipe.country}
            </div>
          )}
        </div>

        {/* Cooking time display */}
        <div className="recipe-modal-time">
          <BsFillStopwatchFill />
          <span>{recipe.time}</span>
        </div>

        {/* Ingredients list */}
        <div className="recipe-modal-section">
          <h3>Ingredients</h3>
          <div className="recipe-modal-ingredients">
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li 
                    key={index}
                    className={isLongIngredient(ingredient) ? 'long-ingredient' : ''}
                  >
                    {ingredient}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No ingredients listed</p>
            )}
          </div>
        </div>

        {/* Cooking instructions */}
        <div className="recipe-modal-section">
          <h3>Instructions</h3>
          <div className="recipe-modal-instructions">
            {recipe.instructions ? (
              <p>{recipe.instructions}</p>
            ) : (
              <p>No instructions provided</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeModal;