// Script para inicializar Firebase y crear productos de muestra
import FirestoreProductService from '../services/firestore.products.service.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function initializeFirebase() {
  console.log('🔥 Inicializando Firebase Firestore...\n');
  
  try {
    // Verificar configuración
    console.log('📋 Verificando configuración de Firebase:');
    console.log(`- Project ID: ${process.env.FIREBASE_PROJECT_ID || 'No configurado'}`);
    console.log(`- Auth Domain: ${process.env.FIREBASE_AUTH_DOMAIN || 'No configurado'}`);
    console.log(`- Entorno: ${process.env.NODE_ENV || 'development'}\n`);

    // Crear productos de muestra
    console.log('📦 Creando productos de muestra en Firestore...');
    const result = await FirestoreProductService.initializeWithSampleProducts();
    
    if (result.success) {
      console.log('✅ Productos de muestra creados exitosamente!');
      console.log(`📊 Resultados: ${result.message}\n`);
      
      // Mostrar productos creados
      console.log('🛍️ Productos creados:');
      result.results.forEach((productResult, index) => {
        if (productResult.success) {
          console.log(`  ${index + 1}. ${productResult.product.title} - $${productResult.product.price}`);
        } else {
          console.log(`  ${index + 1}. Error: ${productResult.error}`);
        }
      });
      
    } else {
      console.error('❌ Error inicializando productos:', result.error);
    }

    // Verificar que los productos se crearon correctamente
    console.log('\n🔍 Verificando productos en Firestore...');
    const allProducts = await FirestoreProductService.getAllProducts();
    
    if (allProducts.success) {
      console.log(`✅ Total de productos en Firestore: ${allProducts.total}`);
      
      // Mostrar categorías
      const categories = await FirestoreProductService.getCategories();
      if (categories.success) {
        console.log(`📂 Categorías disponibles: ${categories.categories.join(', ')}`);
      }
    } else {
      console.error('❌ Error verificando productos:', allProducts.error);
    }

  } catch (error) {
    console.error('❌ Error durante la inicialización:', error.message);
  }
}

// Ejecutar inicialización
initializeFirebase()
  .then(() => {
    console.log('\n🎉 Inicialización de Firebase completada!');
    console.log('🚀 Puedes ahora usar las rutas de Firestore:');
    console.log('   GET    /api/firestore/products');
    console.log('   GET    /api/firestore/products/:id');
    console.log('   POST   /api/firestore/products');
    console.log('   PUT    /api/firestore/products/:id');
    console.log('   DELETE /api/firestore/products/:id');
    console.log('   GET    /api/firestore/categories');
    console.log('   GET    /api/firestore/search/:term');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal durante la inicialización:', error);
    process.exit(1);
  });
