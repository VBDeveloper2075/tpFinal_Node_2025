// Data Access Layer para usuarios
import User from './User.js';
import { usersData, userRoles, authConfig } from '../data/users.data.js';

class UserDAL {
  constructor() {
    // Cargar usuarios desde los datos iniciales
    this.users = usersData.map(userData => User.fromData(userData));
    this.nextId = Math.max(...this.users.map(u => u.id)) + 1;
  }

  /**
   * Obtiene todos los usuarios
   * @param {Object} filters - Filtros opcionales
   * @returns {Array} Lista de usuarios (sin contraseñas)
   */
  getAllUsers(filters = {}) {
    let filteredUsers = [...this.users];

    // Aplicar filtros
    if (filters.role) {
      filteredUsers = filteredUsers.filter(u => u.role === filters.role);
    }

    if (filters.isActive !== undefined) {
      filteredUsers = filteredUsers.filter(u => u.isActive === filters.isActive);
    }

    if (filters.isLocked !== undefined) {
      filteredUsers = filteredUsers.filter(u => u.isLocked === filters.isLocked);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(u => 
        u.username.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm) ||
        u.firstName.toLowerCase().includes(searchTerm) ||
        u.lastName.toLowerCase().includes(searchTerm)
      );
    }

    // Ordenamiento
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'username':
          filteredUsers.sort((a, b) => a.username.localeCompare(b.username));
          break;
        case 'email':
          filteredUsers.sort((a, b) => a.email.localeCompare(b.email));
          break;
        case 'role':
          filteredUsers.sort((a, b) => a.role.localeCompare(b.role));
          break;
        case 'created':
          filteredUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'lastLogin':
          filteredUsers.sort((a, b) => {
            if (!a.lastLogin && !b.lastLogin) return 0;
            if (!a.lastLogin) return 1;
            if (!b.lastLogin) return -1;
            return new Date(b.lastLogin) - new Date(a.lastLogin);
          });
          break;
        default:
          // Sin ordenamiento adicional
          break;
      }
    }

    return filteredUsers.map(u => u.toPublic());
  }

  /**
   * Obtiene un usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Object|null} Usuario encontrado (sin contraseña) o null
   */
  getUserById(id) {
    const user = this.users.find(u => u.id === parseInt(id));
    return user ? user.toPublic() : null;
  }

  /**
   * Obtiene un usuario por username
   * @param {string} username - Username del usuario
   * @returns {Object|null} Usuario encontrado (sin contraseña) o null
   */
  getUserByUsername(username) {
    const user = this.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    return user ? user.toPublic() : null;
  }

  /**
   * Obtiene un usuario por email
   * @param {string} email - Email del usuario
   * @returns {Object|null} Usuario encontrado (sin contraseña) o null
   */
  getUserByEmail(email) {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user ? user.toPublic() : null;
  }

  /**
   * Busca un usuario por credenciales (para autenticación)
   * @param {string} username - Username o email
   * @param {string} email - Email (opcional)
   * @returns {Object|null} Usuario completo (con contraseña) o null
   */
  findUserForAuth(username, email) {
    return this.users.find(u => 
      (username && u.username.toLowerCase() === username.toLowerCase()) ||
      (email && u.email.toLowerCase() === email.toLowerCase())
    );
  }

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Object} Usuario creado (sin contraseña)
   */
  createUser(userData) {
    // Verificar que username y email sean únicos
    const existingUsername = this.users.find(u => 
      u.username.toLowerCase() === userData.username.toLowerCase()
    );
    if (existingUsername) {
      throw new Error('Username ya existe');
    }

    const existingEmail = this.users.find(u => 
      u.email.toLowerCase() === userData.email.toLowerCase()
    );
    if (existingEmail) {
      throw new Error('Email ya existe');
    }

    const newUser = new User(
      this.nextId++,
      userData.username,
      userData.email,
      userData.password, // En producción hashear con bcrypt
      userData.role || 'user',
      userData.firstName || '',
      userData.lastName || ''
    );

    const validation = newUser.validate();
    if (!validation.isValid) {
      throw new Error(`Datos de usuario inválidos: ${validation.errors.join(', ')}`);
    }

    this.users.push(newUser);
    console.log(`[${new Date().toISOString()}] UserDAL - Usuario creado: ${newUser.username}`);
    
    return newUser.toPublic();
  }

  /**
   * Actualiza un usuario existente
   * @param {number} id - ID del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Object|null} Usuario actualizado (sin contraseña) o null
   */
  updateUser(id, updateData) {
    const userIndex = this.users.findIndex(u => u.id === parseInt(id));
    
    if (userIndex === -1) {
      return null;
    }

    const user = this.users[userIndex];

    // Verificar unicidad de email si se está actualizando
    if (updateData.email && updateData.email !== user.email) {
      const existingEmail = this.users.find(u => 
        u.id !== user.id && u.email.toLowerCase() === updateData.email.toLowerCase()
      );
      if (existingEmail) {
        throw new Error('Email ya existe');
      }
    }

    user.update(updateData);

    const validation = user.validate();
    if (!validation.isValid) {
      throw new Error(`Datos de actualización inválidos: ${validation.errors.join(', ')}`);
    }

    console.log(`[${new Date().toISOString()}] UserDAL - Usuario actualizado: ${user.username}`);
    
    return user.toPublic();
  }

  /**
   * Elimina un usuario (desactivación)
   * @param {number} id - ID del usuario
   * @returns {boolean} True si se desactivó exitosamente
   */
  deleteUser(id) {
    const user = this.users.find(u => u.id === parseInt(id));
    
    if (!user) {
      return false;
    }

    user.isActive = false;
    user.updatedAt = new Date().toISOString();

    console.log(`[${new Date().toISOString()}] UserDAL - Usuario desactivado: ${user.username}`);
    
    return true;
  }

  /**
   * Actualiza el último login de un usuario
   * @param {number} id - ID del usuario
   * @returns {boolean} True si se actualizó exitosamente
   */
  updateLastLogin(id) {
    const user = this.users.find(u => u.id === parseInt(id));
    
    if (!user) {
      return false;
    }

    user.updateLastLogin();
    console.log(`[${new Date().toISOString()}] UserDAL - Último login actualizado: ${user.username}`);
    
    return true;
  }

  /**
   * Incrementa los intentos de login fallidos
   * @param {number} id - ID del usuario
   * @returns {boolean} True si se actualizó exitosamente
   */
  incrementLoginAttempts(id) {
    const user = this.users.find(u => u.id === parseInt(id));
    
    if (!user) {
      return false;
    }

    user.incrementLoginAttempts();
    console.log(`[${new Date().toISOString()}] UserDAL - Intentos de login incrementados: ${user.username} (${user.loginAttempts}/${authConfig.maxLoginAttempts})`);
    
    return true;
  }

  /**
   * Desbloquea una cuenta de usuario
   * @param {number} id - ID del usuario
   * @returns {boolean} True si se desbloqueó exitosamente
   */
  unlockUser(id) {
    const user = this.users.find(u => u.id === parseInt(id));
    
    if (!user) {
      return false;
    }

    user.unlock();
    console.log(`[${new Date().toISOString()}] UserDAL - Usuario desbloqueado: ${user.username}`);
    
    return true;
  }

  /**
   * Cambia la contraseña de un usuario
   * @param {number} id - ID del usuario
   * @param {string} newPassword - Nueva contraseña
   * @returns {boolean} True si se cambió exitosamente
   */
  changePassword(id, newPassword) {
    const user = this.users.find(u => u.id === parseInt(id));
    
    if (!user) {
      return false;
    }

    // Validar fortaleza de la contraseña
    const passwordValidation = User.validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error('La contraseña no cumple con los requisitos de seguridad');
    }

    user.changePassword(newPassword); // En producción hashear con bcrypt
    console.log(`[${new Date().toISOString()}] UserDAL - Contraseña cambiada: ${user.username}`);
    
    return true;
  }

  /**
   * Obtiene todos los roles disponibles
   * @returns {Array} Lista de roles con permisos
   */
  getRoles() {
    return userRoles;
  }

  /**
   * Verifica si un usuario tiene un permiso específico
   * @param {number} userId - ID del usuario
   * @param {string} permission - Permiso a verificar
   * @returns {boolean} True si tiene el permiso
   */
  hasPermission(userId, permission) {
    const user = this.users.find(u => u.id === parseInt(userId));
    
    if (!user || !user.isActive) {
      return false;
    }

    const role = userRoles.find(r => r.name === user.role);
    return role ? role.permissions.includes(permission) : false;
  }

  /**
   * Obtiene estadísticas de usuarios
   * @returns {Object} Estadísticas
   */
  getStatistics() {
    const stats = {
      totalUsers: this.users.length,
      activeUsers: this.users.filter(u => u.isActive).length,
      lockedUsers: this.users.filter(u => u.isLocked).length,
      usersByRole: {},
      recentLogins: 0
    };

    // Contar por roles
    this.users.forEach(u => {
      stats.usersByRole[u.role] = (stats.usersByRole[u.role] || 0) + 1;
    });

    // Logins recientes (últimas 24 horas)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    stats.recentLogins = this.users.filter(u => 
      u.lastLogin && new Date(u.lastLogin) > yesterday
    ).length;

    return stats;
  }

  /**
   * Busca usuarios por término
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Array} Usuarios que coinciden (sin contraseñas)
   */
  searchUsers(searchTerm) {
    const term = searchTerm.toLowerCase();
    return this.users
      .filter(u => 
        u.username.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.firstName.toLowerCase().includes(term) ||
        u.lastName.toLowerCase().includes(term)
      )
      .map(u => u.toPublic());
  }

  /**
   * Obtiene la configuración de autenticación
   * @returns {Object} Configuración de autenticación
   */
  getAuthConfig() {
    return authConfig;
  }
}

// Exportar instancia singleton
export default new UserDAL();
