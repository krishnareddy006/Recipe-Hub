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

  // Current authentication state
  const loggedIn = isLoggedIn();
  const user = getUser();

  // Open login modal
  function showLogin() {
    setIsLoginModalOpen(true);
    setMobileMenuOpen(false);
  }

  // Close login modal
  function closeLoginModal() {
    setIsLoginModalOpen(false);
  }

  // Handle logout
  function handleLogout() {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
  }

  // Close mobile menu when navigating
  function handleNavClick() {
    setMobileMenuOpen(false);
  }

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [window.location.pathname]);

  return (
    <>
      <header>
        <h2 className="desktop-title">Recipe Hub</h2>
        
        {/* Mobile menu toggle */}
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

      {/* Login Modal */}
      {isLoginModalOpen && (
        <Modal closeModal={closeLoginModal}>
          <InputForm closeModal={closeLoginModal} />
        </Modal>
      )}
    </>
  );
}

export default Navbar;
