// FakeStore API
import express from 'express';
import cors from 'cors';
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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta public
app.use(express.static(join(__dirname, 'public')));

// Ruta principal - servir index.html
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
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