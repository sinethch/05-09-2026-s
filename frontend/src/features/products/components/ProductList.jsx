import React from 'react';
import ProductCard from './ProductCard';

export const ProductList = ({ products, onEdit, onDelete }) => {
  if (!products || products.length === 0) {
    return (
      <div className="empty-state">
        <p>No products found. Click "+ Add Product" to create your first item.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProductList;
