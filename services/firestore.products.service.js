// Servicio de Firebase Firestore para productos
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase.js';
import Product from '../models/Product.js';

class FirestoreProductService {
  constructor() {
    this.collectionName = 'products';
    this.productsRef = collection(db, this.collectionName);
  }

  /**
   * Crea un nuevo producto en Firestore
   * @param {Object} productData - Datos del producto
   * @returns {Object} Resultado de la operación
   */
  async createProduct(productData) {
    try {
      console.log(`[${new Date().toISOString()}] FirestoreProductService - Creando producto en Firestore:`, productData.title);

      // Crear instancia del modelo Product para validación
      const product = new Product(
        null, // ID será asignado por Firestore
        productData.title,
        productData.price,
        productData.description,
        productData.category,
        productData.image || null,
        productData.rating || null,
        productData.stock || 0,
        productData.tags || [],
        productData.brand || null
      );

      // Validar datos
      const validation = product.validate();
      if (!validation.isValid) {
        throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
      }

      // Preparar datos para Firestore
      const firestoreData = {
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        rating: product.rating,
        stock: product.stock,
        tags: product.tags,
        brand: product.brand,
        isActive: product.isActive,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      // Agregar a Firestore
      const docRef = await addDoc(this.productsRef, firestoreData);
      
      // Obtener el documento creado con su ID
      const createdDoc = await getDoc(docRef);
      const createdProduct = {
        id: docRef.id,
        ...createdDoc.data(),
        createdAt: createdDoc.data().createdAt.toDate().toISOString(),
        updatedAt: createdDoc.data().updatedAt.toDate().toISOString()
      };

      console.log(`[${new Date().toISOString()}] FirestoreProductService - Producto creado en Firestore con ID: ${docRef.id}`);
      
      return {
        success: true,
        product: createdProduct,
        message: 'Producto creado exitosamente en Firestore'
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] FirestoreProductService - Error creando producto:`, error);
      return {
        success: false,
        error: error.message,
        product: null
      };
    }
  }

  /**
   * Obtiene un producto por ID de Firestore
   * @param {string} id - ID del documento en Firestore
   * @returns {Object} Producto encontrado o error
   */
  async getProductById(id) {
    try {
      console.log(`[${new Date().toISOString()}] FirestoreProductService - Obteniendo producto ID: ${id}`);

      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.log(`[${new Date().toISOString()}] FirestoreProductService - Producto no encontrado: ${id}`);
        return {
          success: false,
          error: 'Producto no encontrado',
          product: null
        };
      }

      const productData = {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate().toISOString(),
        updatedAt: docSnap.data().updatedAt.toDate().toISOString()
      };

      console.log(`[${new Date().toISOString()}] FirestoreProductService - Producto encontrado: ${productData.title}`);
      
      return {
        success: true,
        product: productData
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] FirestoreProductService - Error obteniendo producto:`, error);
      return {
        success: false,
        error: error.message,
        product: null
      };
    }
  }

