// Base de datos local de productos
export const productsData = [
  {
    id: 1,
    title: "Laptop Gaming Pro 15.6\"",
    price: 1299.99,
    description: "Laptop gaming de alto rendimiento con procesador Intel i7, 16GB RAM, SSD 512GB y tarjeta gráfica RTX 4060. Perfecta para gaming y trabajo profesional.",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop",
    rating: {
      rate: 4.7,
      count: 284
    },
    stock: 15,
    tags: ["gaming", "laptop", "high-performance", "intel"],
    brand: "TechPro"
  },
  {
    id: 2,
    title: "Smartphone Galaxy X Pro 256GB",
    price: 899.99,
    description: "Smartphone de última generación con pantalla AMOLED 6.7\", cámara triple 108MP, 5G y batería de larga duración. Incluye cargador inalámbrico.",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop",
    rating: {
      rate: 4.5,
      count: 567
    },
    stock: 32,
    tags: ["smartphone", "5g", "android", "camera"],
    brand: "GalaxyTech"
  },
  {
    id: 3,
    title: "Auriculares Bluetooth Premium",
    price: 249.99,
    description: "Auriculares inalámbricos con cancelación de ruido activa, sonido hi-fi y hasta 30 horas de batería. Perfectos para música y llamadas.",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    rating: {
      rate: 4.3,
      count: 192
    },
    stock: 78,
    tags: ["headphones", "bluetooth", "noise-cancelling", "wireless"],
    brand: "AudioMax"
  },
  {
    id: 4,
    title: "Camiseta Casual Premium - Algodón 100%",
    price: 29.99,
    description: "Camiseta de algodón 100% orgánico, corte moderno y cómodo. Disponible en varios colores. Ideal para uso diario y ocasiones casuales.",
    category: "clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    rating: {
      rate: 4.2,
      count: 341
    },
    stock: 156,
    tags: ["casual", "cotton", "comfortable", "daily-wear"],
    brand: "UrbanStyle"
  },
  {
    id: 5,
    title: "Zapatillas Deportivas Running Pro",
    price: 129.99,
    description: "Zapatillas para running con tecnología de amortiguación avanzada, transpirables y ligeras. Ideales para corredores de todos los niveles.",
    category: "footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    rating: {
      rate: 4.6,
      count: 428
    },
    stock: 89,
    tags: ["running", "sports", "lightweight", "breathable"],
    brand: "SportMax"
  },
  {
    id: 6,
    title: "Mochila Urbana Antirrobo",
    price: 79.99,
    description: "Mochila con múltiples compartimentos, puerto USB, material resistente al agua y sistema antirrobo. Perfecta para viajes y trabajo.",
    category: "accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    rating: {
      rate: 4.4,
      count: 234
    },
    stock: 67,
    tags: ["backpack", "anti-theft", "waterproof", "travel"],
    brand: "UrbanGear"
  },
  {
    id: 7,
    title: "Cafetera Espresso Automática",
    price: 599.99,
    description: "Cafetera espresso automática con molinillo integrado, múltiples configuraciones y sistema de espuma de leche. Para los amantes del café perfecto.",
    category: "home-appliances",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop",
    rating: {
      rate: 4.8,
      count: 156
    },
    stock: 23,
    tags: ["coffee", "espresso", "automatic", "premium"],
    brand: "CoffeeMaster"
  },
  {
    id: 8,
    title: "Monitor 4K UltraWide 34\"",
    price: 749.99,
    description: "Monitor curvo UltraWide 4K de 34 pulgadas, ideal para gaming, diseño y productividad. Conexión USB-C y múltiples puertos.",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop",
    rating: {
      rate: 4.5,
      count: 198
    },
    stock: 34,
    tags: ["monitor", "4k", "ultrawide", "gaming"],
    brand: "DisplayPro"
  },
  {
    id: 9,
    title: "Libro: 'Desarrollo Web Moderno'",
    price: 45.99,
    description: "Guía completa sobre desarrollo web moderno con JavaScript, React, Node.js y mejores prácticas. Incluye proyectos prácticos y código de ejemplo.",
    category: "books",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop",
    rating: {
      rate: 4.9,
      count: 2341
    },
    stock: 145,
    tags: ["programming", "web-development", "javascript", "react"],
    brand: "TechBooks"
  },
  {
    id: 10,
    title: "Mesa de Escritorio Ergonómica",
    price: 299.99,
    description: "Mesa de escritorio con altura ajustable, superficie amplia y sistema de gestión de cables. Ideal para oficina en casa y trabajo remoto.",
    category: "furniture",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
    rating: {
      rate: 4.3,
      count: 87
    },
    stock: 28,
    tags: ["desk", "ergonomic", "adjustable", "office"],
    brand: "WorkSpace"
  },
  {
    id: 11,
    title: "Reloj Inteligente Fitness Pro",
    price: 199.99,
    description: "Reloj inteligente con monitor de salud 24/7, GPS, resistente al agua y más de 100 modos deportivos. Batería de hasta 14 días.",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    rating: {
      rate: 4.4,
      count: 524
    },
    stock: 92,
    tags: ["smartwatch", "fitness", "gps", "health"],
    brand: "FitTech"
  },
  {
    id: 12,
    title: "Planta Monstera Deliciosa",
    price: 34.99,
    description: "Planta de interior Monstera Deliciosa de tamaño mediano, perfecta para decorar espacios y purificar el aire. Incluye maceta decorativa.",
    category: "home-garden",
    image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=500&h=500&fit=crop",
    rating: {
      rate: 4.7,
      count: 267
    },
    stock: 73,
    tags: ["plant", "indoor", "decoration", "air-purifying"],
    brand: "GreenLife"
  },
  {
    id: 13,
    title: "Kit de Herramientas Completo 150 Piezas",
    price: 89.99,
    description: "Kit profesional de herramientas con 150 piezas, incluye destornilladores, llaves, alicates y estuche organizador. Para bricolaje y reparaciones.",
    category: "tools",
    image: "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=500&h=500&fit=crop",
    rating: {
      rate: 4.5,
      count: 189
    },
    stock: 45,
    tags: ["tools", "diy", "repair", "professional"],
    brand: "ToolMaster"
  },
  {
    id: 14,
    title: "Termo Inteligente 500ml",
    price: 59.99,
    description: "Termo con control de temperatura inteligente, mantiene bebidas calientes o frías por hasta 12 horas. Conectividad Bluetooth y app móvil.",
    category: "accessories",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop",
    rating: {
      rate: 4.2,
      count: 156
    },
    stock: 112,
    tags: ["thermos", "smart", "temperature-control", "bluetooth"],
    brand: "SmartDrink"
  },
  {
    id: 15,
    title: "Cuaderno Inteligente Reutilizable",
    price: 24.99,
    description: "Cuaderno reutilizable con páginas borrables, compatible con apps de notas digitales. Incluye bolígrafo especial y paño de limpieza.",
    category: "stationery",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&h=500&fit=crop",
    rating: {
      rate: 4.6,
      count: 432
    },
    stock: 187,
    tags: ["notebook", "reusable", "digital", "eco-friendly"],
    brand: "SmartNote"
  },
  {
    id: 16,
    title: "Altavoz Bluetooth Portátil Resistente",
    price: 79.99,
    description: "Altavoz Bluetooth con sonido 360°, resistente al agua IPX7, batería de 24 horas y función de powerbank. Perfecto para exteriores.",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
    rating: {
      rate: 4.4,
      count: 298
    },
    stock: 65,
    tags: ["speaker", "bluetooth", "waterproof", "portable"],
    brand: "SoundMax"
  },
  {
    id: 17,
    title: "Cámara Instant Film Vintage",
    price: 119.99,
    description: "Cámara instantánea con diseño vintage, diferentes modos de disparo y efectos creativos. Incluye pack de 20 películas instantáneas.",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop",
    rating: {
      rate: 4.3,
      count: 167
    },
    stock: 42,
    tags: ["camera", "instant", "vintage", "photography"],
    brand: "InstantPic"
  },
  {
    id: 18,
    title: "Set de Yoga Premium con Esterilla",
    price: 69.99,
    description: "Set completo de yoga con esterilla antideslizante, bloques, correa y bolsa de transporte. Materiales ecológicos y duraderos.",
    category: "sports",
    image: "https://images.unsplash.com/photo-1506629905607-45dc47938a4b?w=500&h=500&fit=crop",
    rating: {
      rate: 4.7,
      count: 234
    },
    stock: 98,
    tags: ["yoga", "fitness", "eco-friendly", "meditation"],
    brand: "ZenFit"
  },
  {
    id: 19,
    title: "Lámpara LED de Escritorio Inteligente",
    price: 89.99,
    description: "Lámpara LED con control inteligente, múltiples temperaturas de color, dimmer y control por app. Reduce la fatiga visual durante el trabajo.",
    category: "home-appliances",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop",
    rating: {
      rate: 4.5,
      count: 178
    },
    stock: 56,
    tags: ["lamp", "led", "smart", "eye-care"],
    brand: "LightSmart"
  },
  {
    id: 20,
    title: "Batidora de Proteínas Portátil USB",
    price: 39.99,
    description: "Batidora portátil recargable por USB, perfecta para batidos de proteínas y smoothies. Compacta, silenciosa y fácil de limpiar.",
    category: "home-appliances",
    image: "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=500&h=500&fit=crop",
    rating: {
      rate: 4.2,
      count: 145
    },
    stock: 134,
    tags: ["blender", "portable", "usb", "protein"],
    brand: "FitBlend"
  }
];

// Categorías disponibles
export const categories = [
  'electronics',
  'clothing',
  'footwear',
  'accessories',
  'home-appliances',
  'books',
  'furniture',
  'home-garden',
  'tools',
  'stationery',
  'sports'
];

// Marcas disponibles
export const brands = [
  'TechPro',
  'GalaxyTech',
  'AudioMax',
  'UrbanStyle',
  'SportMax',
  'UrbanGear',
  'CoffeeMaster',
  'DisplayPro',
  'TechBooks',
  'WorkSpace',
  'FitTech',
  'GreenLife',
  'ToolMaster',
  'SmartDrink',
  'SmartNote',
  'SoundMax',
  'InstantPic',
  'ZenFit',
  'LightSmart',
  'FitBlend'
];
