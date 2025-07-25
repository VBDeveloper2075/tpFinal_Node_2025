// Rutas para manejo de productos
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const API_URL = process.env.API_URL || 'https://fakestoreapi.com';

// GET /api/products - Devuelve todos los productos
router.get('/', async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] GET /api/products - Obteniendo todos los productos`);
    
    const response = await fetch(`${API_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`Error en la API externa: ${response.status}`);
    }
    
    const products = await response.json();
    
    res.json({
      success: true,
      message: 'Productos obtenidos exitosamente',
      data: products,
      count: products.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error al obtener productos:', error);
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
    
    // Validar que el ID sea un número
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto inválido. Debe ser un número.',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`[${new Date().toISOString()}] GET /api/products/${id} - Obteniendo producto específico`);
    
    const response = await fetch(`${API_URL}/products/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({
          success: false,
          message: `Producto con ID ${id} no encontrado`,
          timestamp: new Date().toISOString()
        });
      }
      throw new Error(`Error en la API externa: ${response.status}`);
    }
    
    const product = await response.json();
    
    res.json({
      success: true,
      message: 'Producto obtenido exitosamente',
      data: product,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(`Error al obtener producto ${req.params.id}:`, error);
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
    const { title, price, description, image, category } = req.body;
    
    // Validar datos requeridos
    if (!title || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: title, price y category son obligatorios',
        receivedData: req.body,
        timestamp: new Date().toISOString()
      });
    }
    
    // Validar que price sea un número
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser un número válido mayor a 0',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`[${new Date().toISOString()}] POST /api/products/create - Creando nuevo producto: ${title}`);
    
    const productData = {
      title,
      price: Number(price),
      description: description || `Producto ${title} en la categoría ${category}`,
      image: image || 'https://via.placeholder.com/300',
      category
    };
    
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      throw new Error(`Error en la API externa: ${response.status}`);
    }
    
    const newProduct = await response.json();
    
    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: newProduct,
      originalData: productData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error al crear producto:', error);
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
    
    // Validar que el ID sea un número
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto inválido. Debe ser un número.',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`[${new Date().toISOString()}] DELETE /api/products/${id} - Eliminando producto`);
    
    // Primero verificar que el producto existe
    const checkResponse = await fetch(`${API_URL}/products/${id}`);
    if (!checkResponse.ok) {
      if (checkResponse.status === 404) {
        return res.status(404).json({
          success: false,
          message: `Producto con ID ${id} no encontrado`,
          timestamp: new Date().toISOString()
        });
      }
      throw new Error(`Error al verificar producto: ${checkResponse.status}`);
    }
    
    // Proceder con la eliminación
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error en la API externa: ${response.status}`);
    }
    
    const result = await response.json();
    
    res.json({
      success: true,
      message: `Producto con ID ${id} eliminado exitosamente`,
      data: result,
      deletedId: id,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(`Error al eliminar producto ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar el producto',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
