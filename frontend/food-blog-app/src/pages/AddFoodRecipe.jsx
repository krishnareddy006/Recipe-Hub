import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddFoodRecipe() {
  const [recipeData, setRecipeData] = useState({})
  const navigate = useNavigate()

  // Handle input change and update state
  const onHandleChange = (e) => {
    let val = (e.target.name === "ingredients") ? e.target.value.split(",") :
      (e.target.name === "file") ? e.target.files[0] :
        e.target.value
    setRecipeData(pre => ({ ...pre, [e.target.name]: val }))
  }

  // Submit new recipe data
  const onHandleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", recipeData.title);
    formData.append("time", recipeData.time);
    formData.append("instructions", recipeData.instructions);
    formData.append("dietType", recipeData.dietType || "");
    formData.append("cuisineType", recipeData.cuisineType || "");
    formData.append("country", recipeData.country || "");

    if (recipeData.file) formData.append("file", recipeData.file);

    if (recipeData.ingredients && recipeData.ingredients.length > 0) {
      recipeData.ingredients.forEach(ingredient =>
        formData.append("ingredients", ingredient.trim())
      );
    }

    try {
      await axios.post("http://localhost:5000/recipes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      navigate("/");
    } catch (error) {
      console.error("Error while submitting recipe:", error.response?.data || error);
    }
  };

  return (
    <>
      <div className='container'>
        <form className='form' onSubmit={onHandleSubmit}>
          <div className='form-control'>
            <label>Title</label>
            <input type="text" className='input' name="title" onChange={onHandleChange} placeholder="Enter recipe name (e.g., Chicken Biryani)"></input>
          </div>
          <div className='form-control'>
            <label>Time</label>
            <input type="text" className='input' name="time" onChange={onHandleChange} placeholder="Enter cooking time (e.g., 30 mins)"></input>
          </div>
          <div className='form-control'>
            <label>Diet Type</label>
            <select className='input' name="dietType" onChange={onHandleChange}>
              <option value="">Select Diet Type</option>
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
            </select>
          </div>
          <div className='form-control'>
            <label>Cuisine Type</label>
            <input type="text" className='input' name="cuisineType" onChange={onHandleChange} placeholder="Enter cuisine type (e.g., Curry, Salad, Dessert)"></input>
          </div>
          <div className='form-control'>
            <label>Country</label>
            <input type="text" className='input' name="country" onChange={onHandleChange} placeholder="Enter country of origin (e.g., Indian, Italian, Chinese)"></input>
          </div>
          <div className='form-control'>
            <label>Ingredients</label>
            <textarea type="text" className='input-textarea' name="ingredients" rows="5" onChange={onHandleChange} placeholder="Enter ingredients separated by commas (e.g., Rice, Chicken, Onions)"></textarea>
          </div>
          <div className='form-control'>
            <label>Instructions</label>
            <textarea type="text" className='input-textarea' name="instructions" rows="5" onChange={onHandleChange} placeholder="Enter step-by-step cooking instructions"></textarea>
          </div>
          <div className='form-control'>
            <label>Recipe Image</label>
            <input type="file" className='input' name="file" onChange={onHandleChange}></input>
          </div>
          <button type="submit">Add Recipe</button>
        </form>
      </div>
    </>
  )
}

export default AddFoodRecipe;
