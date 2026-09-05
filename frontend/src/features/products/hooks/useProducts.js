import { useState, useEffect, useCallback } from 'react';
import productService from '../services/product.service';

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ search: '', category: 'All', ...initialParams });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts(filter);
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (productData) => {
    const created = await productService.createProduct(productData);
    setProducts((prev) => [created, ...prev]);
    return created;
  };

  const editProduct = async (id, productData) => {
    const updated = await productService.updateProduct(id, productData);
    setProducts((prev) => prev.map((p) => (p._id === id ? updated : p)));
    return updated;
  };

  const removeProduct = async (id) => {
    await productService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return {
    products,
    loading,
    error,
    filter,
    setFilter,
    fetchProducts,
    addProduct,
    editProduct,
    removeProduct
  };
};

export default useProducts;
