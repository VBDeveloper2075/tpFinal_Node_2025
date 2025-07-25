// API
const API_URL = 'https://fakestoreapi.com';

const getAllProductsBtn = document.getElementById('getAllProducts');
const getOneProductBtn = document.getElementById('getOneProduct');
const getProductIdInput = document.getElementById('getProductId');
const createProductBtn = document.getElementById('createProduct');
const newTitleInput = document.getElementById('newTitle');
const newPriceInput = document.getElementById('newPrice');
const newCategoryInput = document.getElementById('newCategory');
const deleteProductBtn = document.getElementById('deleteProduct');
const deleteIdInput = document.getElementById('deleteId');
const productsContainer = document.getElementById('productsContainer');

// mostrar mensajes como notificaciones simples (opcional)
const showNotification = (message) => {
    console.log(message);
    // Opcionalmente podrías agregar notificaciones visuales aquí
};

// obtener
const getAllProducts = async () => {
    try {
        showNotification('Obteniendo productos...');
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        displayProductCards(products);
        return products;
    } catch (error) {
        showNotification(`Error al obtener productos: ${error.message}`);
    }
};

// obtener por ID
const getProduct = async (id) => {
    try {
        showNotification(`Obteniendo producto ${id}...`);
        const response = await fetch(`${API_URL}/products/${id}`);
        const product = await response.json();
        displayProductCards([product]);
        return product;
    } catch (error) {
        showNotification(`Error al obtener el producto ${id}: ${error.message}`);
    }
};

// crear producto
const createProduct = async (title, price, category) => {
    try {
        showNotification('Creando producto...');
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
        displayProductCards([newProduct]);
        return newProduct;
    } catch (error) {
        showNotification(`Error al crear el producto: ${error.message}`);
    }
};

// eliminar    
const deleteProduct = async (id) => {
    try {
        showNotification(`Eliminando producto ${id}...`);
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        showNotification(`Producto ${id} eliminado exitosamente`);
        // Recargar todos los productos para actualizar la vista
        getAllProducts();
        return result;
    } catch (error) {
        showNotification(`Error al eliminar el producto ${id}: ${error.message}`);
    }
};

// crear y mostrar  
const displayProductCards = (products) => {
    // reiniciar.
    productsContainer.innerHTML = '';
    
    // se crea una tarjeta por cada producto
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <div class="product-title">${product.title}</div>
                <div class="product-price">$${product.price}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-description">${product.description || ''}</div>
            </div>
        `;
        productsContainer.appendChild(card);
    });
};

// Event listeners
getAllProductsBtn.addEventListener('click', getAllProducts);
getOneProductBtn.addEventListener('click', () => {
    const id = getProductIdInput.value;
    if (id) getProduct(id);
});

createProductBtn.addEventListener('click', () => {
    const title = newTitleInput.value;
    const price = newPriceInput.value;
    const category = newCategoryInput.value;
    
    if (title && price && category) {
        createProduct(title, price, category);
        // Limpiar los campos después de crear
        newTitleInput.value = '';
        newPriceInput.value = '';
        newCategoryInput.value = '';
    } else {
        showNotification('Por favor, completa todos los campos para crear un producto.');
    }
});

deleteProductBtn.addEventListener('click', () => {
    const id = deleteIdInput.value;
    if (id) {
        deleteProduct(id);
        // Limpiar el campo después de eliminar
        deleteIdInput.value = '';
    }
});

// Cargar todos los productos al inicio
window.addEventListener('DOMContentLoaded', getAllProducts);
