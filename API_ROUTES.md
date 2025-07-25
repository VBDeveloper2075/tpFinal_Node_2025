# API Routes Documentation

## 🚀 Rutas del Proyecto - Productos y Autenticación

### 📁 Estructura de Rutas

```
/routes/
  ├── products.routes.js  # Rutas para manejo de productos
  ├── auth.routes.js      # Rutas para autenticación
/middleware/
  └── auth.middleware.js  # Middleware de autenticación JWT
```

---

## 🛍️ Rutas de Productos (`/api/products`)

### GET /api/products
**Descripción:** Obtiene todos los productos disponibles

**Request:**
```bash
GET http://localhost:3000/api/products
```

**Response:**
```json
{
  "success": true,
  "message": "Productos obtenidos exitosamente",
  "data": [...], // Array de productos
  "count": 20,
  "timestamp": "2025-07-25T02:21:31.288Z"
}
```

### GET /api/products/:id
**Descripción:** Obtiene un producto específico por ID

**Request:**
```bash
GET http://localhost:3000/api/products/1
```

**Response:**
```json
{
  "success": true,
  "message": "Producto obtenido exitosamente", 
  "data": {
    "id": 1,
    "title": "Producto Example",
    "price": 109.95,
    "description": "Descripción del producto",
    "category": "men's clothing",
    "image": "https://...",
    "rating": {...}
  },
  "timestamp": "2025-07-25T02:21:31.288Z"
}
```

### POST /api/products/create
**Descripción:** Crea un nuevo producto

**Request:**
```bash
POST http://localhost:3000/api/products/create
Content-Type: application/json

{
  "title": "Nuevo Producto",
  "price": 29.99,
  "category": "electronics",
  "description": "Descripción del producto" // Opcional
  "image": "https://..." // Opcional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "id": 21,
    "title": "Nuevo Producto",
    "price": 29.99,
    "description": "Descripción del producto",
    "image": "https://via.placeholder.com/300",
    "category": "electronics"
  },
  "originalData": {...},
  "timestamp": "2025-07-25T02:21:46.058Z"
}
```

### DELETE /api/products/:id
**Descripción:** Elimina un producto específico

**Request:**
```bash
DELETE http://localhost:3000/api/products/1
```

**Response:**
```json
{
  "success": true,
  "message": "Producto con ID 1 eliminado exitosamente",
  "data": {...},
  "deletedId": "1",
  "timestamp": "2025-07-25T02:21:31.288Z"
}
```

---

## 🔐 Rutas de Autenticación (`/auth`)

### POST /auth/login
**Descripción:** Autentica un usuario y devuelve un JWT token

**Request:**
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "username": "admin",     // O usar "email"
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Autenticación exitosa",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@empresa.com",
      "role": "admin",
      "firstName": "Administrador",
      "lastName": "Sistema"
    },
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": "24h"
  },
  "timestamp": "2025-07-25T02:21:31.288Z"
}
```

### GET /auth/verify
**Descripción:** Verifica la validez de un JWT token

**Request:**
```bash
GET http://localhost:3000/auth/verify
Authorization: Bearer <tu-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Token válido",
  "data": {
    "user": {...},
    "tokenValid": true
  },
  "timestamp": "2025-07-25T02:21:31.288Z"
}
```

### GET /auth/users
**Descripción:** Obtiene lista de usuarios (solo en desarrollo)

**Request:**
```bash
GET http://localhost:3000/auth/users
```

---

## 👥 Usuarios de Prueba

| Username | Email | Password | Role |
|----------|-------|----------|------|
| admin | admin@empresa.com | admin123 | admin |
| usuario | usuario@empresa.com | user123 | user |
| manager | manager@empresa.com | manager123 | manager |

---

## 🔒 Middleware de Autenticación

### authenticateToken
Verifica que el usuario tenga un JWT válido.

```javascript
import { authenticateToken } from '../middleware/auth.middleware.js';

router.get('/protected', authenticateToken, (req, res) => {
  // req.user contiene la información del usuario
  res.json({ user: req.user });
});
```

### authorizeRoles
Verifica que el usuario tenga uno de los roles especificados.

```javascript
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware.js';

router.delete('/admin-only', 
  authenticateToken, 
  authorizeRoles('admin'), 
  (req, res) => {
    // Solo administradores pueden acceder
  }
);
```

---

## 🧪 Ejemplos de Uso con Frontend

### JavaScript/Fetch
```javascript
// Login
const loginResponse = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
});

const loginData = await loginResponse.json();
const token = loginData.data.token;

// Usar token para obtener productos
const productsResponse = await fetch('/api/products', {
  headers: {
    'Authorization': token
  }
});
```

### Axios
```javascript
// Configurar token globalmente
axios.defaults.headers.common['Authorization'] = 'Bearer tu-token';

// Obtener productos
const products = await axios.get('/api/products');

// Crear producto
const newProduct = await axios.post('/api/products/create', {
  title: 'Nuevo Producto',
  price: 29.99,
  category: 'electronics'
});
```

---

## ❌ Manejo de Errores

### Códigos de Estado HTTP
- **200** - Éxito
- **201** - Creado exitosamente
- **400** - Datos inválidos
- **401** - No autenticado
- **403** - No autorizado
- **404** - Recurso no encontrado
- **500** - Error interno del servidor

### Formato de Errores
```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles técnicos del error",
  "timestamp": "2025-07-25T02:21:31.288Z"
}
```

---

## 🔧 Variables de Entorno

```env
# JWT Configuration
JWT_SECRET=tu_clave_secreta_super_segura_empresa_2025
JWT_EXPIRES_IN=24h

# API Configuration  
API_URL=https://fakestoreapi.com
```

---

## 📝 Logging

El servidor registra automáticamente:
- ✅ Intentos de login (exitosos y fallidos)
- ✅ Verificaciones de token
- ✅ Operaciones con productos
- ✅ Errores de autenticación y autorización

Ejemplo de logs:
```
[2025-07-25T02:21:31.288Z] POST /auth/login - Intento de login para: admin
[2025-07-25T02:21:31.288Z] LOGIN SUCCESS - Usuario autenticado: admin (admin)
[2025-07-25T02:21:31.288Z] GET /api/products - Obteniendo todos los productos
```
