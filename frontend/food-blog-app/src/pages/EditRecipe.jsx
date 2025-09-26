import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditRecipe() {
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
  const [currentImage, setCurrentImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { id } = useParams();

  // Load recipe details on mount
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/recipes/${id}`);
        const res = response.data;
        
        setRecipeData({
          title: res.title || "",
          time: res.time || "",
          ingredients: res.ingredients ? res.ingredients.join(",") : "",
          instructions: res.instructions || "",
          dietType: res.dietType || "",
          cuisineType: res.cuisineType || "",
          country: res.country || "",
          file: null
        });
        
        if (res.coverImage) {
          setCurrentImage(res.coverImage);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        alert("Failed to load recipe data.");
      } finally {
        setIsLoading(false);
      }
    }
    
    if (id) fetchRecipe();
  }, [id])

  // Handle form field changes
  const onHandleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "file") {
      const file = files[0];
      setRecipeData(prev => ({ ...prev, file: file }));
      
      if (file) {
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setRecipeData(prev => ({ ...prev, [name]: value }));
    }
  }

  // Submit updated recipe
  const onHandleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", recipeData.title || "");
      formData.append("time", recipeData.time || "");
      formData.append("instructions", recipeData.instructions || "");
      formData.append("dietType", recipeData.dietType || "");
      formData.append("cuisineType", recipeData.cuisineType || "");
      formData.append("country", recipeData.country || "");

      if (recipeData.ingredients) {
        const ingredientsArray = recipeData.ingredients.split(",");
        ingredientsArray.forEach(ingredient => {
          if (ingredient.trim()) formData.append("ingredients", ingredient.trim());
        });
      }

      if (recipeData.file) formData.append("file", recipeData.file);

      const token = localStorage.getItem("token");
      
      await axios.put(
        `${import.meta.env.VITE_API_URL}/recipes/${id}`, 
        formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      navigate("/myRecipe");
    } catch (error) {
      console.error("Full error:", error);
      if (error.response?.status === 401) {
        alert("Please login again to edit recipes.");
        localStorage.clear();
        navigate("/");
      } else {
        alert(`Failed to update recipe: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='container' style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <h2>Loading recipe...</h2>
      </div>
    );
  }

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
          
          {imagePreview ? (
            <div style={{ marginTop: '10px' }}>
              <p style={{ fontSize: '14px', color: '#213547', marginBottom: '5px' }}>
                New Image Preview:
              </p>
              <img 
                src={imagePreview} 
                alt="New Recipe Preview" 
                style={{ 
                  width: '200px', 
                  height: '150px', 
                  objectFit: 'cover', 
                  borderRadius: '8px',
                  border: '2px solid #e67e22'
                }}
              />
            </div>
          ) : currentImage ? (
            <div style={{ marginTop: '10px' }}>
              <p style={{ fontSize: '14px', color: '#213547', marginBottom: '5px' }}>
                Current Image:
              </p>
              <img 
                src={currentImage}
                alt="Current Recipe" 
                style={{ 
                  width: '200px', 
                  height: '150px', 
                  objectFit: 'cover', 
                  borderRadius: '8px',
                  border: '2px solid #213547'
                }}
              />
            </div>
          ) : null}
        </div>
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating Recipe..." : "Update Recipe"}
        </button>
      </form>
    </div>
  )
}

export default EditRecipe;
