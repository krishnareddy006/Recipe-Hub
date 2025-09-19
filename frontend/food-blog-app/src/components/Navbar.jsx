import Modal from './Modal';
import React, { useEffect, useState, useRef } from 'react';
import InputForm from './InputForm';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";

function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  let token = localStorage.getItem("token");
  const [isLogin, setIsLogin] = useState(token ? false : true);
  let user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    setIsLogin(token ? false : true);
  }, [token]);

  function checkLogin() {
    if (token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user"); 
      setIsLogin(true);
      setDropdownOpen(false);
      navigate("/");  
      window.location.reload();
    } else {
      setIsLoginModalOpen(true);
    }
  }

  function closeLoginModal() {
    setIsLoginModalOpen(false);
  }

  // ✅ Function to open login modal (for RecipeItems)
  function openLoginModal() {
    setIsLoginModalOpen(true);
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header>
        <h2>Recipe Hub</h2>
        <ul className="nav-links">
          <li><NavLink to="/"> Home </NavLink></li>
          <li onClick={() => isLogin && setIsLoginModalOpen(true)}>
            <NavLink to={!isLogin ? "/myRecipe" : "/"}> My Recipe </NavLink>
          </li>
          <li onClick={() => isLogin && setIsLoginModalOpen(true)}>
            <NavLink to={!isLogin ? "/favRecipes" : "/"}> Favourites </NavLink>
          </li>

          {/* Auth Section */}
          {isLogin ? (
            <li onClick={checkLogin} className="login-btn">Login</li>
          ) : (
            <li className="profile-menu" ref={dropdownRef}>
              <div className="profile-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <FaUserCircle size={22} />
                <span className="profile-text">Profile</span>
              </div>

              {dropdownOpen && (
                <div className="dropdown dropdown-right">
                  <p className="user-email">{user?.email}</p>
                  <button className="logout-btn" onClick={checkLogin}>Logout</button>
                </div>
              )}
            </li>
          )}
        </ul>
      </header>

      {/* ✅ Login Modal */}
      {isLoginModalOpen && (
        <Modal closeModal={closeLoginModal}>
          <InputForm closeModal={closeLoginModal} />
        </Modal>
      )}
    </>
  );
}

export default Navbar;
