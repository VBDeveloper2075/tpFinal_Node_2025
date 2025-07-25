# Configuración CORS - Documentación

## ✅ CORS Configurado para Aplicaciones Frontend Empresariales

### Orígenes Permitidos
El servidor está configurado para aceptar peticiones desde los siguientes orígenes:

- `http://localhost:3000` - Aplicación de desarrollo local
- `http://localhost:3001` - Segunda instancia de desarrollo  
- `http://localhost:8080` - Aplicaciones Vue.js/Webpack dev server
- `http://localhost:4200` - Aplicaciones Angular dev server
- `https://empresa.com` - Dominio de producción de la empresa
- `https://www.empresa.com` - Dominio de producción con www

### Métodos HTTP Permitidos
- GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS

### Headers Permitidos
- Content-Type
- Authorization  
- X-Requested-With
- Accept
- Origin

### Características de Seguridad

1. **Credenciales Habilitadas**: El servidor acepta cookies y headers de autenticación
2. **Validación Dinámica de Orígenes**: Solo los orígenes especificados en `.env` son permitidos
3. **Cache de Preflight**: Las peticiones OPTIONS se cachean por 24 horas
4. **Logging**: Todas las peticiones se registran con timestamp y origen

### Rutas de Prueba

#### Probar CORS
```
GET /api/test-cors
```
Respuesta de ejemplo:
```json
{
  "message": "CORS está funcionando correctamente",
  "origin": "http://localhost:3001", 
  "timestamp": "2025-07-25T02:07:08.661Z",
  "allowedMethods": ["GET","HEAD","PUT","PATCH","POST","DELETE","OPTIONS"],
  "status": "success"
}
```

#### Información de Configuración
```
GET /api/cors-info
```
Devuelve la configuración completa de CORS y información de la petición.

### Configuración en Variables de Entorno

Edita el archivo `.env` para personalizar la configuración:

```env
# Orígenes separados por comas
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,https://tuempresa.com

# Habilitar credenciales
CORS_CREDENTIALS=true

# Métodos permitidos
CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS

# Headers permitidos  
CORS_ALLOWED_HEADERS=Content-Type,Authorization,X-Requested-With,Accept,Origin
```

### Para Desarrolladores Frontend

#### JavaScript/Fetch
```javascript
fetch('http://localhost:3000/api/test-cors', {
  method: 'GET',
  credentials: 'include', // Para enviar cookies
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer tu-token'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

#### Axios
```javascript
axios.defaults.withCredentials = true;
axios.get('http://localhost:3000/api/test-cors', {
  headers: {
    'Authorization': 'Bearer tu-token'
  }
});
```

### Resolución de Problemas

Si encuentras errores CORS:

1. **Verifica el origen**: Asegúrate de que tu aplicación frontend esté corriendo en uno de los orígenes permitidos
2. **Revisa los logs**: El servidor registra todas las peticiones con su origen
3. **Comprueba headers**: Usa las rutas de prueba para verificar qué headers se están enviando
4. **Variables de entorno**: Asegúrate de que el archivo `.env` esté configurado correctamente

### Headers de Respuesta CORS

El servidor agrega automáticamente estos headers:
- `Access-Control-Allow-Origin`: El origen específico que hizo la petición
- `Access-Control-Allow-Credentials`: true
- `Access-Control-Allow-Methods`: Métodos permitidos
- `Access-Control-Allow-Headers`: Headers permitidos  
- `Vary: Origin`: Para cacheo correcto por parte de proxies
