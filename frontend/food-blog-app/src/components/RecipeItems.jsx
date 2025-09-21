import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsFillStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit, FaLeaf, FaDrumstickBite } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';

function RecipeItems({ 
  loadedRecipes,
  onViewRecipe,
  onLoginRequired,
  hasActiveSearch = false
}) {
  const [recipes, setRecipes] = useState(loadedRecipes || []);
  
  // Route checks
  const isMyRecipePage = window.location.pathname === "/myRecipe";
  const isFavPage = window.location.pathname === "/favRecipes";
  const isHomePage = window.location.pathname === "/";
  
  // Current user and auth data
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  
  // Load user-specific favorites
  const [favoriteRecipes, setFavoriteRecipes] = useState(
    JSON.parse(localStorage.getItem(`fav_${user?._id}`)) || []
  );

  // Handle recipe list updates (based on route and props)
  useEffect(() => {
    if (isFavPage) {
      setRecipes(favoriteRecipes);
    } else if (loadedRecipes && loadedRecipes.length >= 0) {
      setRecipes(loadedRecipes);
    }
  }, [loadedRecipes, isFavPage]);

  // Handle favorites page re-renders
  useEffect(() => {
    if (isFavPage) {
      setRecipes(favoriteRecipes);
    }
  }, [favoriteRecipes, isFavPage]);

  // Delete recipe (updates UI and server)
  const onDelete = async (id) => {
    try {
      const updatedRecipes = recipes.filter((item) => item._id !== id);
      setRecipes(updatedRecipes);
      
      const updatedFavorites = favoriteRecipes.filter((recipe) => recipe._id !== id);
      setFavoriteRecipes(updatedFavorites);
      localStorage.setItem(`fav_${user._id}`, JSON.stringify(updatedFavorites));
      
      await axios.delete(`${import.meta.env.VITE_API_URL}/recipes/${id}`);
      
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setRecipes(loadedRecipes);
      setFavoriteRecipes(JSON.parse(localStorage.getItem(`fav_${user._id}`)) || []);
      alert("Failed to delete recipe. Please try again.");
    }
  };

  // Add or remove recipe from favorites
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

  // Handle recipe card click (avoids action button clicks)
  const handleCardClick = (item, event) => {
    if (event.target.closest('.card-actions') || 
        event.target.closest('.action') || 
        event.target.closest('[data-action]')) {
      return;
    }
    
    if (onViewRecipe) {
      onViewRecipe(item);
    }
  };

  return (
    <div className="card-container">
      {Array.isArray(recipes) && recipes.length > 0 ? (
        recipes.map((item, index) => (
          <div 
            key={index}
            className="card"
            onClick={(e) => handleCardClick(item, e)}
          >
            <img 
              src={`${import.meta.env.VITE_API_URL}/images/${item.coverImage}`} 
              alt={item.title}
            />
            <div className="card-body">
              <div className="title">
                {item.title}
              </div>
              
              <div className="recipe-info">
                <span>{item.cuisineType || 'No Cuisine'}</span>
                <span>{item.country || 'No Country'}</span>
              </div>

              <div className="icons">
                <div className="timer">
                  <BsFillStopwatchFill />
                  <span>{item.time}</span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div className="diet-type-box" style={{
                    backgroundColor: item.dietType === 'Veg' ? '#28a745' : item.dietType === 'Non-Veg' ? '#dc3545' : '#6c757d',
                    color: 'white',
                    padding: '3px 6px',
                    borderRadius: '10px',
                    fontSize: '0.65rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.dietType === 'Veg' && <FaLeaf style={{ marginRight: '3px', fontSize: '8px' }} />}
                    {item.dietType === 'Non-Veg' && <FaDrumstickBite style={{ marginRight: '3px', fontSize: '8px' }} />}
                    {item.dietType === 'Non-Veg' ? 'NON-VEG' : item.dietType || 'N/A'}
                  </div>

                  {isMyRecipePage ? (
                    <div className="action" data-action="true">
                      <Link 
                        to={`/editRecipe/${item._id}`} 
                        className="editIcon"
                        data-action="true"
                      >
                        <FaEdit />
                      </Link>
                      <MdDelete
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item._id);
                        }}
                        className="deleteIcon"
                        data-action="true"
                      />
                    </div>
                  ) : (
                    <div className="card-actions" data-action="true">
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
          </div>
        ))
      ) : (
        hasActiveSearch && isHomePage ? (
          null
        ) : (
          <div className="no-recipes-message">No recipes available</div>
        )
      )}
    </div>
  );
}

export default RecipeItems;
