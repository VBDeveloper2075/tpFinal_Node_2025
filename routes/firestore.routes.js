// Rutas para productos usando Firebase Firestore
import express from 'express';
import FirestoreProductService from '../services/firestore.products.service.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route GET /api/firestore/products
 * @desc Obtiene todos los productos de Firestore
 * @access Público
 */
router.get('/products', async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] GET /api/firestore/products - Consultando productos en Firestore`);
    
    const filters = {
      category: req.query.category,
      brand: req.query.brand,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      limit: req.query.limit,
      isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined
    };

    const result = await FirestoreProductService.getAllProducts(filters);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Productos obtenidos exitosamente de Firestore',
        data: result.products,
        total: result.total,
        filters: filters
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error obteniendo productos de Firestore',
        error: result.error
      });
    }

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error en GET /api/firestore/products:`, error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

/**
 * @route GET /api/firestore/products/:id
 * @desc Obtiene un producto específico por ID de Firestore
 * @access Público
 */
router.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(`[${new Date().toISOString()}] GET /api/firestore/products/${productId} - Consultando producto específico`);
    
    const result = await FirestoreProductService.getProductById(productId);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Producto encontrado en Firestore',
        data: result.product
      });
    } else {
      const statusCode = result.error === 'Producto no encontrado' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: result.error,
        data: null
      });
    }

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error en GET /api/firestore/products/${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

/**
 * @route POST /api/firestore/products
 * @desc Crea un nuevo producto en Firestore
 * @access Privado (requiere autenticación)
 */
router.post('/products', authenticateToken, async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] POST /api/firestore/products - Creando nuevo producto`);
    
    const productData = req.body;
    const result = await FirestoreProductService.createProduct(productData);
    
    if (result.success) {
      res.status(201).json({
        success: true,
        message: result.message,
        data: result.product
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Error creando producto en Firestore',
        error: result.error
      });
    }

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error en POST /api/firestore/products:`, error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

/**
 * @route PUT /api/firestore/products/:id
 * @desc Actualiza un producto en Firestore
 * @access Privado (requiere autenticación)
 */
router.put('/products/:id', authenticateToken, async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;
    
    console.log(`[${new Date().toISOString()}] PUT /api/firestore/products/${productId} - Actualizando producto`);
    
    const result = await FirestoreProductService.updateProduct(productId, updateData);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.product
      });
    } else {
      const statusCode = result.error === 'Producto no encontrado' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: 'Error actualizando producto en Firestore',
        error: result.error
      });
    }

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error en PUT /api/firestore/products/${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

/**
 * @route DELETE /api/firestore/products/:id
 * @desc Elimina un producto de Firestore
 * @access Privado (requiere autenticación)
 */
router.delete('/products/:id', authenticateToken, async (req, res) => {
  try {
    const productId = req.params.id;
    
    console.log(`[${new Date().toISOString()}] DELETE /api/firestore/products/${productId} - Eliminando producto`);
    
    const result = await FirestoreProductService.deleteProduct(productId);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message
      });
    } else {
      const statusCode = result.error === 'Producto no encontrado' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: 'Error eliminando producto de Firestore',
        error: result.error
      });
    }

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error en DELETE /api/firestore/products/${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

/**
 * @route GET /api/firestore/products/search/:term
 * @desc Busca productos en Firestore
 * @access Público
 */
router.get('/search/:term', async (req, res) => {
  try {
    const searchTerm = req.params.term;
    console.log(`[${new Date().toISOString()}] GET /api/firestore/products/search/${searchTerm} - Buscando productos`);
    
    const result = await FirestoreProductService.searchProducts(searchTerm);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Búsqueda completada en Firestore',
        data: result.products,
        searchTerm: result.searchTerm,
        total: result.total
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error buscando productos en Firestore',
        error: result.error
      });
    }

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error en GET /api/firestore/products/search:`, error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

/**
 * @route GET /api/firestore/categories
 * @desc Obtiene todas las categorías de productos de Firestore
 * @access Público
 */
router.get('/categories', async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] GET /api/firestore/categories - Obteniendo categorías`);
    
    const result = await FirestoreProductService.getCategories();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Categorías obtenidas exitosamente de Firestore',
        data: result.categories
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error obteniendo categorías de Firestore',
        error: result.error
      });
    }

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error en GET /api/firestore/categories:`, error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

/**
 * @route POST /api/firestore/initialize
 * @desc Inicializa Firestore con productos de muestra
 * @access Privado (requiere autenticación)
 */
router.post('/initialize', authenticateToken, async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] POST /api/firestore/initialize - Inicializando Firestore con datos de muestra`);
    
    const result = await FirestoreProductService.initializeWithSampleProducts();
    
    if (result.success) {
      res.status(201).json({
        success: true,
        message: result.message,
        data: result.results
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error inicializando Firestore',
        error: result.error
      });
    }

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error en POST /api/firestore/initialize:`, error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

export default router;
