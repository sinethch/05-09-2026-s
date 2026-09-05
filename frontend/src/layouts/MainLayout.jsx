import React from 'react';
import Navbar from '../shared/components/Navbar';

export const MainLayout = ({ children, onAddProduct }) => {
  return (
    <div className="app-container">
      <Navbar onAddClick={onAddProduct} />
      <main className="main-content">{children}</main>
      <footer className="footer">
        <p>MERN Stack E-Commerce &copy; 2026</p>
      </footer>
    </div>
  );
};

export default MainLayout;
