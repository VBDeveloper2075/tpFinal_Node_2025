// Datos de usuarios para la aplicación
export const usersData = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@tienda.com',
    password: 'admin123', // En producción usar bcrypt para hashear
    role: 'admin',
    firstName: 'Administrador',
    lastName: 'Sistema',
    isActive: true,
    isLocked: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    lastLogin: '2024-12-31T10:00:00.000Z',
    loginAttempts: 0,
    lastLoginAttempt: null
  },
  {
    id: 2,
    username: 'vendedor1',
    email: 'vendedor1@tienda.com',
    password: 'vend123',
    role: 'seller',
    firstName: 'Juan',
    lastName: 'Pérez',
    isActive: true,
    isLocked: false,
    createdAt: '2024-02-15T00:00:00.000Z',
    updatedAt: '2024-02-15T00:00:00.000Z',
    lastLogin: '2024-12-30T14:30:00.000Z',
    loginAttempts: 0,
    lastLoginAttempt: null
  },
  {
    id: 3,
    username: 'cliente1',
    email: 'cliente1@gmail.com',
    password: 'cli123',
    role: 'user',
    firstName: 'María',
    lastName: 'González',
    isActive: true,
    isLocked: false,
    createdAt: '2024-03-10T00:00:00.000Z',
    updatedAt: '2024-03-10T00:00:00.000Z',
    lastLogin: '2024-12-31T09:15:00.000Z',
    loginAttempts: 0,
    lastLoginAttempt: null
  },
  {
    id: 4,
    username: 'cliente2',
    email: 'cliente2@hotmail.com',
    password: 'cliente456',
    role: 'user',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    isActive: true,
    isLocked: false,
    createdAt: '2024-03-20T00:00:00.000Z',
    updatedAt: '2024-03-20T00:00:00.000Z',
    lastLogin: '2024-12-29T16:45:00.000Z',
    loginAttempts: 0,
    lastLoginAttempt: null
  },
  {
    id: 5,
    username: 'manager1',
    email: 'manager@tienda.com',
    password: 'manager789',
    role: 'manager',
    firstName: 'Ana',
    lastName: 'López',
    isActive: true,
    isLocked: false,
    createdAt: '2024-01-20T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z',
    lastLogin: '2024-12-30T08:00:00.000Z',
    loginAttempts: 0,
    lastLoginAttempt: null
  },
  {
    id: 6,
    username: 'cliente3',
    email: 'cliente3@yahoo.com',
    password: 'clave123',
    role: 'user',
    firstName: 'Luis',
    lastName: 'Martínez',
    isActive: false, // Usuario desactivado
    isLocked: false,
    createdAt: '2024-04-01T00:00:00.000Z',
    updatedAt: '2024-12-01T00:00:00.000Z',
    lastLogin: '2024-11-15T12:30:00.000Z',
    loginAttempts: 0,
    lastLoginAttempt: null
  },
  {
    id: 7,
    username: 'spammer',
    email: 'spam@malicious.com',
    password: 'blocked',
    role: 'user',
    firstName: 'Usuario',
    lastName: 'Bloqueado',
    isActive: true,
    isLocked: true, // Usuario bloqueado por intentos fallidos
    createdAt: '2024-05-01T00:00:00.000Z',
    updatedAt: '2024-12-31T00:00:00.000Z',
    lastLogin: null,
    loginAttempts: 5,
    lastLoginAttempt: '2024-12-31T00:00:00.000Z'
  }
];

// Definición de roles y permisos
export const userRoles = [
  {
    name: 'admin',
    displayName: 'Administrador',
    permissions: [
      'users.read',
      'users.create',
      'users.update',
      'users.delete',
      'products.read',
      'products.create',
      'products.update',
      'products.delete',
      'orders.read',
      'orders.create',
      'orders.update',
      'orders.delete',
      'reports.read',
      'system.admin'
    ]
  },
  {
    name: 'manager',
    displayName: 'Gerente',
    permissions: [
      'users.read',
      'users.create',
      'users.update',
      'products.read',
      'products.create',
      'products.update',
      'products.delete',
      'orders.read',
      'orders.update',
      'reports.read'
    ]
  },
  {
    name: 'seller',
    displayName: 'Vendedor',
    permissions: [
      'products.read',
      'products.create',
      'products.update',
      'orders.read',
      'orders.create',
      'orders.update'
    ]
  },
  {
    name: 'user',
    displayName: 'Cliente',
    permissions: [
      'products.read',
      'orders.read',
      'orders.create',
      'profile.update'
    ]
  }
];

// Configuración de autenticación
export const authConfig = {
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutos en milisegundos
  tokenExpiration: '24h',
  refreshTokenExpiration: '7d',
  passwordMinLength: 6,
  passwordRequirements: {
    minLength: 6,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialChars: false
  },
  sessionTimeout: 60 * 60 * 1000 // 1 hora en milisegundos
};

// Configuración de validación de usuarios
export const userValidation = {
  username: {
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9_]+$/, // Solo letras, números y guiones bajos
    reservedNames: ['admin', 'root', 'administrator', 'system', 'api']
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 255
  },
  name: {
    minLength: 1,
    maxLength: 100,
    pattern: /^[a-zA-ZÀ-ÿ\s]+$/ // Letras y espacios, incluyendo acentos
  }
};

// Estados de usuario predefinidos
export const userStates = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  LOCKED: 'locked',
  PENDING: 'pending',
  SUSPENDED: 'suspended'
};

// Configuración de sesiones
export const sessionConfig = {
  maxConcurrentSessions: 3,
  sessionTimeout: 60 * 60 * 1000, // 1 hora
  rememberMeDuration: 30 * 24 * 60 * 60 * 1000, // 30 días
  trackUserAgent: true,
  trackIpAddress: true
};

// Permisos disponibles en el sistema
export const availablePermissions = [
  // Permisos de usuarios
  { name: 'users.read', description: 'Ver usuarios' },
  { name: 'users.create', description: 'Crear usuarios' },
  { name: 'users.update', description: 'Actualizar usuarios' },
  { name: 'users.delete', description: 'Eliminar usuarios' },
  
  // Permisos de productos
  { name: 'products.read', description: 'Ver productos' },
  { name: 'products.create', description: 'Crear productos' },
  { name: 'products.update', description: 'Actualizar productos' },
  { name: 'products.delete', description: 'Eliminar productos' },
  
  // Permisos de órdenes
  { name: 'orders.read', description: 'Ver órdenes' },
  { name: 'orders.create', description: 'Crear órdenes' },
  { name: 'orders.update', description: 'Actualizar órdenes' },
  { name: 'orders.delete', description: 'Eliminar órdenes' },
  
  // Permisos de reportes
  { name: 'reports.read', description: 'Ver reportes' },
  { name: 'reports.create', description: 'Crear reportes' },
  
  // Permisos de sistema
  { name: 'system.admin', description: 'Administración del sistema' },
  { name: 'profile.update', description: 'Actualizar perfil propio' }
];
