// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { BsFillStopwatchFill } from "react-icons/bs";
// import { FaHeart } from "react-icons/fa6";
// import { FaEdit, FaLeaf, FaDrumstickBite } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import axios from 'axios';
// import { getUser, getToken } from '../utils/AuthUtils';

// function RecipeItems({ 
//   loadedRecipes,
//   onViewRecipe,
//   onLoginRequired,
//   hasActiveSearch = false
// }) {
//   const [recipes, setRecipes] = useState(loadedRecipes || []);
  
//   // Route checks
//   const isMyRecipePage = window.location.pathname === "/myRecipe";
//   const isFavPage = window.location.pathname === "/favRecipes";
//   const isHomePage = window.location.pathname === "/";
  
//   // Current user and auth data
//   const user = getUser();
//   const token = getToken();
  
//   // Load user-specific favorites
//   const [favoriteRecipes, setFavoriteRecipes] = useState(
//     JSON.parse(localStorage.getItem(`fav_${user?._id}`)) || []
//   );

//   // Handle recipe list updates (based on route and props)
//   useEffect(() => {
//     if (isFavPage) {
//       setRecipes(favoriteRecipes);
//     } else if (loadedRecipes && loadedRecipes.length >= 0) {
//       setRecipes(loadedRecipes);
//     }
//   }, [loadedRecipes, isFavPage]);

//   // Handle favorites page re-renders
//   useEffect(() => {
//     if (isFavPage) {
//       setRecipes(favoriteRecipes);
//     }
//   }, [favoriteRecipes, isFavPage]);

//   // Delete recipe (updates UI and server)
//   const onDelete = async (id) => {
//     try {
//       const updatedRecipes = recipes.filter((item) => item._id !== id);
//       setRecipes(updatedRecipes);
      
//       const updatedFavorites = favoriteRecipes.filter((recipe) => recipe._id !== id);
//       setFavoriteRecipes(updatedFavorites);
//       localStorage.setItem(`fav_${user._id}`, JSON.stringify(updatedFavorites));
      
//       await axios.delete(`${import.meta.env.VITE_API_URL}/recipes/${id}`);
      
//     } catch (error) {
//       console.error("Error deleting recipe:", error);
//       setRecipes(loadedRecipes);
//       setFavoriteRecipes(JSON.parse(localStorage.getItem(`fav_${user._id}`)) || []);
//       alert("Failed to delete recipe. Please try again.");
//     }
//   };

//   // Add or remove recipe from favorites
//   const toggleFavorite = (item) => {
//     if (!token) {
//       if (onLoginRequired) onLoginRequired();
//       return;
//     }

//     const isAlreadyFavorite = favoriteRecipes.some((r) => r._id === item._id);
//     let updatedFavorites;
    
//     if (isAlreadyFavorite) {
//       updatedFavorites = favoriteRecipes.filter((r) => r._id !== item._id);
//     } else {
//       updatedFavorites = [...favoriteRecipes, item];
//     }
    
//     setFavoriteRecipes(updatedFavorites);
//     localStorage.setItem(`fav_${user._id}`, JSON.stringify(updatedFavorites));
    
//     if (isFavPage && isAlreadyFavorite) {
//       setRecipes(updatedFavorites);
//     }
//   };

//   // Handle recipe card click (avoids action button clicks)
//   const handleCardClick = (item, event) => {
//     if (event.target.closest('.card-actions') || 
//         event.target.closest('.action') || 
//         event.target.closest('[data-action]')) {
//       return;
//     }
    
//     if (onViewRecipe) {
//       onViewRecipe(item);
//     }
//   };

//   return (
//     <div className="card-container">
//       {Array.isArray(recipes) && recipes.length > 0 ? (
//         recipes.map((item, index) => (
//           <div 
//             key={index}
//             className="card"
//             onClick={(e) => handleCardClick(item, e)}
//           >
//             <img 
//               src={item.coverImage || '/placeholder.jpg'}
//               alt={item.title}
//             />
//             <div className="card-body">
//               <div className="title">
//                 {item.title}
//               </div>
              
//               <div className="recipe-info">
//                 <span>{item.cuisineType || 'No Cuisine'}</span>
//                 <span>{item.country || 'No Country'}</span>
//               </div>

//               <div className="icons">
//                 <div className="timer">
//                   <BsFillStopwatchFill />
//                   <span>{item.time}</span>
//                 </div>

