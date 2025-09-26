import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddFoodRecipe() {
  const [recipeData, setRecipeData] = useState({
    title: '',
    time: '',
    dietType: '',
    cuisineType: '',
    country: '',
    ingredients: '',
    instructions: '',
    file: null
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  // Handle form field updates
  const onHandleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "file") {
      const file = files[0];
      setRecipeData(prev => ({ ...prev, file: file }));
      
      // Generate image preview
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setRecipeData(prev => ({ ...prev, [name]: value }));
    }
  }

  // Handle form submission
  const onHandleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // Required fields
      formData.append("title", recipeData.title || "");
      formData.append("time", recipeData.time || "");
      formData.append("instructions", recipeData.instructions || "");
      
      // Optional fields
      formData.append("dietType", recipeData.dietType || "");
      formData.append("cuisineType", recipeData.cuisineType || "");
      formData.append("country", recipeData.country || "");

      // Handle ingredients (split by comma)
      if (recipeData.ingredients) {
        const ingredientsArray = recipeData.ingredients.split(",");
        ingredientsArray.forEach(ingredient => {
          if (ingredient.trim()) {
            formData.append("ingredients", ingredient.trim());
          }
        });
      }

      // Handle image upload
      if (recipeData.file) {
        formData.append("file", recipeData.file);
      }

      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/recipes`, 
        formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      console.log("Recipe added successfully:", response.data);
      
      // Navigate to home on success
      navigate("/");
      
    } catch (error) {
      console.error("Full error:", error);
      console.error("Error response:", error.response?.data);
      
      if (error.response?.status === 401) {
        alert("Please login again to add recipes.");
        localStorage.clear();
        navigate("/");
      } else {
        alert(`Failed to add recipe: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='container'>
      <form className='form' onSubmit={onHandleSubmit}>
        <div className='form-control'>
          <label>Title *</label>
          <input 
            type="text" 
            className='input' 
            name="title" 
            value={recipeData.title}
            onChange={onHandleChange} 
            placeholder="Enter recipe name"
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className='form-control'>
          <label>Time *</label>
          <input 
            type="text" 
            className='input' 
            name="time" 
            value={recipeData.time}
            onChange={onHandleChange} 
            placeholder="e.g., 30 mins"
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className='form-control'>
          <label>Diet Type</label>
          <select 
            className='input' 
            name="dietType" 
            value={recipeData.dietType}
            onChange={onHandleChange}
            disabled={isSubmitting}
          >
            <option value="">Select Diet Type</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>
        </div>
        
        <div className='form-control'>
          <label>Cuisine Type</label>
          <input 
            type="text" 
            className='input' 
            name="cuisineType" 
            value={recipeData.cuisineType}
            onChange={onHandleChange} 
            placeholder="e.g., Main Course, Dessert, Appetizer"
            disabled={isSubmitting}
          />
        </div>
        
        <div className='form-control'>
          <label>Country</label>
          <input 
            type="text" 
            className='input' 
            name="country" 
            value={recipeData.country}
            onChange={onHandleChange} 
            placeholder="e.g., Indian, Italian, Mexican, Chinese"
            disabled={isSubmitting}
          />
        </div>
        
        <div className='form-control'>
          <label>Ingredients *</label>
          <textarea 
            className='input-textarea' 
            name="ingredients" 
            rows="4" 
            value={recipeData.ingredients}
            onChange={onHandleChange} 
            placeholder="Enter ingredients separated by commas (e.g., Rice, Chicken, Onions)"
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className='form-control'>
          <label>Instructions *</label>
          <textarea 
            className='input-textarea' 
            name="instructions" 
            rows="5" 
            value={recipeData.instructions}
            onChange={onHandleChange} 
            placeholder="Step-by-step cooking instructions"
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className='form-control'>
          <label>Recipe Image</label>
          <input 
            type="file" 
            className='input' 
            name="file" 
            onChange={onHandleChange}
            accept="image/*"
            disabled={isSubmitting}
          />
          {imagePreview && (
            <div style={{ marginTop: '10px' }}>
              <p style={{ fontSize: '14px', color: '#213547', marginBottom: '5px' }}>
                Image Preview:
              </p>
              <img 
                src={imagePreview} 
                alt="Recipe Preview" 
                style={{ 
                  width: '200px', 
                  height: '150px', 
                  objectFit: 'cover', 
                  borderRadius: '8px',
                  border: '2px solid #e67e22'
                }}
              />
            </div>
          )}
        </div>
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding Recipe..." : "Add Recipe"}
        </button>
      </form>
    </div>
  )
}

export default AddFoodRecipe;
