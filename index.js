// FakeStore API
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Configurar dotenv
dotenv.config();

const API_URL = 'https://fakestoreapi.com';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Crear aplicación Express
const app = express();

// Configurar middlewares
// Configuración avanzada de CORS para aplicaciones Frontend empresariales
const corsOptions = {
  origin: function (origin, callback) {
    // Obtener orígenes permitidos desde variables de entorno
    const allowedOrigins = process.env.CORS_ORIGIN ? 
      process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) : 
      ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8080', 'http://localhost:4200'];
    
    // Permitir requests sin origen (ej: aplicaciones móviles, Postman)
    if (!origin) return callback(null, true);
    
    // Verificar si el origen está en la lista permitida
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Origen ${origin} no permitido por la política CORS`));
    }
  },
  credentials: process.env.CORS_CREDENTIALS === 'true', // Habilitar cookies/credenciales
  methods: process.env.CORS_METHODS ? 
    process.env.CORS_METHODS.split(',').map(method => method.trim()) : 
    ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: process.env.CORS_ALLOWED_HEADERS ? 
    process.env.CORS_ALLOWED_HEADERS.split(',').map(header => header.trim()) : 
    ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200, // Para navegadores legacy (IE11, varios SmartTVs)
  maxAge: 86400 // Cache preflight por 24 horas
};

app.use(cors(corsOptions));

// Configuración avanzada de Body-Parser para interpretar JSON
app.use(bodyParser.json({ 
  limit: '10mb', // Limite de 10MB para peticiones JSON
  strict: true, // Solo acepta arrays y objetos como JSON válido
  type: ['application/json', 'application/*+json'], // Tipos MIME que se interpretan como JSON
  verify: (req, res, buf, encoding) => {
    // Verificación personalizada del JSON (opcional)
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
    }
  }
}));

// Body-parser para datos de formularios URL-encoded
app.use(bodyParser.urlencoded({ 
  extended: true, // Permite objetos y arrays anidados
  limit: '10mb', // Limite de 10MB
  parameterLimit: 1000, // Máximo 1000 parámetros
  type: 'application/x-www-form-urlencoded'
}));

// Body-parser para texto plano
app.use(bodyParser.text({ 
  limit: '10mb',
  type: 'text/plain'
}));

// Body-parser para datos raw/buffer
app.use(bodyParser.raw({ 
  limit: '10mb',
  type: 'application/octet-stream'
}));

// Middleware de validación JSON personalizado
app.use((req, res, next) => {
  // Validar que el Content-Type sea correcto para peticiones con body
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('Content-Type');
    
    if (req.body && Object.keys(req.body).length > 0) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Body recibido:`, 
        typeof req.body === 'object' ? 'JSON válido' : 'Formato: ' + typeof req.body);
    }
  }
  next();
});

// Middleware de logging para peticiones
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const origin = req.get('Origin') || 'No origin';
  console.log(`[${timestamp}] ${req.method} ${req.path} - Origin: ${origin}`);
  next();
});

// Servir archivos estáticos desde la carpeta public
app.use(express.static(join(__dirname, 'public')));

// Ruta principal - servir index.html
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Ruta de prueba para verificar CORS
app.get('/api/test-cors', (req, res) => {
  res.json({
    message: 'CORS está funcionando correctamente',
    origin: req.get('Origin') || 'No origin specified',
    timestamp: new Date().toISOString(),
    allowedMethods: corsOptions.methods,
    status: 'success'
  });
});

