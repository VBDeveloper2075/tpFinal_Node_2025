// Rutas para manejo de productos
import express from 'express';
import productsService from '../services/products.service.js';

const router = express.Router();

// GET /api/products - Devuelve todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await productsService.getAllProducts();
    
    res.json({
      success: true,
      message: 'Productos obtenidos exitosamente',
      data: products,
      count: products.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error en ruta GET /api/products:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener productos',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/products/:id - Devuelve el producto con el ID indicado
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productsService.getProductById(id);
    
    res.json({
      success: true,
      message: 'Producto obtenido exitosamente',
      data: product,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(`Error en ruta GET /api/products/${req.params.id}:`, error);
    
    if (error.message.includes('inválido') || error.message.includes('no encontrado')) {
      return res.status(404).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener el producto',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// POST /api/products/create - Crear un nuevo producto
router.post('/create', async (req, res) => {
  try {
    const result = await productsService.createProduct(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: result.createdProduct,
      originalData: result.originalData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error en ruta POST /api/products/create:', error);
    
    if (error.message.includes('requeridos') || error.message.includes('precio')) {
      return res.status(400).json({
        success: false,
        message: error.message,
        receivedData: req.body,
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear el producto',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// DELETE /api/products/:id - Eliminar producto con el ID indicado
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productsService.deleteProduct(id);
    
    res.json({
      success: true,
      message: `Producto con ID ${id} eliminado exitosamente`,
      data: result.deletionResult,
      deletedProduct: result.deletedProduct,
      deletedId: result.deletedId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(`Error en ruta DELETE /api/products/${req.params.id}:`, error);
    
    if (error.message.includes('inválido') || error.message.includes('no encontrado')) {
      return res.status(404).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar el producto',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
