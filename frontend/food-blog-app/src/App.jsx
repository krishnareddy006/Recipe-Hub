// import React from 'react'
// import './App.css';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import Home from './pages/Home.jsx';
// import MainNavigation from './components/MainNavigation.jsx';
// import axios from 'axios';
// import AddFoodRecipe from './pages/AddFoodRecipe.jsx';
// import EditRecipe from './pages/EditRecipe.jsx';
// import RecipePage from './pages/MyRecipe.jsx'; 

// // Fetch all recipes
// const getAllRecipes = async () => {
//   try {
//     const response = await axios.get(`${import.meta.env.VITE_API_URL}/recipes`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching recipes:", error);
//     return [];
//   }
// };

// // Fetch only logged-in user's recipes
// const getMyRecipes = async () => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   let allRecipes = await getAllRecipes();
//   return user ? allRecipes.filter(item => item.createdBy === user._id) : [];
// };

// // Fetch only logged-in user's favorites
// const getFavRecipes = async () => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   if (!user) return [];
//   return JSON.parse(localStorage.getItem(`fav_${user._id}`)) || [];
// };

// // Routes
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <MainNavigation />,
//     children: [
//       { path: "/", element: <Home />, loader: getAllRecipes },
//       { path: "/myRecipe", element: <RecipePage />, loader: getMyRecipes },   
//       { path: "/favRecipes", element: <RecipePage />, loader: getFavRecipes },
//       { path: "/addRecipe", element: <AddFoodRecipe /> },
//       { path: "/editRecipe/:id", element: <EditRecipe /> }
//     ]
//   },
// ]);

// function App() {
//   return <RouterProvider router={router} />
// }

// export default App;


import React from 'react'
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home.jsx';
import MainNavigation from './components/MainNavigation.jsx';
import axios from 'axios';
import AddFoodRecipe from './pages/AddFoodRecipe.jsx';
import EditRecipe from './pages/EditRecipe.jsx';
import RecipePage from './pages/MyRecipe.jsx'; 

// Fetch all recipes
const getAllRecipes = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/recipes`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

// Fetch only logged-in user's recipes
const getMyRecipes = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  let allRecipes = await getAllRecipes();
  return user ? allRecipes.filter(item => item.createdBy === user._id) : [];
};

// Fetch only logged-in user's favorites
const getFavRecipes = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return [];
  return JSON.parse(localStorage.getItem(`fav_${user._id}`)) || [];
};

// Routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/myRecipe", element: <RecipePage />, loader: getMyRecipes },   
      { path: "/favRecipes", element: <RecipePage />, loader: getFavRecipes },
      { path: "/addRecipe", element: <AddFoodRecipe /> },
      { path: "/editRecipe/:id", element: <EditRecipe /> }
    ]
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;
