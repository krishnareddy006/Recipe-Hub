import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsFillStopwatchFill } from "react-icons/bs";
import { FaHeart, FaEye } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';

function RecipeItems({ 
  loadedRecipes, 
  containerStyles, 
  cardStyles, 
  cardImageStyles, 
  cardBodyStyles,
  titleStyles,
  iconsStyles,
  timerStyles,
  actionStyles,
  editIconStyles,
  deleteIconStyles,
  onViewRecipe,
  onLoginRequired
}) {
  const [recipes, setRecipes] = useState(loadedRecipes || []);
  
  // ✅ Current route checks
  const isMyRecipePage = window.location.pathname === "/myRecipe";
  const isFavPage = window.location.pathname === "/favRecipes";
  const isHomePage = window.location.pathname === "/";
  
  // ✅ Get current user
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  
  // ✅ Load user-specific favorites
  const [favoriteRecipes, setFavoriteRecipes] = useState(
    JSON.parse(localStorage.getItem(`fav_${user?._id}`)) || []
  );

  // ✅ IMPROVED useEffect with better dependency management
  useEffect(() => {
    if (isFavPage) {
      setRecipes(favoriteRecipes);
    } else if (loadedRecipes && loadedRecipes.length >= 0) {
      setRecipes(loadedRecipes);
    }
  }, [loadedRecipes, isFavPage]);

  // ✅ SEPARATE useEffect for favorites page updates
  useEffect(() => {
    if (isFavPage) {
      setRecipes(favoriteRecipes);
    }
  }, [favoriteRecipes, isFavPage]);

  // ✅ Delete recipe with immediate UI update
  const onDelete = async (id) => {
    try {
      const updatedRecipes = recipes.filter((item) => item._id !== id);
      setRecipes(updatedRecipes);
      
      const updatedFavorites = favoriteRecipes.filter((recipe) => recipe._id !== id);
      setFavoriteRecipes(updatedFavorites);
      localStorage.setItem(`fav_${user._id}`, JSON.stringify(updatedFavorites));
      
      await axios.delete(`http://localhost:5000/recipes/${id}`);
      
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setRecipes(loadedRecipes);
      setFavoriteRecipes(JSON.parse(localStorage.getItem(`fav_${user._id}`)) || []);
      alert("Failed to delete recipe. Please try again.");
    }
  };

  // ✅ Toggle favorite with login check
  const toggleFavorite = (item) => {
    if (!token) {
      if (onLoginRequired) onLoginRequired();
      return;
    }

    const isAlreadyFavorite = favoriteRecipes.some((r) => r._id === item._id);
    let updatedFavorites;
    
    if (isAlreadyFavorite) {
      updatedFavorites = favoriteRecipes.filter((r) => r._id !== item._id);
    } else {
      updatedFavorites = [...favoriteRecipes, item];
    }
    
    setFavoriteRecipes(updatedFavorites);
    localStorage.setItem(`fav_${user._id}`, JSON.stringify(updatedFavorites));
    
    if (isFavPage && isAlreadyFavorite) {
      setRecipes(updatedFavorites);
    }
  };

  // ✅ Handle view recipe (no login required)
  const handleViewRecipe = (recipe) => {
    if (onViewRecipe) {
      onViewRecipe(recipe);
    }
  };

  // ✅ Handle card click (except on action buttons)
  const handleCardClick = (item, event) => {
    // ✅ Prevent modal from opening when clicking on action buttons
    if (event.target.closest('.card-actions') || 
        event.target.closest('.action') || 
        event.target.closest('[data-action]')) {
      return;
    }
    
    // ✅ Open recipe modal
    handleViewRecipe(item);
  };

  // ✅ Use passed styles or fall back to className for Home page
  const finalContainerStyles = containerStyles || {};
  const finalCardStyles = cardStyles || {};

  return (
    <div 
      className={containerStyles ? "" : "card-container"} 
      style={finalContainerStyles}
    >
      {Array.isArray(recipes) && recipes.length > 0 ? (
        recipes.map((item, index) => (
          <div 
            key={index}
            className={cardStyles ? "" : "card"}
            style={{
              ...finalCardStyles,
              cursor: 'pointer'
            }}
            onClick={(e) => handleCardClick(item, e)}
          >
            <img 
              src={`http://localhost:5000/images/${item.coverImage}`} 
              alt={item.title}
              style={cardImageStyles}
            />
            <div className={cardBodyStyles ? "" : "card-body"} style={cardBodyStyles}>
              <div className={titleStyles ? "" : "title"} style={titleStyles}>{item.title}</div>
              <div className={iconsStyles ? "" : "icons"} style={iconsStyles}>
                <div className={timerStyles ? "" : "timer"} style={timerStyles}>
                  <BsFillStopwatchFill /> {item.time}
                </div>

                {/* ✅ UPDATED ICONS SECTION WITH PROPER EVENT HANDLING */}
                {isMyRecipePage ? (
                  // ✅ My Recipes: Edit & Delete only
                  <div style={actionStyles} className="action" data-action="true">
                    <Link 
                      to={`/editRecipe/${item._id}`} 
                      className={editIconStyles ? "" : "editIcon"} 
                      style={editIconStyles}
                      data-action="true"
                    >
                      <FaEdit />
                    </Link>
                    <MdDelete
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item._id);
                      }}
                      className={deleteIconStyles ? "" : "deleteIcon"}
                      style={deleteIconStyles}
                      data-action="true"
                    />
                  </div>
                ) : (
                  // ✅ Home & Favorites: View + Favorite buttons
                  <div 
                    style={{ display: 'flex', gap: '10px', alignItems: 'center' }} 
                    className="card-actions"
                    data-action="true"
                  >
                    {/* ✅ View Button */}
                    <FaEye
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewRecipe(item);
                      }}
                      style={{
                        color: '#213547',
                        cursor: 'pointer',
                        fontSize: '18px',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#e67e22'}
                      onMouseLeave={(e) => e.target.style.color = '#213547'}
                      data-action="true"
                    />
                    
                    {/* ✅ Favorite Button */}
                    <FaHeart
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item);
                      }}
                      style={{
                        color: favoriteRecipes.some((r) => r._id === item._id) ? "red" : "#213547",
                        cursor: "pointer",
                        fontSize: '18px',
                        transition: 'color 0.3s ease'
                      }}
                      data-action="true"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p style={{textAlign: 'center', gridColumn: '1 / -1'}}>No recipes available</p>
      )}
    </div>
  );
}

export default RecipeItems;
