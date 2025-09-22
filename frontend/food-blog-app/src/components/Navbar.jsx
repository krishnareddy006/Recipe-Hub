// import Modal from './Modal';
// import React, { useEffect, useState, useRef } from 'react';
// import InputForm from './InputForm';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { FaUserCircle } from "react-icons/fa";

// function Navbar() {
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();

//   // ✅ Dynamic state management
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
//   const [isLogin, setIsLogin] = useState(!token);

//   // ✅ Listen for login/logout events and localStorage changes
//   useEffect(() => {
//     const handleAuthChange = () => {
//       const currentToken = localStorage.getItem("token");
//       const currentUser = JSON.parse(localStorage.getItem("user"));
      
//       setToken(currentToken);
//       setUser(currentUser);
//       setIsLogin(!currentToken);
//     };

//     // Listen for custom events
//     window.addEventListener('user-login', handleAuthChange);
//     window.addEventListener('user-logout', handleAuthChange);
//     window.addEventListener('storage', handleAuthChange);
    
//     // Periodic check for same-tab changes
//     const interval = setInterval(handleAuthChange, 500);

//     return () => {
//       window.removeEventListener('user-login', handleAuthChange);
//       window.removeEventListener('user-logout', handleAuthChange);
//       window.removeEventListener('storage', handleAuthChange);
//       clearInterval(interval);
//     };
//   }, []);

//   // Handle login/logout logic
//   function checkLogin() {
//     if (token) {
//       // Logout
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
      
//       // Clear all user-specific data
//       const allKeys = Object.keys(localStorage);
//       allKeys.forEach(key => {
//         if (key.startsWith('fav_')) {
//           // Keep favorites but they won't be accessible without login
//         }
//       });

//       setToken(null);
//       setUser(null);
//       setIsLogin(true);
//       setDropdownOpen(false);
      
//       // ✅ Trigger logout event
//       window.dispatchEvent(new Event('user-logout'));
      
//       navigate("/");
//       setTimeout(() => window.location.reload(), 100);
//     } else {
//       setIsLoginModalOpen(true);
//     }
//   }

//   // ✅ Improved close modal with state sync
//   function closeLoginModal() {
//     setIsLoginModalOpen(false);
    
//     // Check auth state after modal closes
//     setTimeout(() => {
//       const currentToken = localStorage.getItem("token");
//       const currentUser = JSON.parse(localStorage.getItem("user"));
      
//       if (currentToken && currentUser) {
//         setToken(currentToken);
//         setUser(currentUser);
//         setIsLogin(false);
//       }
//     }, 200);
//   }

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <>
//       <header>
//         <h2>Recipe Hub</h2>
//         <ul className="nav-links">
//           <li><NavLink to="/"> Home </NavLink></li>
//           <li>
//             <NavLink 
//               to={!isLogin ? "/myRecipe" : "#"}
//               onClick={(e) => {
//                 if (isLogin) {
//                   e.preventDefault();
//                   setIsLoginModalOpen(true);
//                 }
//               }}
//             > 
//               My Recipe 
//             </NavLink>
//           </li>
//           <li>
//             <NavLink 
//               to={!isLogin ? "/favRecipes" : "#"}
//               onClick={(e) => {
//                 if (isLogin) {
//                   e.preventDefault();
//                   setIsLoginModalOpen(true);
//                 }
//               }}
//             > 
//               Favourites 
//             </NavLink>
//           </li>

//           {isLogin ? (
//             <li onClick={checkLogin} className="login-btn">Login</li>
//           ) : (
//             <li className="profile-menu" ref={dropdownRef}>
//               <div className="profile-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
//                 <FaUserCircle size={22} />
//                 <span className="profile-text">Profile</span>
//               </div>

//               {dropdownOpen && (
//                 <div className="dropdown dropdown-right">
//                   <p className="user-email">{user?.email}</p>
//                   <button className="logout-btn" onClick={checkLogin}>Logout</button>
//                 </div>
//               )}
//             </li>
//           )}
//         </ul>
//       </header>

//       {isLoginModalOpen && (
//         <Modal closeModal={closeLoginModal}>
//           <InputForm closeModal={closeLoginModal} />
//         </Modal>
//       )}
//     </>
//   );
// }

// export default Navbar;

// import Modal from './Modal';
// import React, { useState, useRef, useEffect } from 'react';
// import InputForm from './InputForm';
// import { NavLink } from 'react-router-dom';
// import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
// import { isLoggedIn, getUser, logout } from '../utils/AuthUtils';

// function Navbar() {
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // ✅ Simple check - no event listeners
//   const loggedIn = isLoggedIn();
//   const user = getUser();

//   function showLogin() {
//     setIsLoginModalOpen(true);
//     setMobileMenuOpen(false);
//   }

//   function closeLoginModal() {
//     setIsLoginModalOpen(false);
//   }

//   function handleLogout() {
//     setDropdownOpen(false);
//     logout();
//   }

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <>
//       <header>
//         <h2 className="desktop-title">Recipe Hub</h2>
        
//         {/* ✅ Mobile Menu Toggle */}
//         <button 
//           className="mobile-menu-toggle"
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//         >
//           {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
//         </button>

