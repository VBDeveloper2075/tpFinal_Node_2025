// Rutas para autenticación de usuarios
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Simulación de base de datos de usuarios (en producción sería una BD real)
const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@empresa.com',
    password: 'admin123', // En producción debe estar hasheada
    role: 'admin',
    firstName: 'Administrador',
    lastName: 'Sistema'
  },
  {
    id: 2,
    username: 'usuario',
    email: 'usuario@empresa.com',
    password: 'user123', // En producción debe estar hasheada
    role: 'user',
    firstName: 'Usuario',
    lastName: 'Empresa'
  },
  {
    id: 3,
    username: 'manager',
    email: 'manager@empresa.com',
    password: 'manager123', // En producción debe estar hasheada
    role: 'manager',
    firstName: 'Manager',
    lastName: 'Productos'
  }
];

// Clave secreta para JWT (en producción debe estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_2025';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// POST /auth/login - Autenticación de usuarios
router.post('/login', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    console.log(`[${new Date().toISOString()}] POST /auth/login - Intento de login para: ${username || email}`);
    
    // Validar que se proporcionen credenciales
    if ((!username && !email) || !password) {
      return res.status(400).json({
        success: false,
        message: 'Credenciales incompletas. Se requiere username/email y password',
        timestamp: new Date().toISOString()
      });
    }
    
    // Buscar usuario por username o email
    const user = users.find(u => 
      (username && u.username.toLowerCase() === username.toLowerCase()) ||
      (email && u.email.toLowerCase() === email.toLowerCase())
    );
    
    // Verificar si el usuario existe
    if (!user) {
      console.log(`[${new Date().toISOString()}] LOGIN FAILED - Usuario no encontrado: ${username || email}`);
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
        timestamp: new Date().toISOString()
      });
    }
    
    // Verificar contraseña (en producción usar bcrypt)
    if (user.password !== password) {
      console.log(`[${new Date().toISOString()}] LOGIN FAILED - Contraseña incorrecta para: ${user.username}`);
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
        timestamp: new Date().toISOString()
      });
    }
    
    // Crear payload para el JWT
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };
    
    // Generar JWT token
    const token = jwt.sign(payload, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'tpFinal_Node_2025',
      audience: 'empresa-frontend'
    });
    
    console.log(`[${new Date().toISOString()}] LOGIN SUCCESS - Usuario autenticado: ${user.username} (${user.role})`);
    
    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Autenticación exitosa',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        },
        token: `Bearer ${token}`,
        tokenType: 'Bearer',
        expiresIn: JWT_EXPIRES_IN
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error en el proceso de login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor durante la autenticación',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /auth/verify - Verificar token (ruta adicional útil)
router.get('/verify', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado o formato inválido',
        timestamp: new Date().toISOString()
      });
    }
    
    const token = authHeader.substring(7); // Remover "Bearer "
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Token inválido o expirado',
          error: err.message,
          timestamp: new Date().toISOString()
        });
      }
      
      res.json({
        success: true,
        message: 'Token válido',
        data: {
          user: decoded,
          tokenValid: true
        },
        timestamp: new Date().toISOString()
      });
    });
    
  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al verificar token',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /auth/users - Obtener lista de usuarios disponibles (solo para desarrollo)
router.get('/users', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'Endpoint no disponible en producción',
      timestamp: new Date().toISOString()
    });
  }
  
  const safeUsers = users.map(user => ({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName
    // No incluir password
  }));
  
  res.json({
    success: true,
    message: 'Lista de usuarios disponibles (solo desarrollo)',
    data: safeUsers,
    timestamp: new Date().toISOString()
  });
});

export default router;
