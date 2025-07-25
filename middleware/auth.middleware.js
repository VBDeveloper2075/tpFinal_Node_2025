// Middleware de autenticación JWT
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_2025';

// Middleware para verificar JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // Verificar que el header Authorization esté presente
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Token de acceso requerido',
      timestamp: new Date().toISOString()
    });
  }
  
  // Verificar formato "Bearer TOKEN"
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Formato de token inválido. Use: Bearer <token>',
      timestamp: new Date().toISOString()
    });
  }
  
  const token = authHeader.substring(7); // Remover "Bearer "
  
  // Verificar y decodificar el token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(`[${new Date().toISOString()}] AUTH FAILED - Token inválido:`, err.message);
      
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expirado',
          error: 'Token expired',
          timestamp: new Date().toISOString()
        });
      }
      
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Token inválido',
          error: 'Invalid token',
          timestamp: new Date().toISOString()
        });
      }
      
      return res.status(403).json({
        success: false,
        message: 'Token no válido',
        error: err.message,
        timestamp: new Date().toISOString()
      });
    }
    
    // Agregar información del usuario al request
    req.user = decoded;
    console.log(`[${new Date().toISOString()}] AUTH SUCCESS - Usuario: ${decoded.username} (${decoded.role})`);
    next();
  });
};

// Middleware para verificar roles específicos
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
        timestamp: new Date().toISOString()
      });
    }
    
    if (!roles.includes(req.user.role)) {
      console.log(`[${new Date().toISOString()}] AUTHORIZATION FAILED - Usuario ${req.user.username} (${req.user.role}) intentó acceder a recurso que requiere: ${roles.join(', ')}`);
      
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso',
        requiredRoles: roles,
        userRole: req.user.role,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`[${new Date().toISOString()}] AUTHORIZATION SUCCESS - Usuario ${req.user.username} (${req.user.role}) autorizado`);
    next();
  };
};

// Middleware opcional - permite acceso sin token pero agrega info si está presente
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // Continuar sin autenticación
  }
  
  const token = authHeader.substring(7);
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (!err) {
      req.user = decoded; // Agregar info del usuario si el token es válido
    }
    next(); // Continuar independientemente del resultado
  });
};
