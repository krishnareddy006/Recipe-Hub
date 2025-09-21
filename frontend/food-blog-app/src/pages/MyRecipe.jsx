import React, { useState } from 'react';
import RecipeItems from '../components/RecipeItems';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import InputForm from '../components/InputForm';
import RecipeModal from '../components/RecipeModal';
import { FaPlus } from 'react-icons/fa';

function RecipePage() {   
  const recipes = useLoaderData(); 
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine which page is being viewed
  const isMyRecipePage = location.pathname === "/myRecipe";
  const isFavoritesPage = location.pathname === "/favRecipes";
  
  // Modal state management
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Close login modal
  function closeLoginModal() {
    setIsLoginOpen(false);
  }

  // Close recipe details modal
  function closeRecipeModal() {
    setIsRecipeModalOpen(false);
    setSelectedRecipe(null);
  }

  // Open recipe details modal for selected recipe
  function handleViewRecipe(recipe) {
    setSelectedRecipe(recipe);
    setIsRecipeModalOpen(true);
  }

  // Open login modal when authentication is required
  function showLoginModal() {
    setIsLoginOpen(true);
  }

  // Navigate to Add Recipe page if logged in, otherwise show login modal
  const handleAddRecipe = () => {
    let token = localStorage.getItem("token");
    if (token) {
      navigate("/addRecipe");
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <div className="page-container recipe-page">
      {/* Page Header Section */}
      <div className="page-header-section">
        {isMyRecipePage ? (
          <div className="page-header-content">
            <h1 className="page-title">
              My <span>Recipe Collection</span>
            </h1>
            <p className="page-subtitle">
              Transform your kitchen experiments into lasting memories. Every recipe is a chapter in your culinary story.
            </p>
            <button onClick={handleAddRecipe} className="add-recipe-button">
              <FaPlus className="button-icon" />
              Create New Recipe
            </button>
          </div>
        ) : (
          <div className="page-header-content">
            <h1 className="page-title">
              My <span>Favorite Recipes</span>
            </h1>
            <p className="page-subtitle">
              A curated collection of your most beloved dishes. The recipes that make your heart smile and your taste buds dance.
            </p>
          </div>
        )}
      </div>

      {/* Recipes Listing */}
      <div className="recipes-section">
        <RecipeItems 
          loadedRecipes={recipes}
          onViewRecipe={handleViewRecipe}
          onLoginRequired={showLoginModal}
        />
      </div>

      {/* Login Modal */}
      {isLoginOpen && (
        <Modal closeModal={closeLoginModal}>
          <InputForm closeModal={closeLoginModal} />
        </Modal>
      )}

      {/* Recipe Details Modal */}
      {isRecipeModalOpen && (
        <Modal closeModal={closeRecipeModal}>
          <RecipeModal recipe={selectedRecipe} onClose={closeRecipeModal} />
        </Modal>
      )}
    </div>
  )
}

export default RecipePage;
