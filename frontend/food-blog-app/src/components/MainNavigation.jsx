import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';


function MainNavigation() {
  return (
    <>
    <Navbar/>
    <Outlet/>       
    <Footer/>   
    </>
  )
}

export default MainNavigation;