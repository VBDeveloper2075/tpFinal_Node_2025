// Modelo de datos para usuarios
class User {
  constructor(id, username, email, password, role = 'user', firstName = '', lastName = '') {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password; // En producción debe estar hasheada
    this.role = role;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isActive = true;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.lastLogin = null;
    this.loginAttempts = 0;
    this.isLocked = false;
    this.preferences = {
      theme: 'light',
      language: 'es',
      notifications: true
    };
  }

  // Método para actualizar el usuario
  update(updateData) {
    const allowedFields = ['email', 'firstName', 'lastName', 'role', 'isActive', 'preferences'];
    
    for (const field of allowedFields) {
      if (updateData.hasOwnProperty(field)) {
        this[field] = updateData[field];
      }
    }
    
    this.updatedAt = new Date().toISOString();
  }

  // Método para obtener una versión pública del usuario (sin contraseña)
  toPublic() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role,
      firstName: this.firstName,
      lastName: this.lastName,
      isActive: this.isActive,
      createdAt: this.createdAt,
      lastLogin: this.lastLogin,
      preferences: this.preferences
    };
  }

  // Método para validar los datos del usuario
  validate() {
    const errors = [];

    if (!this.username || this.username.trim().length < 3) {
      errors.push('El username debe tener al menos 3 caracteres');
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Email inválido');
    }

    if (!this.password || this.password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    const validRoles = ['admin', 'manager', 'user', 'guest'];
    if (!validRoles.includes(this.role)) {
      errors.push('Rol inválido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Método para validar email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Método para actualizar último login
  updateLastLogin() {
    this.lastLogin = new Date().toISOString();
    this.loginAttempts = 0; // Reset intentos fallidos
    this.updatedAt = new Date().toISOString();
  }

  // Método para incrementar intentos de login fallidos
  incrementLoginAttempts() {
    this.loginAttempts += 1;
    
    // Bloquear cuenta después de 5 intentos fallidos
    if (this.loginAttempts >= 5) {
      this.isLocked = true;
    }
    
    this.updatedAt = new Date().toISOString();
  }

  // Método para desbloquear cuenta
  unlock() {
    this.isLocked = false;
    this.loginAttempts = 0;
    this.updatedAt = new Date().toISOString();
  }

  // Método para cambiar contraseña
  changePassword(newPassword) {
    // En producción: hashear la contraseña con bcrypt
    this.password = newPassword;
    this.updatedAt = new Date().toISOString();
  }

  // Método para verificar si tiene un rol específico
  hasRole(requiredRole) {
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(this.role);
    }
    return this.role === requiredRole;
  }

  // Método para verificar permisos de administrador
  isAdmin() {
    return this.role === 'admin';
  }

  // Método para verificar permisos de manager
  isManager() {
    return this.role === 'manager' || this.role === 'admin';
  }

  // Método para obtener el nombre completo
  getFullName() {
    return `${this.firstName} ${this.lastName}`.trim() || this.username;
  }

  // Método estático para crear un usuario desde datos planos
  static fromData(data) {
    const user = new User(
      data.id,
      data.username,
      data.email,
      data.password,
      data.role || 'user',
      data.firstName || '',
      data.lastName || ''
    );

    // Restaurar campos adicionales si existen
    if (data.isActive !== undefined) user.isActive = data.isActive;
    if (data.createdAt) user.createdAt = data.createdAt;
    if (data.lastLogin) user.lastLogin = data.lastLogin;
    if (data.loginAttempts) user.loginAttempts = data.loginAttempts;
    if (data.isLocked !== undefined) user.isLocked = data.isLocked;
    if (data.preferences) user.preferences = { ...user.preferences, ...data.preferences };

    return user;
  }

  // Método estático para validar fortaleza de contraseña
  static validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const isValid = password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
    
    return {
      isValid,
      length: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      score: [
        password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar
      ].filter(Boolean).length
    };
  }
}

export default User;
