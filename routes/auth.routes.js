// Rutas para autenticación de usuarios
import express from 'express';
import authService from '../services/auth.service.js';

const router = express.Router();

// POST /auth/login - Autenticación de usuarios
router.post('/login', async (req, res) => {
  try {
    const result = await authService.authenticateUser(req.body);
    
    res.json({
      success: true,
      message: 'Autenticación exitosa',
      data: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error en ruta POST /auth/login:', error);
    
    if (error.message.includes('incompletas') || error.message.includes('inválidas') || error.message.includes('desactivada')) {
      return res.status(401).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor durante la autenticación',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /auth/verify - Verificar token
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado o formato inválido',
        timestamp: new Date().toISOString()
      });
    }
    
    const token = authHeader.substring(7);
    const decoded = await authService.verifyToken(token);
    
    res.json({
      success: true,
      message: 'Token válido',
      data: {
        user: decoded,
        tokenValid: true
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error en ruta GET /auth/verify:', error);
    
    return res.status(401).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /auth/users - Obtener lista de usuarios disponibles (solo para desarrollo)
router.get('/users', (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'Endpoint no disponible en producción',
        timestamp: new Date().toISOString()
      });
    }
    
    const users = authService.getAllUsers();
    
    res.json({
      success: true,
      message: 'Lista de usuarios disponibles (solo desarrollo)',
      data: users,
      count: users.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error en ruta GET /auth/users:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener usuarios',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
