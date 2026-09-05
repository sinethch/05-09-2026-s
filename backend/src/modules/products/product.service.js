const Product = require('./product.model');

class ProductService {
  async getAllProducts(query = {}) {
    const filter = {};
    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }
    if (query.category && query.category !== 'All') {
      filter.category = query.category;
    }
    return await Product.find(filter).sort({ createdAt: -1 });
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async createProduct(data) {
    return await Product.create(data);
  }

  async updateProduct(id, data) {
    return await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }
}

module.exports = new ProductService();