// Ruta de prueba para verificar Body-Parser con JSON
app.post('/api/test-json', (req, res) => {
  console.log('Body recibido:', req.body);
  console.log('Raw body:', req.rawBody);
  
  res.json({
    message: 'Body-parser está funcionando correctamente',
    receivedData: req.body,
    dataType: typeof req.body,
    contentType: req.get('Content-Type'),
    bodySize: req.rawBody ? req.rawBody.length : 0,
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

// Ruta de prueba para verificar Body-Parser con form-data
app.post('/api/test-form', (req, res) => {
  console.log('Form data recibido:', req.body);
  
  res.json({
    message: 'Form data procesado correctamente',
    receivedData: req.body,
    dataType: typeof req.body,
    contentType: req.get('Content-Type'),
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

// Ruta de prueba para verificar Body-Parser con texto plano
app.post('/api/test-text', (req, res) => {
  console.log('Texto recibido:', req.body);
  
  res.json({
    message: 'Texto plano procesado correctamente',
    receivedText: req.body,
    textLength: req.body ? req.body.length : 0,
    contentType: req.get('Content-Type'),
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

// Ruta para obtener información de configuración CORS (útil para debugging)
app.get('/api/cors-info', (req, res) => {
  const allowedOrigins = process.env.CORS_ORIGIN ? 
    process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) : 
    ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8080', 'http://localhost:4200'];
  
  res.json({
    corsConfiguration: {
      allowedOrigins,
      credentials: process.env.CORS_CREDENTIALS === 'true',
      methods: corsOptions.methods,
      allowedHeaders: corsOptions.allowedHeaders
    },
    requestInfo: {
      origin: req.get('Origin') || 'No origin',
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    }
  });
});

// Middleware para manejo de errores 404
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Middleware para manejo de errores globales
app.use((error, req, res, next) => {
  console.error('Error del servidor:', error);
  res.status(500).send('Error interno del servidor');
});

// Iniciar el servidor si NO se están ejecutando comandos CLI
if (process.argv.length <= 2) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
  });
} else {
  // Funcionalidad de línea de comandos
  // Procesar los argumentos de la línea de comandos
  const processArgs = () => {
    // Obtener argumentos excluyendo 'node' y 'script'
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
      console.error('Uso: npm run start <MÉTODO> <RECURSO> [PARÁMETROS ADICIONALES]');
      process.exit(1);
    }

    const method = args[0]; // GET, POST, DELETE
    const resource = args[1]; // products, products/1
    const params = args.slice(2); // parámetros adicionales

    return { method, resource, params };
  };

  // Función para obtener todos los productos
  const getAllProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const products = await response.json();
      console.log('Productos obtenidos:', products);
      return products;
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      throw error;
    }
  };

  // ... para obtener un producto por ID
  const getProduct = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}`);
      const product = await response.json();
      console.log('Producto obtenido:', product);
      return product;
    } catch (error) {
      console.error(`Error al obtener el producto ${productId}:`, error);
      throw error;
    }
  };

  // .... para crear un producto
  const createProduct = async (title, price, category) => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          price: Number(price),
          category,
          description: `Producto ${title} en la categoría ${category}`,
          image: 'https://via.placeholder.com/150',
        }),
      });
      const newProduct = await response.json();
      console.log('Producto creado:', newProduct);
      return newProduct;
    } catch (error) {
      console.error('Error al crear el producto:', error);
      throw error;
    }
  };

  // y para eliminar
  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      console.log(`Producto ${productId} eliminado:`, result);
      return result;
    } catch (error) {
      console.error(`Error al eliminar el producto ${productId}:`, error);
      throw error;
    }
  };

  // Función principal que maneja las diferentes operaciones
  const main = async () => {
    try {
      const { method, resource, params } = processArgs();
      
      // Manejo de diferentes métodos y recursos
      if (method === 'GET') {
        if (resource === 'products') {
          await getAllProducts();
        } else if (resource.startsWith('products/')) {
          const productId = resource.split('/')[1];
          await getProduct(productId);
        } else {
          console.error(`Recurso no reconocido: ${resource}`);
        }
      } else if (method === 'POST' && resource === 'products') {
        if (params.length < 3) {
          console.error('Uso: npm run start POST products <título> <precio> <categoría>');
          process.exit(1);
        }
        const [title, price, category] = params;
        await createProduct(title, price, category);
      } else if (method === 'DELETE') {
        if (resource.startsWith('products/')) {
          const productId = resource.split('/')[1];
          await deleteProduct(productId);
        } else {
          console.error(`Recurso no reconocido: ${resource}`);
        }
      } else {
        console.error(`Método o recurso no reconocido: ${method} ${resource}`);
      }
    } catch (error) {
      console.error('Error en la aplicación:', error);
      process.exit(1);
    }
  };
    // Ejecutar la función principal
  main();
}