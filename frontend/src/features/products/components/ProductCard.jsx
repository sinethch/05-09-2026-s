import React from 'react';
import formatCurrency from '../../../shared/utils/formatCurrency';
import Button from '../../../shared/components/Button';

export const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="product-card">
      <div className="product-card-header">
        <span className="product-category">{product.category || 'General'}</span>
        <span className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </span>
      </div>
      <h3 className="product-title">{product.name}</h3>
      <p className="product-description">{product.description || 'No description provided.'}</p>
      <div className="product-price">{formatCurrency(product.price)}</div>
      <div className="product-actions">
        <Button variant="secondary" onClick={() => onEdit(product)}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => onDelete(product._id)}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
