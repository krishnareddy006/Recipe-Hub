// import axios from 'axios'
// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// function AddFoodRecipe() {
//   const [recipeData, setRecipeData] = useState({})
//   const navigate = useNavigate()

//   // Handle input change and update state
//   const onHandleChange = (e) => {
//     let val = (e.target.name === "ingredients") ? e.target.value.split(",") :
//       (e.target.name === "file") ? e.target.files[0] :
//         e.target.value
//     setRecipeData(pre => ({ ...pre, [e.target.name]: val }))
//   }

//   // Submit new recipe data
//   const onHandleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("title", recipeData.title);
//     formData.append("time", recipeData.time);
//     formData.append("instructions", recipeData.instructions);
//     formData.append("dietType", recipeData.dietType || "");
//     formData.append("cuisineType", recipeData.cuisineType || "");
//     formData.append("country", recipeData.country || "");

//     if (recipeData.file) formData.append("file", recipeData.file);

//     if (recipeData.ingredients && recipeData.ingredients.length > 0) {
//       recipeData.ingredients.forEach(ingredient =>
//         formData.append("ingredients", ingredient.trim())
//       );
//     }

//     try {
//       await axios.post(`${import.meta.env.VITE_API_URL}/recipes`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           "Authorization": `Bearer ${localStorage.getItem("token")}`
//         }
//       });
//       navigate("/");
//     } catch (error) {
//       console.error("Error while submitting recipe:", error.response?.data || error);
//     }
//   };

//   return (
//     <>
//       <div className='container'>
//         <form className='form' onSubmit={onHandleSubmit}>
//           <div className='form-control'>
//             <label>Title</label>
//             <input type="text" className='input' name="title" onChange={onHandleChange} placeholder="Enter recipe name (e.g., Chicken Biryani)"></input>
//           </div>
//           <div className='form-control'>
//             <label>Time</label>
//             <input type="text" className='input' name="time" onChange={onHandleChange} placeholder="Enter cooking time (e.g., 30 mins)"></input>
//           </div>
//           <div className='form-control'>
//             <label>Diet Type</label>
//             <select className='input' name="dietType" onChange={onHandleChange}>
//               <option value="">Select Diet Type</option>
//               <option value="Veg">Veg</option>
//               <option value="Non-Veg">Non-Veg</option>
//             </select>
//           </div>
//           <div className='form-control'>
//             <label>Cuisine Type</label>
//             <input type="text" className='input' name="cuisineType" onChange={onHandleChange} placeholder="Enter cuisine type (e.g., Curry, Salad, Dessert)"></input>
//           </div>
//           <div className='form-control'>
//             <label>Country</label>
//             <input type="text" className='input' name="country" onChange={onHandleChange} placeholder="Enter country of origin (e.g., Indian, Italian, Chinese)"></input>
//           </div>
//           <div className='form-control'>
//             <label>Ingredients</label>
//             <textarea type="text" className='input-textarea' name="ingredients" rows="5" onChange={onHandleChange} placeholder="Enter ingredients separated by commas (e.g., Rice, Chicken, Onions)"></textarea>
//           </div>
//           <div className='form-control'>
//             <label>Instructions</label>
//             <textarea type="text" className='input-textarea' name="instructions" rows="5" onChange={onHandleChange} placeholder="Enter step-by-step cooking instructions"></textarea>
//           </div>
//           <div className='form-control'>
//             <label>Recipe Image</label>
//             <input type="file" className='input' name="file" onChange={onHandleChange}></input>
//           </div>
//           <button type="submit">Add Recipe</button>
//         </form>
//       </div>
//     </>
//   )
// }

// export default AddFoodRecipe;



// import axios from 'axios'
// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { getToken } from '../utils/AuthUtils'

// function AddFoodRecipe() {
//   const [recipeData, setRecipeData] = useState({})
//   const [imagePreview, setImagePreview] = useState(null)
//   const navigate = useNavigate()

//   const onHandleChange = (e) => {
//     const { name, value, files } = e.target;
    
//     if (name === "ingredients") {
//       setRecipeData(prev => ({ ...prev, [name]: value.split(",") }));
//     } else if (name === "file") {
//       const file = files[0];
//       setRecipeData(prev => ({ ...prev, [name]: file }));
      
//       // ✅ Create image preview
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = (e) => setImagePreview(e.target.result);
//         reader.readAsDataURL(file);
//       } else {
//         setImagePreview(null);
//       }
//     } else {
//       setRecipeData(prev => ({ ...prev, [name]: value }));
//     }
//   }

//   const onHandleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
    
