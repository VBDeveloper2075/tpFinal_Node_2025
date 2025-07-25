// Endpoint de prueba para verificar conexión con Firebase
import express from 'express';
import { db } from '../config/firebase.js';
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';

const router = express.Router();

/**
 * @route GET /api/firebase/test
 * @desc Prueba la conexión con Firebase
 * @access Público
 */
router.get('/test', async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] Probando conexión con Firebase...`);
    
    // Intentar escribir un documento de prueba
    const testDoc = {
      message: 'Conexión exitosa con Firebase',
      timestamp: Timestamp.now(),
      testData: {
        server: 'Node.js Express',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      }
    };

    const docRef = await addDoc(collection(db, 'test'), testDoc);
    console.log(`[${new Date().toISOString()}] Documento de prueba creado con ID: ${docRef.id}`);

    // Leer documentos de prueba
    const querySnapshot = await getDocs(collection(db, 'test'));
    const testDocs = [];
    querySnapshot.forEach((doc) => {
      testDocs.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate().toISOString()
      });
    });

    res.status(200).json({
      success: true,
      message: 'Firebase conectado exitosamente',
      connectionTest: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        testDocumentId: docRef.id,
        totalTestDocs: testDocs.length
      },
      testDocuments: testDocs
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error conectando con Firebase:`, error);
    res.status(500).json({
      success: false,
      message: 'Error conectando con Firebase',
      error: error.message,
      config: {
        projectId: process.env.FIREBASE_PROJECT_ID || 'No configurado',
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'No configurado',
        hasApiKey: !!process.env.FIREBASE_API_KEY
      }
    });
  }
});

export default router;
