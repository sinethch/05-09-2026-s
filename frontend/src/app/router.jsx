import React from 'react';
import ProductsPage from '../features/products/pages/ProductsPage';

export const AppRouter = ({ isAddModalOpen, setIsAddModalOpen }) => {
  return (
    <ProductsPage
      isAddModalOpen={isAddModalOpen}
      setIsAddModalOpen={setIsAddModalOpen}
    />
  );
};

export default AppRouter;