  /**
   * Obtiene todos los productos con filtros opcionales
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Array} Lista de productos
   */
  async getAllProducts(filters = {}) {
    try {
      console.log(`[${new Date().toISOString()}] FirestoreProductService - Obteniendo productos con filtros:`, filters);

      let q = query(this.productsRef);

      // Aplicar filtros
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }

      if (filters.isActive !== undefined) {
        q = query(q, where('isActive', '==', filters.isActive));
      }

      if (filters.brand) {
        q = query(q, where('brand', '==', filters.brand));
      }

      // Ordenamiento
      if (filters.sortBy) {
        const sortDirection = filters.sortOrder === 'desc' ? 'desc' : 'asc';
        q = query(q, orderBy(filters.sortBy, sortDirection));
      } else {
        q = query(q, orderBy('createdAt', 'desc'));
      }

      // Paginación
      if (filters.limit) {
        q = query(q, limit(parseInt(filters.limit)));
      }

      if (filters.startAfter) {
        // Para paginación (requiere el último documento de la página anterior)
        q = query(q, startAfter(filters.startAfter));
      }

      const querySnapshot = await getDocs(q);
      const products = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate().toISOString(),
          updatedAt: data.updatedAt.toDate().toISOString()
        });
      });

      console.log(`[${new Date().toISOString()}] FirestoreProductService - ${products.length} productos obtenidos de Firestore`);
      
      return {
        success: true,
        products: products,
        total: products.length
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] FirestoreProductService - Error obteniendo productos:`, error);
      return {
        success: false,
        error: error.message,
        products: [],
        total: 0
      };
    }
  }

  /**
   * Actualiza un producto en Firestore
   * @param {string} id - ID del documento
   * @param {Object} updateData - Datos a actualizar
   * @returns {Object} Resultado de la actualización
   */
  async updateProduct(id, updateData) {
    try {
      console.log(`[${new Date().toISOString()}] FirestoreProductService - Actualizando producto ID: ${id}`);

      const docRef = doc(db, this.collectionName, id);
      
      // Verificar que el documento existe
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Producto no encontrado',
          product: null
        };
      }

      // Preparar datos de actualización
      const updateFields = {
        ...updateData,
        updatedAt: Timestamp.now()
      };

      // Remover campos no permitidos
      delete updateFields.id;
      delete updateFields.createdAt;

      // Actualizar en Firestore
      await updateDoc(docRef, updateFields);

      // Obtener el documento actualizado
      const updatedDoc = await getDoc(docRef);
      const updatedProduct = {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        createdAt: updatedDoc.data().createdAt.toDate().toISOString(),
        updatedAt: updatedDoc.data().updatedAt.toDate().toISOString()
      };

      console.log(`[${new Date().toISOString()}] FirestoreProductService - Producto actualizado: ${updatedProduct.title}`);
      
      return {
        success: true,
        product: updatedProduct,
        message: 'Producto actualizado exitosamente'
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] FirestoreProductService - Error actualizando producto:`, error);
      return {
        success: false,
        error: error.message,
        product: null
      };
    }
  }

  /**
   * Elimina un producto de Firestore
   * @param {string} id - ID del documento
   * @returns {Object} Resultado de la eliminación
   */
  async deleteProduct(id) {
    try {
      console.log(`[${new Date().toISOString()}] FirestoreProductService - Eliminando producto ID: ${id}`);

      const docRef = doc(db, this.collectionName, id);
      
      // Verificar que el documento existe
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Producto no encontrado'
        };
      }

      // Eliminar documento
      await deleteDoc(docRef);

      console.log(`[${new Date().toISOString()}] FirestoreProductService - Producto eliminado: ${id}`);
      
      return {
        success: true,
        message: 'Producto eliminado exitosamente'
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] FirestoreProductService - Error eliminando producto:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Busca productos por término en Firestore
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Array} Productos encontrados
   */
  async searchProducts(searchTerm) {
    try {
      console.log(`[${new Date().toISOString()}] FirestoreProductService - Buscando productos: "${searchTerm}"`);

      // Firestore no tiene búsqueda de texto completo nativa
      // Implementamos búsqueda básica por título y categoría
      const queries = [
        query(this.productsRef, where('title', '>=', searchTerm), where('title', '<=', searchTerm + '\uf8ff')),
        query(this.productsRef, where('category', '>=', searchTerm), where('category', '<=', searchTerm + '\uf8ff'))
      ];

      const results = [];
      const seenIds = new Set();

      for (const q of queries) {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          if (!seenIds.has(doc.id)) {
            seenIds.add(doc.id);
            const data = doc.data();
            results.push({
              id: doc.id,
              ...data,
              createdAt: data.createdAt.toDate().toISOString(),
              updatedAt: data.updatedAt.toDate().toISOString()
            });
          }
        });
      }

      console.log(`[${new Date().toISOString()}] FirestoreProductService - ${results.length} productos encontrados`);
      
      return {
        success: true,
        products: results,
        searchTerm: searchTerm,
        total: results.length
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] FirestoreProductService - Error buscando productos:`, error);
      return {
        success: false,
        error: error.message,
        products: [],
        total: 0
      };
    }
  }

  /**
   * Obtiene categorías únicas de productos
   * @returns {Array} Lista de categorías
   */
  async getCategories() {
    try {
      console.log(`[${new Date().toISOString()}] FirestoreProductService - Obteniendo categorías`);

      const querySnapshot = await getDocs(this.productsRef);
      const categories = new Set();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.category) {
          categories.add(data.category);
        }
      });

      const categoryList = Array.from(categories).sort();
      
      console.log(`[${new Date().toISOString()}] FirestoreProductService - ${categoryList.length} categorías encontradas`);
      
      return {
        success: true,
        categories: categoryList
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] FirestoreProductService - Error obteniendo categorías:`, error);
      return {
        success: false,
        error: error.message,
        categories: []
      };
    }
  }

  /**
   * Inicializa la colección con productos de muestra
   * @returns {Object} Resultado de la inicialización
   */
  async initializeWithSampleProducts() {
    try {
      console.log(`[${new Date().toISOString()}] FirestoreProductService - Inicializando con productos de muestra`);

      const sampleProducts = [
        {
          title: "iPhone 13 Pro",
          price: 999.99,
          description: "El iPhone 13 Pro con chip A15 Bionic, sistema de cámaras Pro y pantalla Super Retina XDR con ProMotion.",
          category: "electronics",
          image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500",
          rating: { rate: 4.5, count: 150 },
          stock: 25,
          tags: ["smartphone", "apple", "premium"],
          brand: "Apple"
        },
        {
          title: "Samsung Galaxy S22",
          price: 799.99,
          description: "Samsung Galaxy S22 con cámara de 50MP, pantalla Dynamic AMOLED 2X y procesador Snapdragon 8 Gen 1.",
          category: "electronics",
          image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
          rating: { rate: 4.3, count: 89 },
          stock: 18,
          tags: ["smartphone", "samsung", "android"],
          brand: "Samsung"
        },
        {
          title: "MacBook Air M2",
          price: 1299.99,
          description: "MacBook Air con chip M2, pantalla Liquid Retina de 13.6 pulgadas y hasta 18 horas de batería.",
          category: "electronics",
          image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500",
          rating: { rate: 4.7, count: 203 },
          stock: 12,
          tags: ["laptop", "apple", "ultrabook"],
          brand: "Apple"
        },
        {
          title: "Camiseta Polo Clásica",
          price: 29.99,
          description: "Camiseta polo de algodón 100% con corte clásico y disponible en varios colores.",
          category: "men's clothing",
          image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500",
          rating: { rate: 4.1, count: 67 },
          stock: 45,
          tags: ["polo", "casual", "algodón"],
          brand: "Classic Wear"
        },
        {
          title: "Vestido de Verano",
          price: 49.99,
          description: "Vestido ligero de verano con estampado floral, perfecto para días soleados.",
          category: "women's clothing",
          image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500",
          rating: { rate: 4.4, count: 134 },
          stock: 32,
          tags: ["vestido", "verano", "floral"],
          brand: "Summer Style"
        },
        {
          title: "Collar de Plata 925",
          price: 159.99,
          description: "Elegante collar de plata 925 con colgante de diamante sintético.",
          category: "jewelery",
          image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500",
          rating: { rate: 4.6, count: 78 },
          stock: 8,
          tags: ["collar", "plata", "elegante"],
          brand: "Silver Elegance"
        }
      ];

      const results = [];
      for (const productData of sampleProducts) {
        const result = await this.createProduct(productData);
        results.push(result);
      }

      const successCount = results.filter(r => r.success).length;
      
      console.log(`[${new Date().toISOString()}] FirestoreProductService - Inicialización completada: ${successCount}/${sampleProducts.length} productos creados`);
      
      return {
        success: true,
        message: `${successCount} productos de muestra creados exitosamente`,
        results: results
      };

    } catch (error) {
      console.error(`[${new Date().toISOString()}] FirestoreProductService - Error inicializando productos:`, error);
      return {
        success: false,
        error: error.message,
        results: []
      };
    }
  }
}

// Exportar instancia singleton
export default new FirestoreProductService();
