// import axios from 'axios'
// import React, { useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'

// function EditRecipe() {
//   const [recipeData, setRecipeData] = useState({})
//   const navigate = useNavigate()
//   const { id } = useParams();

//   // Fetch recipe details on component mount
//   useEffect(() => {
//     const fetchRecipe = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_URL}/recipes/${id}`);
//         let res = response.data;
//         setRecipeData({
//           title: res.title,
//           time: res.time,
//           ingredients: res.ingredients,
//           instructions: res.instructions,
//           dietType: res.dietType || "",
//           cuisineType: res.cuisineType || "",
//           country: res.country || ""
//         });
//       } catch (error) {
//         console.error("Error fetching recipe:", error);
//       }
//     }
//     fetchRecipe();
//   }, [])

//   // Handle input change and update state
//   const onHandleChange = (e) => {
//     let val = (e.target.name === "ingredients") ? e.target.value.split(",") :
//       (e.target.name === "file") ? e.target.files[0] :
//         e.target.value
//     setRecipeData(pre => ({ ...pre, [e.target.name]: val }))
//   }

//   // Submit updated recipe data
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
//       await axios.put(`${import.meta.env.VITE_API_URL}/recipes/${id}`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           "Authorization": `Bearer ${localStorage.getItem("token")}`
//         }
//       });
//       navigate("/myRecipe");
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
//             <input type="text" className='input' name="title" onChange={onHandleChange} value={recipeData.title || ""}></input>
//           </div>
//           <div className='form-control'>
//             <label>Time</label>
//             <input type="text" className='input' name="time" onChange={onHandleChange} value={recipeData.time || ""}></input>
//           </div>
//           <div className='form-control'>
//             <label>Diet Type</label>
//             <select className='input' name="dietType" onChange={onHandleChange} value={recipeData.dietType || ""}>
//               <option value="">Select Diet Type</option>
//               <option value="Veg">Veg</option>
//               <option value="Non-Veg">Non-Veg</option>
//             </select>
//           </div>
//           <div className='form-control'>
//             <label>Cuisine Type</label>
//             <input type="text" className='input' name="cuisineType" onChange={onHandleChange} value={recipeData.cuisineType || ""}></input>
//           </div>
//           <div className='form-control'>
//             <label>Country</label>
//             <input type="text" className='input' name="country" onChange={onHandleChange} value={recipeData.country || ""}></input>
//           </div>
//           <div className='form-control'>
//             <label>Ingredients</label>
//             <textarea type="text" className='input-textarea' name="ingredients" rows="5" onChange={onHandleChange} value={recipeData.ingredients?.join(",") || ""} ></textarea>
//           </div>
//           <div className='form-control'>
//             <label>Instructions</label>
//             <textarea type="text" className='input-textarea' name="instructions" rows="5" onChange={onHandleChange} value={recipeData.instructions || ""}></textarea>
//           </div>
//           <div className='form-control'>
//             <label>Recipe Image</label>
//             <input type="file" className='input' name="file" onChange={onHandleChange} ></input>
//           </div>
//           <button type="submit">Edit Recipe</button>
//         </form>
//       </div>
//     </>
//   )
// }

// export default EditRecipe;

// import axios from 'axios'
// import React, { useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'

// function EditRecipe() {
//   const [recipeData, setRecipeData] = useState({})
//   const [isSubmitting, setIsSubmitting] = useState(false) // ✅ Prevent double submission
//   const [isLoading, setIsLoading] = useState(true) // ✅ Loading state
//   const [imagePreview, setImagePreview] = useState(null) // ✅ Image preview
//   const navigate = useNavigate()
//   const { id } = useParams();

//   // ✅ Enhanced fetch recipe with loading state
//   useEffect(() => {
//     const fetchRecipe = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get(`${import.meta.env.VITE_API_URL}/recipes/${id}`);
//         const res = response.data;
        
//         setRecipeData({
//           title: res.title || "",
//           time: res.time || "",
//           ingredients: res.ingredients || [],
//           instructions: res.instructions || "",
//           dietType: res.dietType || "",
//           cuisineType: res.cuisineType || "",
//           country: res.country || "",
//           currentImage: res.image || null
//         });
//       } catch (error) {
//         console.error("Error fetching recipe:", error);
//         alert("Failed to load recipe. Please try again.");
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     if (id) fetchRecipe();
//   }, [id]);

//   // ✅ Enhanced input change handler
//   const onHandleChange = (e) => {
//     let val;
    
//     if (e.target.name === "ingredients") {
//       val = e.target.value.split(",");
//     } else if (e.target.name === "file") {
//       val = e.target.files[0];
//       // ✅ Create image preview
//       if (val) {
//         const reader = new FileReader();
//         reader.onloadend = () => setImagePreview(reader.result);
//         reader.readAsDataURL(val);
//       }
//     } else {
//       val = e.target.value;
//     }
    
//     setRecipeData(prev => ({ ...prev, [e.target.name]: val }));
//   }

//   // ✅ Enhanced submit handler
//   const onHandleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (isSubmitting) return; // ✅ Prevent double submission
//     setIsSubmitting(true);

//     const formData = new FormData();
    
//     // ✅ Append all fields
//     formData.append("title", recipeData.title || "");
//     formData.append("time", recipeData.time || "");
//     formData.append("instructions", recipeData.instructions || "");
//     formData.append("dietType", recipeData.dietType || "");
//     formData.append("cuisineType", recipeData.cuisineType || "");
//     formData.append("country", recipeData.country || "");

