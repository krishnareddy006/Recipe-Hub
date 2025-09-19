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
  
  // ✅ Page detection
  const isMyRecipePage = location.pathname === "/myRecipe";
  const isFavoritesPage = location.pathname === "/favRecipes";
  
  // ✅ Modal states
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // ✅ Close login modal
  function closeLoginModal() {
    setIsLoginOpen(false);
  }

  // ✅ Close recipe modal
  function closeRecipeModal() {
    setIsRecipeModalOpen(false);
    setSelectedRecipe(null);
  }

  // ✅ Handle view recipe
  function handleViewRecipe(recipe) {
    setSelectedRecipe(recipe);
    setIsRecipeModalOpen(true);
  }

  // ✅ Show login modal
  function showLoginModal() {
    setIsLoginOpen(true);
  }

  // ✅ Handle Add Recipe for My Recipe page
  const handleAddRecipe = () => {
    let token = localStorage.getItem("token");
    if (token) {
      navigate("/addRecipe");
    } else {
      setIsLoginOpen(true);
    }
  };

  const wrapperStyles = {
    width: '100vw',
    minHeight: '100vh',
    paddingTop: '90px',
    paddingBottom: '3rem',
    boxSizing: 'border-box',
    backgroundColor: '#f8f9fa',
    margin: '0'
  };

  const containerStyles = {
    width: '100vw',
    margin: '0',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 250px)',
    gap: '2rem',
    cursor: 'pointer',
    padding: '2rem 4rem',
    justifyContent: 'start',
    boxSizing: 'border-box'
  };

  const cardStyles = {
    boxShadow: '0 4px 15px rgba(33, 53, 71, 0.1)',
    textAlign: 'center',
    borderRadius: '12px',
    width: '250px',
    maxWidth: '250px',
    background: 'white',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    margin: '0'
  };

  const cardImageStyles = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    backgroundColor: 'white',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    display: 'block'
  };

  const cardBodyStyles = {
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px'
  };

  const titleStyles = {
    marginBottom: '10px',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#213547',
    fontFamily: '"Times New Roman", Times, serif'
  };

  const iconsStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px'
  };

  const timerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#213547'
  };

  const actionStyles = {
    display: 'flex',
    fontSize: '19px',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '50px'
  };

  const editIconStyles = {
    color: '#213547',
    fontSize: '18px',
    textDecoration: 'none',
    transition: 'color 0.3s ease'
  };

  const deleteIconStyles = {
    color: '#dc3545',
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'color 0.3s ease'
  };

  return (
    <>
      <div style={wrapperStyles}>
        {/* ✅ MY RECIPE PAGE - COMPACT ADD RECIPE DIV */}
        {isMyRecipePage && (
          <div className="my-recipe-header">
            <div className="my-recipe-content">
              <h2 className="my-recipe-title">
                My <span>Recipe Collection</span>
              </h2>
              <p className="my-recipe-subtitle">
                Transform your kitchen experiments into lasting memories. Every recipe is a chapter in your culinary story.
              </p>
              <button onClick={handleAddRecipe} className="add-recipe-btn">
                <FaPlus className="add-recipe-icon" />
                Create New Recipe
              </button>
            </div>
          </div>
        )}

        {/* ✅ FAVORITES PAGE - SIMPLE HEADER */}
        {isFavoritesPage && (
          <div className="my-recipe-header">
            <div className="my-recipe-content">
              <h2 className="my-recipe-title">
                My <span>Favorite Recipes</span>
              </h2>
              <p className="my-recipe-subtitle">
                A curated collection of your most beloved dishes. The recipes that make your heart smile and your taste buds dance.
              </p>
            </div>
          </div>
        )}

        <RecipeItems 
          loadedRecipes={recipes}
          containerStyles={containerStyles}
          cardStyles={cardStyles}
          cardImageStyles={cardImageStyles}
          cardBodyStyles={cardBodyStyles}
          titleStyles={titleStyles}
          iconsStyles={iconsStyles}
          timerStyles={timerStyles}
          actionStyles={actionStyles}
          editIconStyles={editIconStyles}
          deleteIconStyles={deleteIconStyles}
          onViewRecipe={handleViewRecipe}
          onLoginRequired={showLoginModal}
        />
      </div>

      {/* ✅ Login Modal */}
      {isLoginOpen && (
        <Modal closeModal={closeLoginModal}>
          <InputForm closeModal={closeLoginModal} />
        </Modal>
      )}

      {/* ✅ Recipe Modal */}
      {isRecipeModalOpen && (
        <Modal closeModal={closeRecipeModal}>
          <RecipeModal recipe={selectedRecipe} onClose={closeRecipeModal} />
        </Modal>
      )}
    </>
  )
}

export default RecipePage;


