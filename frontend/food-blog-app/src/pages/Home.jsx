import React, { useState } from 'react';
import recipeImg from '../assets/recipeImg.jpg'
import RecipeItems from '../components/RecipeItems';
import { useNavigate, useLoaderData } from 'react-router-dom';
import Modal from '../components/Modal';
import InputForm from '../components/InputForm';
import RecipeModal from '../components/RecipeModal';
import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa';
import { isLoggedIn } from '../utils/AuthUtils';

function Home() {
  const navigate = useNavigate();
  const initialRecipes = useLoaderData() || [];
  const [recipes, setRecipes] = useState(initialRecipes);
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    dietType: '',
    cuisineType: '',
    country: ''
  });

  // Sync recipes when loader data updates
  React.useEffect(() => {
    setRecipes(initialRecipes);
  }, [initialRecipes]);

  // Remove deleted recipe from local state
  const handleRecipeDeleted = (deletedRecipeId) => {
    setRecipes(prev => prev.filter(recipe => recipe._id !== deletedRecipeId));
  };

  const toAddRecipe = () => {
    if (isLoggedIn()) {
      navigate("/addRecipe");
    } else {
      setIsLoginOpen(true);
    }
  };

  // Apply search & filter
  let displayRecipes = recipes;
  if (searchTerm) {
    displayRecipes = displayRecipes.filter(r => 
      r.title.toLowerCase().includes(searchTerm)
    );
  }
  if (filters.dietType) {
    displayRecipes = displayRecipes.filter(r => r.dietType === filters.dietType);
  }
  if (filters.cuisineType) {
    displayRecipes = displayRecipes.filter(r => 
      r.cuisineType && r.cuisineType.toLowerCase().includes(filters.cuisineType.toLowerCase())
    );
  }
  if (filters.country) {
    displayRecipes = displayRecipes.filter(r => 
      r.country && r.country.toLowerCase().includes(filters.country.toLowerCase())
    );
  }

  const uniqueCuisines = [...new Set(recipes.map(r => r.cuisineType).filter(Boolean))];
  const uniqueCountries = [...new Set(recipes.map(r => r.country).filter(Boolean))];
  const hasActiveFilters = searchTerm || filters.dietType || filters.cuisineType || filters.country;

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
            Life's too short for boring food and untold kitchen stories! ...
          </h5>
          <button onClick={toAddRecipe}>Share your recipe</button>
        </div>
        <div className='right'>
          <img src={recipeImg} alt="Delicious Food Recipe" />
        </div>
      </section>

      {/* Search & Filter Section */}
      <div className='recipe'>
        <div className="home-search-header">
          <div className="home-search-content">
            <h2 className="home-search-title">Discover Your <span>Perfect Recipe</span></h2>
            <p className="home-search-subtitle">Search by recipe name and filter by preferences</p>
            
            <div className="search-filter-row">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search recipes by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                  className="search-input"
                />
                {searchTerm && (
                  <button onClick={() => {
                    setSearchTerm('');
                    setFilters({ dietType: '', cuisineType: '', country: '' });
                    setFilterOpen(false);
                  }} className="search-clear">
                    <FaTimes />
                  </button>
                )}
              </div>

              <button 
                className="filter-btn"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <FaFilter /> Filter
              </button>
            </div>

            {filterOpen && (
              <div className="filter-dropdown">
                <div className="filter-row">
                  <select 
                    value={filters.dietType} 
                    onChange={(e) => setFilters(prev => ({ ...prev, dietType: e.target.value }))}
                    className="filter-select"
                  >
                    <option value="">All Diet Types</option>
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                  </select>

                  <select 
                    value={filters.cuisineType} 
                    onChange={(e) => setFilters(prev => ({ ...prev, cuisineType: e.target.value }))}
                    className="filter-select"
                  >
                    <option value="">All Cuisines</option>
                    {uniqueCuisines.map(cuisine => (
                      <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                  </select>

                  <select 
                    value={filters.country} 
                    onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
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
                <p>Found {displayRecipes.length} recipe{displayRecipes.length !== 1 ? 's' : ''}</p>
              </div>
            )}
          </div>
        </div>

        {/* Recipes List */}
        <RecipeItems 
          loadedRecipes={displayRecipes}
          onViewRecipe={(recipe) => {
            setSelectedRecipe(recipe);
            setIsRecipeModalOpen(true);
          }}
          onLoginRequired={() => setIsLoginOpen(true)}
          onRecipeDeleted={handleRecipeDeleted}
          isLoggedIn={isLoggedIn()}
          hasActiveSearch={hasActiveFilters}
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
    </>
  )
}

export default Home;
