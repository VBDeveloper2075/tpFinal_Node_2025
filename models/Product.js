// Modelo de datos para productos
class Product {
  constructor(id, title, price, description, category, image, rating = null, stock = 0, tags = [], brand = null) {
    this.id = id;
    this.title = title;
    this.price = parseFloat(price);
    this.description = description;
    this.category = category;
    this.image = image;
    this.rating = rating || {
      rate: Math.random() * 5,
      count: Math.floor(Math.random() * 1000) + 1
    };
    this.stock = stock;
    this.tags = tags;
    this.brand = brand;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.isActive = true;
  }

  // Método para actualizar el producto
  update(updateData) {
    const allowedFields = ['title', 'price', 'description', 'category', 'image', 'stock', 'tags', 'brand', 'isActive'];
    
    for (const field of allowedFields) {
      if (updateData.hasOwnProperty(field)) {
        if (field === 'price') {
          this[field] = parseFloat(updateData[field]);
        } else {
          this[field] = updateData[field];
        }
      }
    }
    
    this.updatedAt = new Date().toISOString();
  }

  // Método para obtener una versión pública del producto (sin datos internos)
  toPublic() {
    return {
      id: this.id,
      title: this.title,
      price: this.price,
      description: this.description,
      category: this.category,
      image: this.image,
      rating: this.rating,
      stock: this.stock,
      tags: this.tags,
      brand: this.brand,
      isActive: this.isActive
    };
  }

  // Método para validar los datos del producto
  validate() {
    const errors = [];

    if (!this.title || this.title.trim().length === 0) {
      errors.push('El título es requerido');
    }

    if (!this.price || this.price <= 0) {
      errors.push('El precio debe ser mayor a 0');
    }

    if (!this.category || this.category.trim().length === 0) {
      errors.push('La categoría es requerida');
    }

    if (this.stock < 0) {
      errors.push('El stock no puede ser negativo');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Método para decrementar stock
  decrementStock(quantity = 1) {
    if (this.stock >= quantity) {
      this.stock -= quantity;
      this.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  // Método para incrementar stock
  incrementStock(quantity = 1) {
    this.stock += quantity;
    this.updatedAt = new Date().toISOString();
  }

  // Método estático para crear un producto desde datos planos
  static fromData(data) {
    return new Product(
      data.id,
      data.title,
      data.price,
      data.description,
      data.category,
      data.image,
      data.rating,
      data.stock || 0,
      data.tags || [],
      data.brand
    );
  }
}

export default Product;
