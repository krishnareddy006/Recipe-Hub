import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditRecipe() {
  const [recipeData, setRecipeData] = useState({})
  const navigate = useNavigate()
  const { id } = useParams();

  // Fetch recipe details on component mount
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/recipes/${id}`);
        let res = response.data;
        setRecipeData({
          title: res.title,
          time: res.time,
          ingredients: res.ingredients,
          instructions: res.instructions,
          dietType: res.dietType || "",
          cuisineType: res.cuisineType || "",
          country: res.country || ""
        });
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    }
    fetchRecipe();
  }, [])

  // Handle input change and update state
  const onHandleChange = (e) => {
    let val = (e.target.name === "ingredients") ? e.target.value.split(",") :
      (e.target.name === "file") ? e.target.files[0] :
        e.target.value
    setRecipeData(pre => ({ ...pre, [e.target.name]: val }))
  }

  // Submit updated recipe data
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
      await axios.put(`http://localhost:5000/recipes/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      navigate("/myRecipe");
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
            <input type="text" className='input' name="title" onChange={onHandleChange} value={recipeData.title || ""}></input>
          </div>
          <div className='form-control'>
            <label>Time</label>
            <input type="text" className='input' name="time" onChange={onHandleChange} value={recipeData.time || ""}></input>
          </div>
          <div className='form-control'>
            <label>Diet Type</label>
            <select className='input' name="dietType" onChange={onHandleChange} value={recipeData.dietType || ""}>
              <option value="">Select Diet Type</option>
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
            </select>
          </div>
          <div className='form-control'>
            <label>Cuisine Type</label>
            <input type="text" className='input' name="cuisineType" onChange={onHandleChange} value={recipeData.cuisineType || ""}></input>
          </div>
          <div className='form-control'>
            <label>Country</label>
            <input type="text" className='input' name="country" onChange={onHandleChange} value={recipeData.country || ""}></input>
          </div>
          <div className='form-control'>
            <label>Ingredients</label>
            <textarea type="text" className='input-textarea' name="ingredients" rows="5" onChange={onHandleChange} value={recipeData.ingredients?.join(",") || ""} ></textarea>
          </div>
          <div className='form-control'>
            <label>Instructions</label>
            <textarea type="text" className='input-textarea' name="instructions" rows="5" onChange={onHandleChange} value={recipeData.instructions || ""}></textarea>
          </div>
          <div className='form-control'>
            <label>Recipe Image</label>
            <input type="file" className='input' name="file" onChange={onHandleChange} ></input>
          </div>
          <button type="submit">Edit Recipe</button>
        </form>
      </div>
    </>
  )
}

export default EditRecipe;
