// Servicio de autenticación y autorización
import jwt from 'jsonwebtoken';
import UserDAL from '../models/UserDAL.js';

class AuthService {
  constructor() {
    this.secretKey = process.env.JWT_SECRET || 'tu-clave-secreta-muy-segura';
    this.tokenExpiration = '24h';
  }

  /**
   * Autentica un usuario con username/email y password
   * @param {string} username - Username o email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Object} Resultado de la autenticación
   */
  async authenticateUser(username, password) {
    try {
      // Buscar usuario por username o email
      const user = UserDAL.findUserForAuth(username, username);
      
      if (!user) {
        console.log(`[${new Date().toISOString()}] AuthService - Usuario no encontrado: ${username}`);
        return {
          success: false,
          message: 'Credenciales inválidas',
          user: null,
          token: null
        };
      }

      // Verificar si la cuenta está activa
      if (!user.isActive) {
        console.log(`[${new Date().toISOString()}] AuthService - Usuario inactivo: ${user.username}`);
        return {
          success: false,
          message: 'Cuenta desactivada',
          user: null,
          token: null
        };
      }

      // Verificar si la cuenta está bloqueada
      if (user.isLocked) {
        console.log(`[${new Date().toISOString()}] AuthService - Usuario bloqueado: ${user.username}`);
        return {
          success: false,
          message: 'Cuenta bloqueada por múltiples intentos fallidos',
          user: null,
          token: null
        };
      }

      // Verificar contraseña (en producción usar bcrypt.compare)
      const isPasswordValid = user.authenticate(password);
      
      if (!isPasswordValid) {
        // Incrementar intentos de login fallidos
        UserDAL.incrementLoginAttempts(user.id);
        
        console.log(`[${new Date().toISOString()}] AuthService - Contraseña incorrecta: ${user.username}`);
        return {
          success: false,
          message: 'Credenciales inválidas',
          user: null,
          token: null
        };
      }

      // Autenticación exitosa - actualizar último login
      UserDAL.updateLastLogin(user.id);

      // Generar token JWT
      const token = this.generateToken(user);

      console.log(`[${new Date().toISOString()}] AuthService - Login exitoso: ${user.username}`);

      return {
        success: true,
        message: 'Autenticación exitosa',
        user: user.toPublic(),
        token: token
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] AuthService - Error en authenticateUser:`, error);
      return {
        success: false,
        message: 'Error interno del servidor',
        user: null,
        token: null
      };
    }
  }

  /**
   * Genera un token JWT para el usuario
   * @param {Object} user - Usuario para el token
   * @returns {string} Token JWT
   */
  generateToken(user) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(payload, this.secretKey, { 
      expiresIn: this.tokenExpiration,
      issuer: 'tienda-api',
      subject: user.id.toString()
    });
  }

  /**
   * Verifica y decodifica un token JWT
   * @param {string} token - Token a verificar
   * @returns {Object} Resultado de la verificación
   */
  verifyToken(token) {
    try {
      if (!token) {
        return {
          valid: false,
          message: 'Token no proporcionado',
          user: null
        };
      }

      // Remover 'Bearer ' si está presente
      if (token.startsWith('Bearer ')) {
        token = token.slice(7);
      }

      const decoded = jwt.verify(token, this.secretKey);
      
      // Verificar que el usuario aún existe y está activo
      const user = UserDAL.getUserById(decoded.id);
      if (!user || !user.isActive) {
        return {
          valid: false,
          message: 'Usuario no válido o inactivo',
          user: null
        };
      }

      return {
        valid: true,
        message: 'Token válido',
        user: user
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] AuthService - Error verificando token:`, error);
      
      if (error.name === 'TokenExpiredError') {
        return {
          valid: false,
          message: 'Token expirado',
          user: null
        };
      }
      
      if (error.name === 'JsonWebTokenError') {
        return {
          valid: false,
          message: 'Token inválido',
          user: null
        };
      }

      return {
        valid: false,
        message: 'Error verificando token',
        user: null
      };
    }
  }

  /**
   * Obtiene un usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Object|null} Usuario o null
   */
  getUserById(id) {
    return UserDAL.getUserById(id);
  }

  /**
   * Obtiene todos los usuarios (solo admins)
   * @param {Object} filters - Filtros opcionales
   * @returns {Array} Lista de usuarios
   */
  getAllUsers(filters = {}) {
    return UserDAL.getAllUsers(filters);
  }

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Object} Usuario creado
   */
  createUser(userData) {
    return UserDAL.createUser(userData);
  }

  /**
   * Actualiza un usuario
   * @param {number} id - ID del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Object|null} Usuario actualizado
   */
  updateUser(id, updateData) {
    return UserDAL.updateUser(id, updateData);
  }

  /**
   * Verifica si un usuario tiene un rol específico
   * @param {Object} user - Usuario a verificar
   * @param {string} role - Rol requerido
   * @returns {boolean} True si tiene el rol
   */
  hasRole(user, role) {
    return user && user.role === role;
  }

  /**
   * Verifica si un usuario tiene un permiso específico
   * @param {number} userId - ID del usuario
   * @param {string} permission - Permiso a verificar
   * @returns {boolean} True si tiene el permiso
   */
  hasPermission(userId, permission) {
    return UserDAL.hasPermission(userId, permission);
  }

  /**
   * Valida la fortaleza de una contraseña
   * @param {string} password - Contraseña a validar
   * @returns {Object} Resultado de la validación
   */
  validatePasswordStrength(password) {
    const config = UserDAL.getAuthConfig();
    const requirements = config.passwordRequirements;
    const errors = [];

    if (password.length < requirements.minLength) {
      errors.push(`La contraseña debe tener al menos ${requirements.minLength} caracteres`);
    }

    if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula');
    }

    if (requirements.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula');
    }

    if (requirements.requireNumbers && !/\d/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }

    if (requirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('La contraseña debe contener al menos un carácter especial');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Cambia la contraseña de un usuario
   * @param {number} userId - ID del usuario
   * @param {string} currentPassword - Contraseña actual
   * @param {string} newPassword - Nueva contraseña
   * @returns {Object} Resultado del cambio
   */
  changePassword(userId, currentPassword, newPassword) {
    try {
      const user = UserDAL.findUserForAuth(null, null);
      const foundUser = UserDAL.users?.find(u => u.id === parseInt(userId));
      
      if (!foundUser) {
        return {
          success: false,
          message: 'Usuario no encontrado'
        };
      }

      // Verificar contraseña actual
      if (!foundUser.authenticate(currentPassword)) {
        return {
          success: false,
          message: 'Contraseña actual incorrecta'
        };
      }

      // Validar nueva contraseña
      const validation = this.validatePasswordStrength(newPassword);
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.errors.join(', ')
        };
      }

      // Cambiar contraseña
      const success = UserDAL.changePassword(userId, newPassword);
      
      if (success) {
        console.log(`[${new Date().toISOString()}] AuthService - Contraseña cambiada: ${foundUser.username}`);
        return {
          success: true,
          message: 'Contraseña cambiada exitosamente'
        };
      } else {
        return {
          success: false,
          message: 'Error al cambiar la contraseña'
        };
      }

    } catch (error) {
      console.error(`[${new Date().toISOString()}] AuthService - Error en changePassword:`, error);
      return {
        success: false,
        message: 'Error interno del servidor'
      };
    }
  }

  /**
   * Desbloquea un usuario
   * @param {number} userId - ID del usuario
   * @returns {Object} Resultado del desbloqueo
   */
  unlockUser(userId) {
    try {
      const success = UserDAL.unlockUser(userId);
      
      if (success) {
        return {
          success: true,
          message: 'Usuario desbloqueado exitosamente'
        };
      } else {
        return {
          success: false,
          message: 'Usuario no encontrado'
        };
      }

    } catch (error) {
      console.error(`[${new Date().toISOString()}] AuthService - Error en unlockUser:`, error);
      return {
        success: false,
        message: 'Error interno del servidor'
      };
    }
  }

  /**
   * Obtiene estadísticas de usuarios
   * @returns {Object} Estadísticas
   */
  getUserStatistics() {
    return UserDAL.getStatistics();
  }

  /**
   * Busca usuarios por término
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Array} Usuarios encontrados
   */
  searchUsers(searchTerm) {
    return UserDAL.searchUsers(searchTerm);
  }
}

// Exportar instancia singleton
export default new AuthService();