//     // ✅ Handle file upload
//     if (recipeData.file) {
//       formData.append("file", recipeData.file);
//     }

//     // ✅ Handle ingredients array
//     if (recipeData.ingredients && recipeData.ingredients.length > 0) {
//       recipeData.ingredients.forEach(ingredient => {
//         if (ingredient.trim()) {
//           formData.append("ingredients", ingredient.trim());
//         }
//       });
//     }

//     try {
//       const token = localStorage.getItem("token");
      
//       const response = await axios.put(
//         `${import.meta.env.VITE_API_URL}/recipes/${id}`, 
//         formData, 
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             "Authorization": `Bearer ${token}`
//           }
//         }
//       );

//       if (response.status === 200) {
//         navigate("/myRecipe", { replace: true }); // ✅ Use replace
//       }
//     } catch (error) {
//       console.error("Error while updating recipe:", error);
//       alert("Failed to update recipe. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ✅ Show loading state
//   if (isLoading) {
//     return (
//       <div className='container' style={{ textAlign: 'center', paddingTop: '2rem' }}>
//         <h2>Loading recipe...</h2>
//       </div>
//     );
//   }

//   return (
//     <div className='container'>
//       <form className='form' onSubmit={onHandleSubmit}>
//         <div className='form-control'>
//           <label>Title*</label>
//           <input 
//             type="text" 
//             className='input' 
//             name="title" 
//             onChange={onHandleChange} 
//             value={recipeData.title || ""}
//             disabled={isSubmitting}
//             required
//           />
//         </div>
        
//         <div className='form-control'>
//           <label>Time*</label>
//           <input 
//             type="text" 
//             className='input' 
//             name="time" 
//             onChange={onHandleChange} 
//             value={recipeData.time || ""}
//             disabled={isSubmitting}
//             required
//           />
//         </div>
        
//         <div className='form-control'>
//           <label>Diet Type</label>
//           <select 
//             className='input' 
//             name="dietType" 
//             onChange={onHandleChange} 
//             value={recipeData.dietType || ""}
//             disabled={isSubmitting}
//           >
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
//             value={recipeData.cuisineType || ""}
//             disabled={isSubmitting}
//           />
//         </div>
        
//         <div className='form-control'>
//           <label>Country</label>
//           <input 
//             type="text" 
//             className='input' 
//             name="country" 
//             onChange={onHandleChange} 
//             value={recipeData.country || ""}
//             disabled={isSubmitting}
//           />
//         </div>
        
//         <div className='form-control'>
//           <label>Ingredients*</label>
//           <textarea 
//             className='input-textarea' 
//             name="ingredients" 
//             rows="5" 
//             onChange={onHandleChange} 
//             value={recipeData.ingredients?.join(",") || ""}
//             disabled={isSubmitting}
//             required
//           />
//         </div>
        
//         <div className='form-control'>
//           <label>Instructions*</label>
//           <textarea 
//             className='input-textarea' 
//             name="instructions" 
//             rows="5" 
//             onChange={onHandleChange} 
//             value={recipeData.instructions || ""}
//             disabled={isSubmitting}
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
//             disabled={isSubmitting}
//           />
//           {imagePreview ? (
//             <div style={{ marginTop: '10px' }}>
//               <img 
//                 src={imagePreview} 
//                 alt="New Preview" 
//                 style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
//               />
//             </div>
//           ) : recipeData.currentImage ? (
//             <div style={{ marginTop: '10px' }}>
//               <img 
//                 src={`${import.meta.env.VITE_API_URL}/${recipeData.currentImage}`} 
//                 alt="Current Recipe" 
//                 style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
//               />
//             </div>
//           ) : null}
//         </div>
        
//         <button type="submit" disabled={isSubmitting}>
//           {isSubmitting ? "Updating Recipe..." : "Update Recipe"}
//         </button>
//       </form>
//     </div>
//   )
// }

// export default EditRecipe;




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

  // Fetch recipe details on component mount
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
    
    if (id) {
      fetchRecipe();
    }
  }, [id])

  const onHandleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "file") {
      const file = files[0];
      setRecipeData(prev => ({ ...prev, file: file }));
      
      // Create image preview
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
      
      // Append required fields
      formData.append("title", recipeData.title || "");
      formData.append("time", recipeData.time || "");
      formData.append("instructions", recipeData.instructions || "");
      
      // Append optional fields
      formData.append("dietType", recipeData.dietType || "");
      formData.append("cuisineType", recipeData.cuisineType || "");
      formData.append("country", recipeData.country || "");

      // Handle ingredients - split by comma
      if (recipeData.ingredients) {
        const ingredientsArray = recipeData.ingredients.split(",");
        ingredientsArray.forEach(ingredient => {
          if (ingredient.trim()) {
            formData.append("ingredients", ingredient.trim());
          }
        });
      }

      // Handle file upload
      if (recipeData.file) {
        formData.append("file", recipeData.file);
      }

      const token = localStorage.getItem("token");
      
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/recipes/${id}`, 
        formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      console.log("Recipe updated successfully:", response.data);
      
      navigate("/myRecipe");
      
    } catch (error) {
      console.error("Full error:", error);
      console.error("Error response:", error.response?.data);
      
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
                src={`${import.meta.env.VITE_API_URL}/images/${currentImage}`} 
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