//     // ✅ Append all data properly
//     if (recipeData.title) formData.append("title", recipeData.title);
//     if (recipeData.time) formData.append("time", recipeData.time);
//     if (recipeData.instructions) formData.append("instructions", recipeData.instructions);
//     if (recipeData.dietType) formData.append("dietType", recipeData.dietType);
//     if (recipeData.cuisineType) formData.append("cuisineType", recipeData.cuisineType);
//     if (recipeData.country) formData.append("country", recipeData.country);

//     // ✅ Handle file upload
//     if (recipeData.file) {
//       formData.append("file", recipeData.file);
//     }

//     // ✅ Handle ingredients
//     if (recipeData.ingredients && recipeData.ingredients.length > 0) {
//       recipeData.ingredients.forEach(ingredient => {
//         if (ingredient.trim()) {
//           formData.append("ingredients", ingredient.trim());
//         }
//       });
//     }

//     try {
//       await axios.post(`${import.meta.env.VITE_API_URL}/recipes`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           "Authorization": `Bearer ${getToken()}`
//         }
//       });
      
//       navigate("/");
      
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Please fill all required fields and try again.");
//     }
//   };

//   return (
//     <div className='container'>
//       <form className='form' onSubmit={onHandleSubmit}>
//         <div className='form-control'>
//           <label>Title *</label>
//           <input 
//             type="text" 
//             className='input' 
//             name="title" 
//             onChange={onHandleChange} 
//             placeholder="Enter recipe name"
//             required
//           />
//         </div>
        
//         <div className='form-control'>
//           <label>Time *</label>
//           <input 
//             type="text" 
//             className='input' 
//             name="time" 
//             onChange={onHandleChange} 
//             placeholder="e.g., 30 mins"
//             required
//           />
//         </div>
        
//         <div className='form-control'>
//           <label>Diet Type</label>
//           <select className='input' name="dietType" onChange={onHandleChange}>
//             <option value="">Select Diet Type</option>
//             <option value="Veg">Veg</option>
//             <option value="Non-Veg">Non-Veg</option>
//           </select>
//         </div>
        
//         <div className='form-control'>
//           <label>Cuisine Type</label>
//           <input 
//             type="text" 
//             className='input' 
//             name="cuisineType" 
//             onChange={onHandleChange} 
//             placeholder="e.g., Indian, Italian"
//           />
//         </div>
        
//         <div className='form-control'>
//           <label>Country</label>
//           <input 
//             type="text" 
//             className='input' 
//             name="country" 
//             onChange={onHandleChange} 
//             placeholder="e.g., India, Italy"
//           />
//         </div>
        
//         <div className='form-control'>
//           <label>Ingredients *</label>
//           <textarea 
//             className='input-textarea' 
//             name="ingredients" 
//             rows="4" 
//             onChange={onHandleChange} 
//             placeholder="Enter ingredients separated by commas"
//             required
//           />
//         </div>
        
//         <div className='form-control'>
//           <label>Instructions *</label>
//           <textarea 
//             className='input-textarea' 
//             name="instructions" 
//             rows="5" 
//             onChange={onHandleChange} 
//             placeholder="Step-by-step cooking instructions"
//             required
//           />
//         </div>
        
//         <div className='form-control'>
//           <label>Recipe Image</label>
//           <input 
//             type="file" 
//             className='input' 
//             name="file" 
//             onChange={onHandleChange}
//             accept="image/*"
//           />
//           {imagePreview && (
//             <div style={{ marginTop: '10px' }}>
//               <img 
//                 src={imagePreview} 
//                 alt="Preview" 
//                 style={{ 
//                   width: '200px', 
//                   height: '150px', 
//                   objectFit: 'cover', 
//                   borderRadius: '8px',
//                   border: '2px solid #e67e22'
//                 }}
//               />
//             </div>
//           )}
//         </div>
        
//         <button type="submit">Add Recipe</button>
//       </form>
//     </div>
//   )
// }

// export default AddFoodRecipe;



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

  const onHandleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "file") {
      const file = files[0];
      setRecipeData(prev => ({ ...prev, file: file }));
      
      // ✅ Create image preview
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

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // ✅ Append required fields
      formData.append("title", recipeData.title || "");
      formData.append("time", recipeData.time || "");
      formData.append("instructions", recipeData.instructions || "");
      
      // ✅ Append optional fields
      formData.append("dietType", recipeData.dietType || "");
      formData.append("cuisineType", recipeData.cuisineType || "");
      formData.append("country", recipeData.country || "");

      // ✅ Handle ingredients - split by comma
      if (recipeData.ingredients) {
        const ingredientsArray = recipeData.ingredients.split(",");
        ingredientsArray.forEach(ingredient => {
          if (ingredient.trim()) {
            formData.append("ingredients", ingredient.trim());
          }
        });
      }

      // ✅ Handle file upload
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
      
      // ✅ Navigate back to home
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
            placeholder="e.g., Indian, Italian"
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
            placeholder="e.g., India, Italy"
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
