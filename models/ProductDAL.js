// Data Access Layer para productos
import Product from '../models/Product.js';
import { productsData, categories, brands } from '../data/products.data.js';

class ProductDAL {
  constructor() {
    // Cargar productos desde los datos iniciales
    this.products = productsData.map(productData => Product.fromData(productData));
    this.nextId = Math.max(...this.products.map(p => p.id)) + 1;
  }

  /**
   * Obtiene todos los productos
   * @param {Object} filters - Filtros opcionales
   * @returns {Array} Lista de productos
   */
  getAllProducts(filters = {}) {
    let filteredProducts = this.products.filter(product => product.isActive);

    // Aplicar filtros
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.brand) {
      filteredProducts = filteredProducts.filter(p => 
        p.brand && p.brand.toLowerCase() === filters.brand.toLowerCase()
      );
    }

    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice);
    }

    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice);
    }

    if (filters.inStock) {
      filteredProducts = filteredProducts.filter(p => p.stock > 0);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.title.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Ordenamiento
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'name_asc':
          filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'name_desc':
          filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);
          break;
        case 'newest':
          filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          // Sin ordenamiento adicional
          break;
      }
    }

    // Paginación
    if (filters.page && filters.limit) {
      const startIndex = (filters.page - 1) * filters.limit;
      const endIndex = startIndex + filters.limit;
      return {
        products: filteredProducts.slice(startIndex, endIndex).map(p => p.toPublic()),
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: filteredProducts.length,
          totalPages: Math.ceil(filteredProducts.length / filters.limit)
        }
      };
    }

    return filteredProducts.map(p => p.toPublic());
  }

  /**
   * Obtiene un producto por ID
   * @param {number} id - ID del producto
   * @returns {Object|null} Producto encontrado o null
   */
  getProductById(id) {
    const product = this.products.find(p => p.id === parseInt(id) && p.isActive);
    return product ? product.toPublic() : null;
  }

  /**
   * Crea un nuevo producto
   * @param {Object} productData - Datos del producto
   * @returns {Object} Producto creado
   */
  createProduct(productData) {
    const newProduct = new Product(
      this.nextId++,
      productData.title,
      productData.price,
      productData.description,
      productData.category,
      productData.image,
      productData.rating,
      productData.stock || 0,
      productData.tags || [],
      productData.brand
    );

    const validation = newProduct.validate();
    if (!validation.isValid) {
      throw new Error(`Datos de producto inválidos: ${validation.errors.join(', ')}`);
    }

    this.products.push(newProduct);
    console.log(`[${new Date().toISOString()}] ProductDAL - Producto creado: ID ${newProduct.id}`);
    
    return newProduct.toPublic();
  }

  /**
   * Actualiza un producto existente
   * @param {number} id - ID del producto
   * @param {Object} updateData - Datos a actualizar
   * @returns {Object|null} Producto actualizado o null
   */
  updateProduct(id, updateData) {
    const productIndex = this.products.findIndex(p => p.id === parseInt(id) && p.isActive);
    
    if (productIndex === -1) {
      return null;
    }

    const product = this.products[productIndex];
    product.update(updateData);

    const validation = product.validate();
    if (!validation.isValid) {
      throw new Error(`Datos de actualización inválidos: ${validation.errors.join(', ')}`);
    }

    console.log(`[${new Date().toISOString()}] ProductDAL - Producto actualizado: ID ${id}`);
    
    return product.toPublic();
  }

  /**
   * Elimina un producto (soft delete)
   * @param {number} id - ID del producto
   * @returns {boolean} True si se eliminó exitosamente
   */
  deleteProduct(id) {
    const productIndex = this.products.findIndex(p => p.id === parseInt(id) && p.isActive);
    
    if (productIndex === -1) {
      return false;
    }

    // Soft delete - marcar como inactivo
    this.products[productIndex].isActive = false;
    this.products[productIndex].updatedAt = new Date().toISOString();

    console.log(`[${new Date().toISOString()}] ProductDAL - Producto eliminado: ID ${id}`);
    
    return true;
  }

  /**
   * Obtiene productos por categoría
   * @param {string} category - Categoría
   * @returns {Array} Productos de la categoría
   */
  getProductsByCategory(category) {
    return this.products
      .filter(p => p.category.toLowerCase() === category.toLowerCase() && p.isActive)
      .map(p => p.toPublic());
  }

  /**
   * Obtiene todas las categorías disponibles
   * @returns {Array} Lista de categorías
   */
  getCategories() {
    return categories;
  }

  /**
   * Obtiene todas las marcas disponibles
   * @returns {Array} Lista de marcas
   */
  getBrands() {
    return brands;
  }

  /**
   * Busca productos por término
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Array} Productos que coinciden
   */
  searchProducts(searchTerm) {
    const term = searchTerm.toLowerCase();
    return this.products
      .filter(p => p.isActive && (
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.tags.some(tag => tag.toLowerCase().includes(term))
      ))
      .map(p => p.toPublic());
  }

  /**
   * Actualiza el stock de un producto
   * @param {number} id - ID del producto
   * @param {number} quantity - Cantidad a decrementar
   * @returns {boolean} True si se actualizó exitosamente
   */
  updateStock(id, quantity) {
    const product = this.products.find(p => p.id === parseInt(id) && p.isActive);
    
    if (!product) {
      return false;
    }

    if (quantity > 0) {
      product.incrementStock(quantity);
    } else {
      const success = product.decrementStock(Math.abs(quantity));
      if (!success) {
        throw new Error('Stock insuficiente');
      }
    }

    console.log(`[${new Date().toISOString()}] ProductDAL - Stock actualizado para producto ID ${id}: ${product.stock}`);
    
    return true;
  }

  /**
   * Obtiene estadísticas de productos
   * @returns {Object} Estadísticas
   */
  getStatistics() {
    const activeProducts = this.products.filter(p => p.isActive);
    
    const stats = {
      totalProducts: activeProducts.length,
      totalValue: activeProducts.reduce((sum, p) => sum + (p.price * p.stock), 0),
      totalStock: activeProducts.reduce((sum, p) => sum + p.stock, 0),
      categoriesCount: {},
      brandsCount: {},
      averagePrice: 0,
      outOfStock: activeProducts.filter(p => p.stock === 0).length
    };

    // Contar por categorías
    activeProducts.forEach(p => {
      stats.categoriesCount[p.category] = (stats.categoriesCount[p.category] || 0) + 1;
    });

    // Contar por marcas
    activeProducts.forEach(p => {
      if (p.brand) {
        stats.brandsCount[p.brand] = (stats.brandsCount[p.brand] || 0) + 1;
      }
    });

    // Precio promedio
    if (activeProducts.length > 0) {
      stats.averagePrice = activeProducts.reduce((sum, p) => sum + p.price, 0) / activeProducts.length;
    }

    return stats;
  }
}

// Exportar instancia singleton
export default new ProductDAL();
