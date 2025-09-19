import React, { useState, useEffect } from 'react';
import foodRecipe from '../assets/foodRecipe.png';
import RecipeItems from '../components/RecipeItems';
import { useNavigate, useLoaderData } from 'react-router-dom';
import Modal from '../components/Modal';
import InputForm from '../components/InputForm';
import RecipeModal from '../components/RecipeModal';
import { FaSearch, FaTimes } from 'react-icons/fa';

function Home() {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Track login state reactively
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Sync login state when localStorage changes
  useEffect(() => {
    const checkLogin = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const toAddRecipe = () => {
    if (isLoggedIn) navigate("/addRecipe");
    else setIsLoginOpen(true);
  };

  function closeLoginModal() {
    setIsLoginOpen(false);
    setIsLoggedIn(!!localStorage.getItem("token"));
  }

  function closeRecipeModal() {
    setIsRecipeModalOpen(false);
    setSelectedRecipe(null);
  }

  function handleViewRecipe(recipe) {
    setSelectedRecipe(recipe);
    setIsRecipeModalOpen(true);
  }

  function showLoginModal() {
    setIsLoginOpen(true);
  }

  const recipes = useLoaderData() || [];

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === '') setFilteredRecipes([]);
    else setFilteredRecipes(recipes.filter(r => r.title.toLowerCase().includes(term)));
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredRecipes([]);
  };

  const displayRecipes = searchTerm ? filteredRecipes : recipes;

  return (
    <>      
      <section className='home'>
        <div className='left'>
          <h1 className='hero-title'>
            Recipe <span>Magic</span><br/>
            <span>Happens</span> Here
          </h1>
          
          <h5 className='hero-paragraph'>
            Life's too short for boring food and untold kitchen stories! From epic cooking wins to hilarious culinary catastrophes, every dish has a tale that deserves to be shared. Maybe it's your grandmother's secret spice blend, that accidental masterpiece you created at 2 AM, or the recipe that always makes your friends say 'you HAVE to give me this recipe!' Food connects us, stories inspire us, and sharing makes it all worthwhile. Ready to turn your kitchen adventures into everyone's next favorite dish?
          </h5>
          <button onClick={toAddRecipe}>Share your recipe</button>
        </div>
        <div className='right'>
          <img 
            src={foodRecipe} 
            alt="Delicious Food Recipe" 
            onMouseEnter={(e) => e.target.style.transform = 'rotate(0deg) scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'rotate(2deg) scale(1)'
            }
          />
        </div>
      </section>

      <div className='recipe'>
        <div className="home-search-header">
          <div className="home-search-content">
            <h2 className="home-search-title">
              Discover Your <span>Perfect Recipe</span>
            </h2>
            <p className="home-search-subtitle">
              Search by recipe name to find your favorite dishes
            </p>
            
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search recipes by name..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              {searchTerm && (
                <button onClick={clearSearch} className="search-clear">
                  <FaTimes />
                </button>
              )}
            </div>

            {searchTerm && (
              <div className="search-results-info">
                {filteredRecipes.length > 0 ? (
                  <p>Found {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} for "{searchTerm}"</p>
                ) : (
                  <p>No recipes found for "{searchTerm}". Try different keywords.</p>
                )}
              </div>
            )}
          </div>
        </div>

        <RecipeItems 
          loadedRecipes={displayRecipes}
          onViewRecipe={handleViewRecipe}
          onLoginRequired={showLoginModal}
          isLoggedIn={isLoggedIn}
        />
      </div>

      {isLoginOpen && (
        <Modal closeModal={closeLoginModal}>
          <InputForm closeModal={closeLoginModal} />
        </Modal>
      )}

      {isRecipeModalOpen && (
        <Modal closeModal={closeRecipeModal}>
          <RecipeModal recipe={selectedRecipe} onClose={closeRecipeModal} />
        </Modal>
      )}
    </>
  )
}

export default Home;
