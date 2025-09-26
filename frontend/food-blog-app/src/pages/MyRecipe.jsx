import React, { useState, useEffect } from 'react';
import RecipeItems from '../components/RecipeItems';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import InputForm from '../components/InputForm';
import RecipeModal from '../components/RecipeModal';
import { FaPlus } from 'react-icons/fa';

function RecipePage() {   
  const initialRecipes = useLoaderData(); 
  const location = useLocation();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState(initialRecipes || []);
  
  const isMyRecipePage = location.pathname === "/myRecipe";
  const isFavoritesPage = location.pathname === "/favRecipes";
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Sync recipes when loader data updates
  useEffect(() => {
    setRecipes(initialRecipes || []);
  }, [initialRecipes]);

  // Remove deleted recipe from local state
  const handleRecipeDeleted = (deletedRecipeId) => {
    setRecipes(prev => prev.filter(recipe => recipe._id !== deletedRecipeId));
  };

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
      {/* Page Header */}
      <div className="page-header-section">
        {isMyRecipePage ? (
          <div className="page-header-content">
            <h1 className="page-title">My <span>Recipe Collection</span></h1>
            <p className="page-subtitle">Transform your kitchen experiments into lasting memories.</p>
            <button onClick={handleAddRecipe} className="add-recipe-button">
              <FaPlus className="button-icon" /> Create New Recipe
            </button>
          </div>
        ) : (
          <div className="page-header-content">
            <h1 className="page-title">My <span>Favorite Recipes</span></h1>
            <p className="page-subtitle">A curated collection of your most beloved dishes.</p>
          </div>
        )}
      </div>

      {/* Recipes List */}
      <div className="recipes-section">
        <RecipeItems 
          loadedRecipes={recipes}
          onViewRecipe={(recipe) => {
            setSelectedRecipe(recipe);
            setIsRecipeModalOpen(true);
          }}
          onLoginRequired={() => setIsLoginOpen(true)}
          onRecipeDeleted={handleRecipeDeleted}
        />
      </div>

      {/* Login Modal */}
      {isLoginOpen && (
        <Modal closeModal={() => setIsLoginOpen(false)}>
          <InputForm closeModal={() => setIsLoginOpen(false)} />
        </Modal>
      )}

      {/* Recipe Details Modal */}
      {isRecipeModalOpen && (
        <Modal closeModal={() => {
          setIsRecipeModalOpen(false);
          setSelectedRecipe(null);
        }}>
          <RecipeModal recipe={selectedRecipe} onClose={() => {
            setIsRecipeModalOpen(false);
            setSelectedRecipe(null);
          }} />
        </Modal>
      )}
    </div>
  )
}

export default RecipePage;
