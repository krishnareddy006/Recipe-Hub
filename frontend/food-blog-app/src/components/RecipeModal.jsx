import React from 'react';
import { IoClose } from 'react-icons/io5';
import { BsFillStopwatchFill } from "react-icons/bs";

function RecipeModal({ recipe, onClose }) {
  if (!recipe) return null;

  return (
    <div className="recipe-modal">
      {/* ✅ Close Button */}
      <button className="recipe-modal-close" onClick={onClose}>
        <IoClose size={20} />
      </button>

      {/* ✅ Recipe Content */}
      <div className="recipe-modal-content">
        {/* ✅ Title */}
        <h2 className="recipe-modal-title">{recipe.title}</h2>

        {/* ✅ Image */}
        <div className="recipe-modal-image-container">
          <img 
            src={`http://localhost:5000/images/${recipe.coverImage}`} 
            alt={recipe.title}
            className="recipe-modal-image"
          />
        </div>

        {/* ✅ Time */}
        <div className="recipe-modal-time">
          <BsFillStopwatchFill />
          <span>{recipe.time}</span>
        </div>

        {/* ✅ Ingredients */}
        <div className="recipe-modal-section">
          <h3>Ingredients</h3>
          <div className="recipe-modal-ingredients">
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p>No ingredients listed</p>
            )}
          </div>
        </div>

        {/* ✅ Instructions */}
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
