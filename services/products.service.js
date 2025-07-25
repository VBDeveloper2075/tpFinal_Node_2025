// Servicio de gestión de productos
import ProductDAL from '../models/ProductDAL.js';

class ProductsService {
  constructor() {
    // Usar datos locales en lugar de API externa
    this.useLocalData = true;
  }

  /**
   * Obtiene todos los productos con filtros opcionales
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Array} Lista de productos
   */
  async getAllProducts(filters = {}) {
    try {
      console.log(`[${new Date().toISOString()}] ProductsService - Obteniendo productos con filtros:`, filters);
      
      // Usar ProductDAL para obtener productos locales
      const products = ProductDAL.getAllProducts(filters);
      
      console.log(`[${new Date().toISOString()}] ProductsService - ${products.length} productos obtenidos`);
      return {
        success: true,
        products: products,
        total: products.length,
        filters: filters
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] ProductsService - Error obteniendo productos:`, error);
      return {
        success: false,
        error: 'Error interno del servidor',
        products: [],
        total: 0
      };
    }
  }

  /**
   * Obtiene un producto por ID
   * @param {number} id - ID del producto
   * @returns {Object} Producto encontrado o error
   */
  async getProductById(id) {
    try {
      console.log(`[${new Date().toISOString()}] ProductsService - Obteniendo producto ID: ${id}`);
      
      const product = ProductDAL.getProductById(id);
      
      if (!product) {
        console.log(`[${new Date().toISOString()}] ProductsService - Producto no encontrado: ${id}`);
        return {
          success: false,
          error: 'Producto no encontrado',
          product: null
        };
      }

      console.log(`[${new Date().toISOString()}] ProductsService - Producto encontrado: ${product.title}`);
      return {
        success: true,
        product: product
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] ProductsService - Error obteniendo producto ${id}:`, error);
      return {
        success: false,
        error: 'Error interno del servidor',
        product: null
      };
    }
  }

  /**
   * Crea un nuevo producto
   * @param {Object} productData - Datos del producto
   * @returns {Object} Producto creado o error
   */
  async createProduct(productData) {
    try {
      console.log(`[${new Date().toISOString()}] ProductsService - Creando producto:`, productData.title);
      
      const newProduct = ProductDAL.createProduct(productData);
      
      console.log(`[${new Date().toISOString()}] ProductsService - Producto creado con ID: ${newProduct.id}`);
      return {
        success: true,
        message: 'Producto creado exitosamente',
        product: newProduct
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] ProductsService - Error creando producto:`, error);
      return {
        success: false,
        error: error.message || 'Error interno del servidor',
        product: null
      };
    }
  }

  /**
   * Actualiza un producto existente
   * @param {number} id - ID del producto
   * @param {Object} updateData - Datos a actualizar
   * @returns {Object} Producto actualizado o error
   */
  async updateProduct(id, updateData) {
    try {
      console.log(`[${new Date().toISOString()}] ProductsService - Actualizando producto ID: ${id}`);
      
      const updatedProduct = ProductDAL.updateProduct(id, updateData);
      
      if (!updatedProduct) {
        console.log(`[${new Date().toISOString()}] ProductsService - Producto no encontrado para actualizar: ${id}`);
        return {
          success: false,
          error: 'Producto no encontrado',
          product: null
        };
      }

      console.log(`[${new Date().toISOString()}] ProductsService - Producto actualizado: ${updatedProduct.title}`);
      return {
        success: true,
        message: 'Producto actualizado exitosamente',
        product: updatedProduct
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] ProductsService - Error actualizando producto ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Error interno del servidor',
        product: null
      };
    }
  }

  /**
   * Elimina un producto
   * @param {number} id - ID del producto
   * @returns {Object} Resultado de la eliminación
   */
  async deleteProduct(id) {
    try {
      console.log(`[${new Date().toISOString()}] ProductsService - Eliminando producto ID: ${id}`);
      
      const deleted = ProductDAL.deleteProduct(id);
      
      if (!deleted) {
        console.log(`[${new Date().toISOString()}] ProductsService - Producto no encontrado para eliminar: ${id}`);
        return {
          success: false,
          error: 'Producto no encontrado'
        };
      }

      console.log(`[${new Date().toISOString()}] ProductsService - Producto eliminado: ${id}`);
      return {
        success: true,
        message: 'Producto eliminado exitosamente'
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] ProductsService - Error eliminando producto ${id}:`, error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  /**
   * Obtiene productos por categoría
   * @param {string} category - Categoría de productos
   * @param {Object} filters - Filtros adicionales
   * @returns {Array} Productos de la categoría
   */
  async getProductsByCategory(category, filters = {}) {
    try {
      console.log(`[${new Date().toISOString()}] ProductsService - Obteniendo productos de categoría: ${category}`);
      
      const categoryFilter = { ...filters, category };
      const products = ProductDAL.getAllProducts(categoryFilter);
      
      console.log(`[${new Date().toISOString()}] ProductsService - ${products.length} productos encontrados en categoría ${category}`);
      return {
        success: true,
        products: products,
        category: category,
        total: products.length
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] ProductsService - Error obteniendo productos por categoría:`, error);
      return {
        success: false,
        error: 'Error interno del servidor',
        products: [],
        total: 0
      };
    }
  }

  /**
   * Obtiene todas las categorías disponibles
   * @returns {Array} Lista de categorías
   */
  async getCategories() {
    try {
      console.log(`[${new Date().toISOString()}] ProductsService - Obteniendo categorías`);
      
      const categories = ProductDAL.getCategories();
      
      console.log(`[${new Date().toISOString()}] ProductsService - ${categories.length} categorías encontradas`);
      return {
        success: true,
        categories: categories
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] ProductsService - Error obteniendo categorías:`, error);
      return {
        success: false,
        error: 'Error interno del servidor',
        categories: []
      };
    }
  }

  /**
   * Busca productos por término
   * @param {string} searchTerm - Término de búsqueda
   * @param {Object} filters - Filtros adicionales
   * @returns {Array} Productos encontrados
   */
  async searchProducts(searchTerm, filters = {}) {
    try {
      console.log(`[${new Date().toISOString()}] ProductsService - Buscando productos: "${searchTerm}"`);
      
      const searchFilter = { ...filters, search: searchTerm };
      const products = ProductDAL.getAllProducts(searchFilter);
      
      console.log(`[${new Date().toISOString()}] ProductsService - ${products.length} productos encontrados para "${searchTerm}"`);
      return {
        success: true,
        products: products,
        searchTerm: searchTerm,
        total: products.length
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] ProductsService - Error buscando productos:`, error);
      return {
        success: false,
        error: 'Error interno del servidor',
        products: [],
        total: 0
      };
    }
  }

  /**
   * Obtiene estadísticas de productos
   * @returns {Object} Estadísticas
   */
  async getProductStatistics() {
    try {
      console.log(`[${new Date().toISOString()}] ProductsService - Obteniendo estadísticas de productos`);
      
      const stats = ProductDAL.getStatistics();
      
      console.log(`[${new Date().toISOString()}] ProductsService - Estadísticas obtenidas`);
      return {
        success: true,
        statistics: stats
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] ProductsService - Error obteniendo estadísticas:`, error);
      return {
        success: false,
        error: 'Error interno del servidor',
        statistics: {}
      };
    }
  }

  /**
   * Actualiza el stock de un producto
   * @param {number} id - ID del producto
   * @param {number} quantity - Nueva cantidad
   * @returns {Object} Resultado de la actualización
   */
  async updateStock(id, quantity) {
    try {
      console.log(`[${new Date().toISOString()}] ProductsService - Actualizando stock del producto ${id} a ${quantity}`);
      
      const updated = ProductDAL.updateStock(id, quantity);
      
      if (!updated) {
        return {
          success: false,
          error: 'Producto no encontrado'
        };
      }

      console.log(`[${new Date().toISOString()}] ProductsService - Stock actualizado para producto ${id}`);
      return {
        success: true,
        message: 'Stock actualizado exitosamente',
        product: updated
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] ProductsService - Error actualizando stock:`, error);
      return {
        success: false,
        error: error.message || 'Error interno del servidor'
      };
    }
  }

  /**
   * Verifica la disponibilidad de un producto
   * @param {number} id - ID del producto
   * @param {number} quantity - Cantidad requerida
   * @returns {Object} Disponibilidad del producto
   */
  async checkAvailability(id, quantity = 1) {
    try {
      const product = ProductDAL.getProductById(id);
      
      if (!product) {
        return {
          available: false,
          reason: 'Producto no encontrado'
        };
      }

      const isAvailable = ProductDAL.checkAvailability(id, quantity);
      
      return {
        available: isAvailable,
        productId: id,
        requestedQuantity: quantity,
        availableStock: product.stock,
        reason: isAvailable ? null : 'Stock insuficiente'
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] ProductsService - Error verificando disponibilidad:`, error);
      return {
        available: false,
        reason: 'Error interno del servidor'
      };
    }
  }

  /**
   * Obtiene productos con bajo stock
   * @param {number} threshold - Umbral de stock bajo (por defecto 10)
   * @returns {Array} Productos con stock bajo
   */
  async getLowStockProducts(threshold = 10) {
    try {
      console.log(`[${new Date().toISOString()}] ProductsService - Obteniendo productos con stock bajo (< ${threshold})`);
      
      const lowStockProducts = ProductDAL.getLowStockProducts(threshold);
      
      console.log(`[${new Date().toISOString()}] ProductsService - ${lowStockProducts.length} productos con stock bajo`);
      return {
        success: true,
        products: lowStockProducts,
        threshold: threshold,
        total: lowStockProducts.length
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] ProductsService - Error obteniendo productos con stock bajo:`, error);
      return {
        success: false,
        error: 'Error interno del servidor',
        products: [],
        total: 0
      };
    }
  }
}

// Exportar instancia singleton
export default new ProductsService();
