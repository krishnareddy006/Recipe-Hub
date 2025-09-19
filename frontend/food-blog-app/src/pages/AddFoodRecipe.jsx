import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddFoodRecipe() {
  const [recipeData, setRecipeData] = useState({})
  const navigate = useNavigate()

  const onHandleChange = (e) => {
      let val = (e.target.name === "ingredients") ? e.target.value.split(",") : (e.target.name === "file") ? e.target.files[0] : e.target.value
      setRecipeData(pre => ({ ...pre, [e.target.name]: val }))
  }

  const onHandleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", recipeData.title);
    formData.append("time", recipeData.time);
    formData.append("instructions", recipeData.instructions);
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
                      <input type="text" className='input' name="title" onChange={onHandleChange}></input>
                  </div>
                  <div className='form-control'>
                      <label>Time</label>
                      <input type="text" className='input' name="time" onChange={onHandleChange}></input>
                  </div>
                  <div className='form-control'>
                      <label>Ingredients</label>
                      <textarea type="text" className='input-textarea' name="ingredients" rows="5" onChange={onHandleChange}></textarea>
                  </div>
                  <div className='form-control'>
                      <label>Instructions</label>
                      <textarea type="text" className='input-textarea' name="instructions" rows="5" onChange={onHandleChange}></textarea>
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