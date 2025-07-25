# Services Layer Documentation

## 🏗️ Capa de Servicios - Arquitectura de Software

### 📁 Estructura de Servicios

```
/services/
  ├── products.service.js  # Servicio para manejo de productos
  └── auth.service.js      # Servicio para autenticación y usuarios
```

---

## 🛍️ Products Service (`products.service.js`)

### Descripción
Servicio que maneja toda la lógica de negocio relacionada con productos. Actúa como intermediario entre los controladores de rutas y la API externa de FakeStore.

### Métodos Disponibles

#### `getAllProducts()`
- **Descripción:** Obtiene todos los productos disponibles
- **Returns:** `Promise<Array>` - Lista de productos
- **Throws:** Error si falla la comunicación con la API

#### `getProductById(productId)`
- **Descripción:** Obtiene un producto específico por ID
- **Parámetros:** 
  - `productId` (string|number): ID del producto
- **Returns:** `Promise<Object>` - Producto encontrado
- **Validaciones:** ID debe ser numérico
- **Throws:** Error si el producto no existe

#### `createProduct(productData)`
- **Descripción:** Crea un nuevo producto
- **Parámetros:**
  - `productData` (Object): Datos del producto
    - `title` (string, requerido): Título del producto
    - `price` (number, requerido): Precio del producto
    - `category` (string, requerido): Categoría del producto
    - `description` (string, opcional): Descripción del producto
    - `image` (string, opcional): URL de la imagen
- **Returns:** `Promise<Object>` - Producto creado y datos originales
- **Validaciones:** 
  - Campos requeridos presentes
  - Precio debe ser numérico y mayor a 0

#### `updateProduct(productId, updateData)`
- **Descripción:** Actualiza un producto existente
- **Parámetros:**
  - `productId` (string|number): ID del producto
  - `updateData` (Object): Datos a actualizar
- **Returns:** `Promise<Object>` - Producto actualizado
- **Validaciones:** Producto debe existir, datos válidos

#### `deleteProduct(productId)`
- **Descripción:** Elimina un producto por ID
- **Parámetros:**
  - `productId` (string|number): ID del producto
- **Returns:** `Promise<Object>` - Resultado de la eliminación
- **Validaciones:** Producto debe existir

#### `getProductsByCategory(category)`
- **Descripción:** Obtiene productos de una categoría específica
- **Parámetros:**
  - `category` (string): Nombre de la categoría
- **Returns:** `Promise<Array>` - Productos de la categoría

#### `getCategories()`
- **Descripción:** Obtiene todas las categorías disponibles
- **Returns:** `Promise<Array>` - Lista de categorías

### Ejemplo de Uso

```javascript
import productsService from '../services/products.service.js';

// Obtener todos los productos
const products = await productsService.getAllProducts();

// Crear un producto
const newProduct = await productsService.createProduct({
  title: 'Nuevo Producto',
  price: 29.99,
  category: 'electronics',
  description: 'Un producto increíble'
});
```

---

## 🔐 Auth Service (`auth.service.js`)

### Descripción
Servicio que maneja toda la lógica de autenticación, autorización y gestión de usuarios. Incluye generación y verificación de JWT tokens.

### Métodos Disponibles

#### `authenticateUser(credentials)`
- **Descripción:** Autentica un usuario con credenciales
- **Parámetros:**
  - `credentials` (Object):
    - `username` (string): Nombre de usuario
    - `email` (string): Email del usuario (alternativo a username)
    - `password` (string): Contraseña del usuario
- **Returns:** `Promise<Object>` - Usuario autenticado y token JWT
- **Validaciones:** 
  - Credenciales completas
  - Usuario activo
  - Contraseña correcta

#### `verifyToken(token)`
- **Descripción:** Verifica la validez de un token JWT
- **Parámetros:**
  - `token` (string): Token JWT a verificar
- **Returns:** `Promise<Object>` - Datos decodificados del token
- **Throws:** Error si el token es inválido o expirado

#### `generateToken(user)`
- **Descripción:** Genera un token JWT para un usuario
- **Parámetros:**
  - `user` (Object): Datos del usuario
- **Returns:** `Object` - Token y metadatos

#### `getUserById(userId)`
- **Descripción:** Obtiene información de un usuario por ID
- **Parámetros:**
  - `userId` (number): ID del usuario
- **Returns:** `Object|null` - Datos del usuario sin contraseña

