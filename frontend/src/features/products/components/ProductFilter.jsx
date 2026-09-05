import React from 'react';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'General'];

export const ProductFilter = ({ filter, onFilterChange }) => {
  return (
    <div className="product-filter-bar">
      <input
        type="text"
        placeholder="Search products by name..."
        value={filter.search}
        onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
        className="filter-search-input"
      />
      <select
        value={filter.category}
        onChange={(e) => onFilterChange({ ...filter, category: e.target.value })}
        className="filter-category-select"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductFilter;
