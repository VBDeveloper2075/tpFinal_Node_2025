# Configuración de Firebase para el Proyecto

## Pasos para configurar Firebase:

### 1. Crear proyecto en Firebase Console
1. Ve a https://console.firebase.google.com/
2. Haz clic en "Crear un proyecto"
3. Nombre del proyecto: `tp-final-node-2025` (o el que prefieras)
4. Habilita Google Analytics (opcional)

### 2. Configurar Firestore
1. En el panel izquierdo, ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba" (para desarrollo)
4. Elige una ubicación (ej: southamerica-east1)

### 3. Obtener configuración del proyecto
1. Ve a "Configuración del proyecto" (ícono de engranaje)
2. En la pestaña "General", ve a "Tus aplicaciones"
3. Haz clic en "Agregar aplicación" y selecciona "Web"
4. Registra la aplicación con nombre: "tp-final-node-backend"
5. Copia la configuración que aparece

### 4. Actualizar archivo .env
Reemplaza los valores en el archivo `.env` con los de tu configuración:

```env
FIREBASE_API_KEY=tu-api-key-real
FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
FIREBASE_APP_ID=tu-app-id
FIREBASE_MEASUREMENT_ID=tu-measurement-id
```

### 5. Probar la conexión
1. Asegúrate de que el servidor esté corriendo: `node index.js`
2. Ve a: http://localhost:3000/api/firebase/test
3. Deberías ver una respuesta JSON con `"success": true`

### 6. Inicializar productos de muestra
1. Ejecuta: `node scripts/init-firebase.js`
2. Esto creará productos de muestra en Firestore

## Endpoints disponibles para Firebase:

### Productos en Firestore:
- `GET /api/firestore/products` - Obtener todos los productos
- `GET /api/firestore/products/:id` - Obtener producto por ID
- `POST /api/firestore/products` - Crear nuevo producto (requiere auth)
- `PUT /api/firestore/products/:id` - Actualizar producto (requiere auth)
- `DELETE /api/firestore/products/:id` - Eliminar producto (requiere auth)
- `GET /api/firestore/categories` - Obtener categorías
- `GET /api/firestore/search/:term` - Buscar productos

### Pruebas:
- `GET /api/firebase/test` - Probar conexión con Firebase

## Estructura de documento de producto en Firestore:

```json
{
  "title": "string",
  "price": "number",
  "description": "string",
  "category": "string",
  "image": "string (URL)",
  "rating": {
    "rate": "number",
    "count": "number"
  },
  "stock": "number",
  "tags": ["array", "of", "strings"],
  "brand": "string",
  "isActive": "boolean",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Notas importantes:
- Los datos se almacenan en la colección `products`
- Se incluye validación automática usando el modelo Product
- Los timestamps se manejan automáticamente
- Se requiere autenticación JWT para operaciones de escritura