#### `getUserByUsername(username)`
- **Descripción:** Obtiene información de un usuario por username
- **Parámetros:**
  - `username` (string): Username del usuario
- **Returns:** `Object|null` - Datos del usuario sin contraseña

#### `getAllUsers()`
- **Descripción:** Obtiene todos los usuarios (sin contraseñas)
- **Returns:** `Array` - Lista de usuarios

#### `hasRole(user, roles)`
- **Descripción:** Verifica si un usuario tiene un rol específico
- **Parámetros:**
  - `user` (Object): Datos del usuario
  - `roles` (string|Array): Rol o roles permitidos
- **Returns:** `boolean` - True si el usuario tiene el rol

#### `validatePasswordStrength(password)`
- **Descripción:** Valida la fortaleza de una contraseña
- **Parámetros:**
  - `password` (string): Contraseña a validar
- **Returns:** `Object` - Resultado detallado de la validación

### Métodos de Utilidad

#### `sanitizeUser(user)`
- Elimina información sensible del objeto usuario

#### `isValidEmail(email)`
- Valida el formato de un email

#### `updateLastLogin(userId)`
- Actualiza la fecha del último login

#### `deactivateUser(userId)` / `activateUser(userId)`
- Desactiva/activa una cuenta de usuario

### Ejemplo de Uso

```javascript
import authService from '../services/auth.service.js';

// Autenticar usuario
const authResult = await authService.authenticateUser({
  username: 'admin',
  password: 'admin123'
});

// Verificar token
const decoded = await authService.verifyToken('Bearer jwt-token-here');

// Verificar rol
const hasAdminRole = authService.hasRole(user, 'admin');
```

---

## 🏛️ Arquitectura de la Capa de Servicios

### Principios de Diseño

1. **Separación de Responsabilidades:**
   - Rutas: Manejo de HTTP y validación de entrada
   - Servicios: Lógica de negocio y comunicación con APIs
   - Middleware: Autenticación y autorización

2. **Singleton Pattern:**
   - Cada servicio exporta una instancia única
   - Evita múltiples instancias innecesarias

3. **Error Handling:**
   - Servicios lanzan errores específicos
   - Rutas manejan y formatean errores para HTTP

4. **Logging Detallado:**
   - Registro de todas las operaciones importantes
   - Timestamps para auditoría

### Flujo de Datos

```
Cliente HTTP
    ↓
Rutas (routes/)
    ↓
Servicios (services/)
    ↓
APIs Externas / Base de Datos
```

### Ventajas de esta Arquitectura

✅ **Mantenibilidad:** Código organizado y fácil de mantener  
✅ **Testabilidad:** Servicios pueden ser probados independientemente  
✅ **Reutilización:** Servicios pueden ser usados por múltiples rutas  
✅ **Escalabilidad:** Fácil agregar nuevos servicios o modificar existentes  
✅ **Separación:** Lógica de negocio separada de lógica de presentación  

---

## 🧪 Testing de Servicios

### Estructura de Pruebas Sugerida

```javascript
// Ejemplo de test para ProductsService
import productsService from '../services/products.service.js';

describe('ProductsService', () => {
  test('debe obtener todos los productos', async () => {
    const products = await productsService.getAllProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  test('debe crear un producto válido', async () => {
    const productData = {
      title: 'Test Product',
      price: 29.99,
      category: 'test'
    };
    
    const result = await productsService.createProduct(productData);
    expect(result.createdProduct.title).toBe('Test Product');
  });
});
```

---

## 🔧 Configuración y Variables de Entorno

Los servicios utilizan las siguientes variables de entorno:

```env
# API Externa
API_URL=https://fakestoreapi.com

# JWT Configuration
JWT_SECRET=tu_clave_secreta_super_segura_empresa_2025
JWT_EXPIRES_IN=24h

# Environment
NODE_ENV=development
```

---

## 📊 Monitoring y Logs

### Formato de Logs

```
[2025-07-25T02:21:31.288Z] ProductsService - Obteniendo todos los productos
[2025-07-25T02:21:31.289Z] ProductsService - 20 productos obtenidos exitosamente
[2025-07-25T02:21:32.100Z] AuthService - Usuario autenticado exitosamente: admin (admin)
```

### Información Registrada

- ✅ Operaciones de productos (CRUD)
- ✅ Intentos de autenticación (exitosos y fallidos)
- ✅ Verificaciones de token
- ✅ Errores de validación
- ✅ Comunicación con APIs externas
