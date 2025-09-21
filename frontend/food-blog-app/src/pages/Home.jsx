import React, { useState, useEffect } from 'react';
import recipeImg from '../assets/recipeImg.jpg'
import RecipeItems from '../components/RecipeItems';
import { useNavigate, useLoaderData } from 'react-router-dom';
import Modal from '../components/Modal';
import InputForm from '../components/InputForm';
import RecipeModal from '../components/RecipeModal';
import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa';

function Home() {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  // ✅ Dynamic login state
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    dietType: '',
    cuisineType: '',
    country: ''
  });

  // ✅ Enhanced login state sync
  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    // Listen for auth events
    window.addEventListener('user-login', handleAuthChange);
    window.addEventListener('user-logout', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    
    // Periodic check
    const interval = setInterval(handleAuthChange, 500);

    return () => {
      window.removeEventListener('user-login', handleAuthChange);
      window.removeEventListener('user-logout', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
      clearInterval(interval);
    };
  }, []);

  // Navigate to add recipe page or open login modal
  const toAddRecipe = () => {
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      navigate("/addRecipe");
    } else {
      setIsLoginOpen(true);
    }
  };

  // ✅ Enhanced close modal
  function closeLoginModal() {
    setIsLoginOpen(false);
    
    // Update login state after modal closes
    setTimeout(() => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }, 200);
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

  // Search and filter logic (unchanged)
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    applyFilters(term, filters);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilters({ dietType: '', cuisineType: '', country: '' });
    setFilteredRecipes([]);
    setFilterOpen(false);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    applyFilters(searchTerm, newFilters);
  };

  const applyFilters = (searchText, currentFilters) => {
    let filtered = recipes;

    if (searchText) {
      filtered = filtered.filter(r => r.title.toLowerCase().includes(searchText));
    }
    if (currentFilters.dietType) {
      filtered = filtered.filter(r => r.dietType === currentFilters.dietType);
    }
    if (currentFilters.cuisineType) {
      filtered = filtered.filter(r => r.cuisineType && r.cuisineType.toLowerCase().includes(currentFilters.cuisineType.toLowerCase()));
    }
    if (currentFilters.country) {
      filtered = filtered.filter(r => r.country && r.country.toLowerCase().includes(currentFilters.country.toLowerCase()));
    }

    setFilteredRecipes(filtered);
  };

  const hasActiveFilters = searchTerm || filters.dietType || filters.cuisineType || filters.country;
  const displayRecipes = hasActiveFilters ? filteredRecipes : recipes;

  const uniqueCuisines = [...new Set(recipes.map(r => r.cuisineType).filter(Boolean))];
  const uniqueCountries = [...new Set(recipes.map(r => r.country).filter(Boolean))];

  return (
    <>      
      {/* Hero Section */}
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
            src={recipeImg} 
            alt="Delicious Food Recipe" 
            onMouseEnter={(e) => e.target.style.transform = 'rotate(0deg) scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'rotate(2deg) scale(1)'}
          />
        </div>
      </section>

      {/* Recipe Section with Search & Filters */}
      <div className='recipe'>
        <div className="home-search-header">
          <div className="home-search-content">
            <h2 className="home-search-title">
              Discover Your <span>Perfect Recipe</span>
            </h2>
            <p className="home-search-subtitle">
              Search by recipe name and filter by preferences
            </p>
            
            <div className="search-filter-row">
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

              <button 
                className="filter-btn"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <FaFilter />
                Filter
              </button>
            </div>

            {filterOpen && (
              <div className="filter-dropdown">
                <div className="filter-row">
                  <select 
                    value={filters.dietType} 
                    onChange={(e) => handleFilterChange('dietType', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Diet Types</option>
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                  </select>

                  <select 
                    value={filters.cuisineType} 
                    onChange={(e) => handleFilterChange('cuisineType', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Cuisines</option>
                    {uniqueCuisines.map(cuisine => (
                      <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                  </select>

                  <select 
                    value={filters.country} 
                    onChange={(e) => handleFilterChange('country', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Countries</option>
                    {uniqueCountries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {hasActiveFilters && (
              <div className="search-results-info">
                {displayRecipes.length > 0 ? (
                  <p>Found {displayRecipes.length} recipe{displayRecipes.length !== 1 ? 's' : ''}</p>
                ) : (
                  <p>No recipes found with current filters.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Render Recipe Items */}
        <RecipeItems 
          loadedRecipes={displayRecipes}
          onViewRecipe={handleViewRecipe}
          onLoginRequired={showLoginModal}
          isLoggedIn={isLoggedIn}
          hasActiveSearch={hasActiveFilters}
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
    </>
  )
}

export default Home;
