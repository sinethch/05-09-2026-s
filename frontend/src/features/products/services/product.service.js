import apiClient from '../../../services/apiClient';

export const productService = {
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await apiClient.get(`/products${queryString}`);
    return res.data;
  },

  async getProductById(id) {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  },

  async createProduct(productData) {
    const res = await apiClient.post('/products', productData);
    return res.data;
  },

  async updateProduct(id, productData) {
    const res = await apiClient.put(`/products/${id}`, productData);
    return res.data;
  },

  async deleteProduct(id) {
    const res = await apiClient.del(`/products/${id}`);
    return res.data;
  }
};

export default productService;
