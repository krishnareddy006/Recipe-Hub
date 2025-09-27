import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsFillStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit, FaLeaf, FaDrumstickBite } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import { getUser, getToken } from '../utils/AuthUtils';

function RecipeItems({ 
  loadedRecipes,
  onViewRecipe,
  onLoginRequired,
  onRecipeDeleted,
  hasActiveSearch = false
}) {
  const [recipes, setRecipes] = useState(loadedRecipes || []);
  
  // Page checks
  const isMyRecipePage = window.location.pathname === "/myRecipe";
  const isFavPage = window.location.pathname === "/favRecipes";
  const isHomePage = window.location.pathname === "/";
  
  // Auth and user info
  const user = getUser();
  const token = getToken();
  
  // Favorite recipes state (persisted by user)
  // const [favoriteRecipes, setFavoriteRecipes] = useState(() => {
  //   if (user && user._id) {
  //     return JSON.parse(localStorage.getItem(`fav_${user._id}`)) || [];
  //   }
  //   return [];
  // });
  const [favoriteRecipes, setFavoriteRecipes] = useState(() => {
  if (user && (user._id || user.email)) {
    const userId = user._id || user.email;
    return JSON.parse(localStorage.getItem(`fav_${userId}`)) || [];
  }
  return [];
});

  // Sync recipes when props or favorites change
  useEffect(() => {
    if (isFavPage) {
      setRecipes(favoriteRecipes);
    } else if (loadedRecipes && loadedRecipes.length >= 0) {
      setRecipes(loadedRecipes);
    }
  }, [loadedRecipes, isFavPage, favoriteRecipes]);

  // Keep favorites page up to date
  useEffect(() => {
    if (isFavPage) {
      setRecipes(favoriteRecipes);
    }
  }, [favoriteRecipes, isFavPage]);

  // Optimistic delete function with rollback on failure
  const onDelete = async (id) => {
    if (!token) {
      alert("Please login to delete recipes");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }

    try {
      const updatedRecipes = recipes.filter((item) => item._id !== id);
      setRecipes(updatedRecipes);
      
      if (user && user._id) {
        const updatedFavorites = favoriteRecipes.filter((recipe) => recipe._id !== id);
        setFavoriteRecipes(updatedFavorites);
        // localStorage.setItem(`fav_${user._id}`, JSON.stringify(updatedFavorites));
        const userId = user._id || user.email;
        localStorage.setItem(`fav_${userId}`, JSON.stringify(updatedFavorites));
      }
      
      if (onRecipeDeleted) {
        onRecipeDeleted(id);
      }
      
      await axios.delete(`${import.meta.env.VITE_API_URL}/recipes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

    } catch (error) {
      console.error("Error deleting recipe:", error);
      
      // Rollback if API request fails
      setRecipes(loadedRecipes || []);
      if (user && user._id) {
        const originalFavorites = JSON.parse(localStorage.getItem(`fav_${user._id}`)) || [];
        setFavoriteRecipes(originalFavorites);
      }
      
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        window.location.href = "/";
      } else if (error.response?.status === 403) {
        alert("You can only delete your own recipes.");
      } else if (error.response?.status === 404) {
        alert("Recipe not found or already deleted.");
      } else {
        alert(`Failed to delete recipe: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  // Favorite/unfavorite toggle
  const toggleFavorite = (item) => {
    if (!token) {
      if (onLoginRequired) onLoginRequired();
      return;
    }

    if (!user || !user._id) {
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
    // localStorage.setItem(`fav_${user._id}`, JSON.stringify(updatedFavorites));
    const userId = user._id || user.email;
    localStorage.setItem(`fav_${userId}`, JSON.stringify(updatedFavorites));
    
    if (isFavPage && isAlreadyFavorite) {
      setRecipes(updatedFavorites);
    }
  };

  // Handle recipe card click (ignores action buttons)
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
            key={item._id || index}
            className="card"
            onClick={(e) => handleCardClick(item, e)}
          >
            <img 
              src={item.coverImage || '/placeholder.jpg'}
              alt={item.title}
              onError={(e) => {
                e.target.src = '/placeholder.jpg';
              }}
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
                        style={{ cursor: 'pointer' }}
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
          <div className="no-recipes-message" style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#6c757d',
            fontSize: '1.1rem'
          }}>
            {isFavPage ? "No favorite recipes yet. Start adding some!" : "No recipes available"}
          </div>
        )
      )}
    </div>
  );
}

export default RecipeItems;
