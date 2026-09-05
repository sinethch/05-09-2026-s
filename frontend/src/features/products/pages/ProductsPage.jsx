import React, { useState } from 'react';
import useProducts from '../hooks/useProducts';
import ProductList from '../components/ProductList';
import ProductFilter from '../components/ProductFilter';
import Modal from '../../../shared/components/Modal';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import Loading from '../../../shared/components/Loading';

export const ProductsPage = ({ isAddModalOpen, setIsAddModalOpen }) => {
  const {
    products,
    loading,
    error,
    filter,
    setFilter,
    addProduct,
    editProduct,
    removeProduct
  } = useProducts();

  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'General',
    stock: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: 'General', stock: '' });
    setFormError('');
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category || 'General',
      stock: product.stock !== undefined ? product.stock.toString() : '0'
    });
    setFormError('');
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingProduct(null);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Product name is required');
      return;
    }
    if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      setFormError('Price must be a positive number');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock) || 0
      };

      if (editingProduct) {
        await editProduct(editingProduct._id, payload);
      } else {
        await addProduct(payload);
      }
      handleCloseModal();
    } catch (err) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await removeProduct(id);
      } catch (err) {
        alert(err.message || 'Failed to delete product');
      }
    }
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h2>Products Management</h2>
          <p className="subtitle">Manage products with real-time MongoDB CRUD operations</p>
        </div>
      </div>

      <ProductFilter filter={filter} onFilterChange={setFilter} />

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <Loading message="Fetching products from MongoDB..." />
      ) : (
        <ProductList
          products={products}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingProduct}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleSubmit} className="product-form">
          {formError && <div className="alert-error">{formError}</div>}

          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Wireless Noise-Cancelling Headphones"
            required
          />

          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description..."
              className="input-field"
              rows={3}
            />
          </div>

          <div className="form-row">
            <Input
              label="Price ($)"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              required
            />

            <div className="input-group">
              <label className="input-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Home">Home</option>
                <option value="General">General</option>
              </select>
            </div>

            <Input
              label="Stock Quantity"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          <div className="modal-footer">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsPage;