//         {/* ✅ Desktop Navigation */}
//         <ul className="nav-links desktop-nav">
//           <li><NavLink to="/"> Home </NavLink></li>
//           <li>
//             <NavLink 
//               to={loggedIn ? "/myRecipe" : "#"}
//               onClick={(e) => {
//                 if (!loggedIn) {
//                   e.preventDefault();
//                   showLogin();
//                 }
//               }}
//             > 
//               My Recipe 
//             </NavLink>
//           </li>
//           <li>
//             <NavLink 
//               to={loggedIn ? "/favRecipes" : "#"}
//               onClick={(e) => {
//                 if (!loggedIn) {
//                   e.preventDefault();
//                   showLogin();
//                 }
//               }}
//             > 
//               Favourites 
//             </NavLink>
//           </li>

//           {!loggedIn ? (
//             <li onClick={showLogin} className="login-btn">Login</li>
//           ) : (
//             <li className="profile-menu" ref={dropdownRef}>
//               <div className="profile-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
//                 <FaUserCircle size={22} />
//                 <span className="profile-text">Profile</span>
//               </div>

//               {dropdownOpen && (
//                 <div className="dropdown dropdown-right">
//                   <p className="user-email">{user?.email}</p>
//                   <button className="logout-btn" onClick={handleLogout}>Logout</button>
//                 </div>
//               )}
//             </li>
//           )}
//         </ul>

//         {/* ✅ Mobile Navigation */}
//         {mobileMenuOpen && (
//           <div className="mobile-nav-menu">
//             <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
//             <NavLink 
//               to={loggedIn ? "/myRecipe" : "#"}
//               onClick={(e) => {
//                 if (!loggedIn) {
//                   e.preventDefault();
//                   showLogin();
//                 } else {
//                   setMobileMenuOpen(false);
//                 }
//               }}
//             >
//               My Recipe
//             </NavLink>
//             <NavLink 
//               to={loggedIn ? "/favRecipes" : "#"}
//               onClick={(e) => {
//                 if (!loggedIn) {
//                   e.preventDefault();
//                   showLogin();
//                 } else {
//                   setMobileMenuOpen(false);
//                 }
//               }}
//             >
//               Favourites
//             </NavLink>
            
//             {!loggedIn ? (
//               <button onClick={showLogin} className="mobile-login-btn">Login</button>
//             ) : (
//               <div className="mobile-profile">
//                 <span className="mobile-user-email">{user?.email}</span>
//                 <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
//               </div>
//             )}
//           </div>
//         )}
//       </header>

//       {isLoginModalOpen && (
//         <Modal closeModal={closeLoginModal}>
//           <InputForm closeModal={closeLoginModal} />
//         </Modal>
//       )}
//     </>
//   );
// }

// export default Navbar;

import Modal from './Modal';
import React, { useState, useRef, useEffect } from 'react';
import InputForm from './InputForm';
import { NavLink } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { isLoggedIn, getUser, logout } from '../utils/AuthUtils';

function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Get fresh auth state on each render
  const loggedIn = isLoggedIn();
  const user = getUser();

  function showLogin() {
    setIsLoginModalOpen(true);
    setMobileMenuOpen(false);
  }

  function closeLoginModal() {
    setIsLoginModalOpen(false);
  }

  function handleLogout() {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
  }

  // ✅ Close mobile menu when clicking on navigation links
  function handleNavClick() {
    setMobileMenuOpen(false);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [window.location.pathname]);

  return (
    <>
      <header>
        <h2 className="desktop-title">Recipe Hub</h2>
        
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Desktop Navigation */}
        <ul className="nav-links desktop-nav">
          <li><NavLink to="/"> Home </NavLink></li>
          <li>
            <NavLink 
              to={loggedIn ? "/myRecipe" : "#"}
              onClick={(e) => {
                if (!loggedIn) {
                  e.preventDefault();
                  showLogin();
                }
              }}
            > 
              My Recipe 
            </NavLink>
          </li>
          <li>
            <NavLink 
              to={loggedIn ? "/favRecipes" : "#"}
              onClick={(e) => {
                if (!loggedIn) {
                  e.preventDefault();
                  showLogin();
                }
              }}
            > 
              Favourites 
            </NavLink>
          </li>

          {!loggedIn ? (
            <li onClick={showLogin} className="login-btn">Login</li>
          ) : (
            <li className="profile-menu" ref={dropdownRef}>
              <div className="profile-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <FaUserCircle size={22} />
                <span className="profile-text">Profile</span>
              </div>

              {dropdownOpen && (
                <div className="dropdown dropdown-right">
                  <p className="user-email">{user?.email}</p>
                  <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </li>
          )}
        </ul>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="mobile-nav-menu">
            <NavLink to="/" onClick={handleNavClick}>Home</NavLink>
            <NavLink 
              to={loggedIn ? "/myRecipe" : "#"}
              onClick={(e) => {
                if (!loggedIn) {
                  e.preventDefault();
                  showLogin();
                } else {
                  handleNavClick();
                }
              }}
            >
              My Recipe
            </NavLink>
            <NavLink 
              to={loggedIn ? "/favRecipes" : "#"}
              onClick={(e) => {
                if (!loggedIn) {
                  e.preventDefault();
                  showLogin();
                } else {
                  handleNavClick();
                }
              }}
            >
              Favourites
            </NavLink>
            
            {!loggedIn ? (
              <button onClick={showLogin} className="mobile-login-btn">Login</button>
            ) : (
              <div className="mobile-profile">
                <span className="mobile-user-email">{user?.email}</span>
                <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
              </div>
            )}
          </div>
        )}
      </header>

      {isLoginModalOpen && (
        <Modal closeModal={closeLoginModal}>
          <InputForm closeModal={closeLoginModal} />
        </Modal>
      )}
    </>
  );
}

export default Navbar;