//                 <div style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px'
//                 }}>
//                   <div className="diet-type-box" style={{
//                     backgroundColor: item.dietType === 'Veg' ? '#28a745' : item.dietType === 'Non-Veg' ? '#dc3545' : '#6c757d',
//                     color: 'white',
//                     padding: '3px 6px',
//                     borderRadius: '10px',
//                     fontSize: '0.65rem',
//                     fontWeight: '600',
//                     textTransform: 'uppercase',
//                     display: 'flex',
//                     alignItems: 'center',
//                     whiteSpace: 'nowrap'
//                   }}>
//                     {item.dietType === 'Veg' && <FaLeaf style={{ marginRight: '3px', fontSize: '8px' }} />}
//                     {item.dietType === 'Non-Veg' && <FaDrumstickBite style={{ marginRight: '3px', fontSize: '8px' }} />}
//                     {item.dietType === 'Non-Veg' ? 'NON-VEG' : item.dietType || 'N/A'}
//                   </div>

//                   {isMyRecipePage ? (
//                     <div className="action" data-action="true">
//                       <Link 
//                         to={`/editRecipe/${item._id}`} 
//                         className="editIcon"
//                         data-action="true"
//                       >
//                         <FaEdit />
//                       </Link>
//                       <MdDelete
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onDelete(item._id);
//                         }}
//                         className="deleteIcon"
//                         data-action="true"
//                       />
//                     </div>
//                   ) : (
//                     <div className="card-actions" data-action="true">
//                       <FaHeart
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleFavorite(item);
//                         }}
//                         style={{
//                           color: favoriteRecipes.some((r) => r._id === item._id) ? "red" : "#213547",
//                           cursor: "pointer",
//                           fontSize: '18px',
//                           transition: 'color 0.3s ease'
//                         }}
//                         data-action="true"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))
//       ) : (
//         hasActiveSearch && isHomePage ? (
//           null
//         ) : (
//           <div className="no-recipes-message">No recipes available</div>
//         )
//       )}
//     </div>
//   );
// }

// export default RecipeItems;


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
  hasActiveSearch = false
}) {
  const [recipes, setRecipes] = useState(loadedRecipes || []);
  
  // Route checks
  const isMyRecipePage = window.location.pathname === "/myRecipe";
  const isFavPage = window.location.pathname === "/favRecipes";
  const isHomePage = window.location.pathname === "/";
  
  // Current user and auth data
  const user = getUser();
  const token = getToken();
  
  // Load user-specific favorites only if user exists
  const [favoriteRecipes, setFavoriteRecipes] = useState(() => {
    if (user && user._id) {
      return JSON.parse(localStorage.getItem(`fav_${user._id}`)) || [];
    }
    return [];
  });

  // Handle recipe list updates (based on route and props)
  useEffect(() => {
    if (isFavPage) {
      setRecipes(favoriteRecipes);
    } else if (loadedRecipes && loadedRecipes.length >= 0) {
      setRecipes(loadedRecipes);
    }
  }, [loadedRecipes, isFavPage, favoriteRecipes]);

  // Handle favorites page re-renders
  useEffect(() => {
    if (isFavPage) {
      setRecipes(favoriteRecipes);
    }
  }, [favoriteRecipes, isFavPage]);

  // ✅ Fixed Delete Function with Authorization
  const onDelete = async (id) => {
    if (!token) {
      alert("Please login to delete recipes");
      return;
    }

    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }

    try {
      console.log("Deleting recipe with ID:", id);
      
      // ✅ Optimistic update - remove from UI immediately
      const updatedRecipes = recipes.filter((item) => item._id !== id);
      setRecipes(updatedRecipes);
      
      // ✅ Remove from favorites if exists
      if (user && user._id) {
        const updatedFavorites = favoriteRecipes.filter((recipe) => recipe._id !== id);
        setFavoriteRecipes(updatedFavorites);
        localStorage.setItem(`fav_${user._id}`, JSON.stringify(updatedFavorites));
      }
      
      // ✅ Make API call with proper authorization
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/recipes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Recipe deleted successfully:", response.data);
      
    } catch (error) {
      console.error("Error deleting recipe:", error);
      
      // ✅ Revert UI changes on error
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
        alert("Recipe not found.");
      } else {
        alert(`Failed to delete recipe: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  // ✅ Fixed Toggle Favorite Function
  const toggleFavorite = (item) => {
    if (!token) {
      if (onLoginRequired) onLoginRequired();
      return;
    }

    // ✅ Ensure user exists
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
    localStorage.setItem(`fav_${user._id}`, JSON.stringify(updatedFavorites));
    
    // ✅ Update recipes list if on favorites page
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
            key={item._id || index} // ✅ Use _id as key when available
            className="card"
            onClick={(e) => handleCardClick(item, e)}
          >
            <img 
              src={item.coverImage || '/placeholder.jpg'}
              alt={item.title}
              onError={(e) => {
                e.target.src = '/placeholder.jpg'; // ✅ Fallback for broken images
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

