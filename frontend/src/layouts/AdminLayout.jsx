import React from 'react';
import Navbar from '../shared/components/Navbar';

export const AdminLayout = ({ children }) => {
  return (
    <div className="app-container admin-layout">
      <Navbar />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default AdminLayout;
