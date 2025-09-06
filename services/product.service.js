// ✅ ProductService optimizado para Vercel serverless
const { faker } = require('@faker-js/faker');
const boom = require('@hapi/boom');

class ProductsService {

  constructor(){
    // ⚠️ TODO: Conectar a base de datos externa
    // this.db = await connectToDatabase();

    // ✅ Lazy initialization - solo generar cuando se necesite
    this.products = null;
  }

  // ✅ Datos generados solo cuando se solicitan (no en constructor)
  getProducts() {
    if (this.products === null) {
      this.products = [];
      this.generateSampleData();
    }
    return this.products;
  }

  generateSampleData() {
    // ✅ Reducido de 100 a 20 productos para cold start más rápido
    const limit = 20;
    for (let index = 0; index < limit; index++) {
      this.products.push({
        id: faker.string.uuid(), // ✅ Método actualizado
        name: faker.commerce.productName(),
        price: parseInt(faker.commerce.price(), 10),
        image: faker.image.url(), // ✅ Método actualizado
        isBlock: faker.datatype.boolean(),
        createdAt: new Date()
      });
    }
  }

  async create(data) {
    // ✅ TODO: Implementar INSERT en base de datos
    // const query = 'INSERT INTO products (name, price, image) VALUES ($1, $2, $3) RETURNING *';
    // const result = await this.db.query(query, [data.name, data.price, data.image]);
    // return result.rows[0];

    const newProduct = {
      id: faker.string.uuid(), // ✅ Método actualizado
      ...data,
      isBlock: false,
      createdAt: new Date()
    }
    this.getProducts().push(newProduct);
    return newProduct;
  }

  async find() {
    // ✅ TODO: Implementar SELECT en base de datos
    // const query = 'SELECT * FROM products WHERE is_block = false ORDER BY created_at DESC';
    // const result = await this.db.query(query);
    // return result.rows;

    return this.getProducts().filter(product => !product.isBlock);
  }

  async findOne(id) {
    // ✅ TODO: Implementar SELECT WHERE en base de datos
    // const query = 'SELECT * FROM products WHERE id = $1';
    // const result = await this.db.query(query, [id]);
    // if (result.rows.length === 0) {
    //   throw boom.notFound('product not found');
    // }
    // const product = result.rows[0];
    // if (product.is_block) {
    //   throw boom.conflict('product is blocked');
    // }
    // return product;

    const product = this.getProducts().find(item => item.id === id);
    if (!product) {
      throw boom.notFound('product not found');
    }
    if (product.isBlock) {
      throw boom.conflict('product is blocked');
    }
    return product;
  }

  async update(id, changes) {
    // ✅ TODO: Implementar UPDATE en base de datos
    // const query = 'UPDATE products SET name = $1, price = $2, image = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *';
    // const result = await this.db.query(query, [changes.name, changes.price, changes.image, id]);
    // if (result.rows.length === 0) {
    //   throw boom.notFound('product not found');
    // }
    // return result.rows[0];

    const products = this.getProducts();
    const index = products.findIndex(item => item.id === id);
    if (index === -1) {
      throw boom.notFound('product not found');
    }
    const product = products[index];
    products[index] = {
      ...product,
      ...changes,
      updatedAt: new Date()
    };
    return products[index];
  }

  async delete(id) {
    // ✅ TODO: Implementar DELETE en base de datos
    // const query = 'DELETE FROM products WHERE id = $1 RETURNING id';
    // const result = await this.db.query(query, [id]);
    // if (result.rows.length === 0) {
    //   throw boom.notFound('product not found');
    // }
    // return { id: result.rows[0].id };

    const products = this.getProducts();
    const index = products.findIndex(item => item.id === id);
    if (index === -1) {
      throw boom.notFound('product not found');
    }
    products.splice(index, 1);
    return { id };
  }

}

module.exports = ProductsService;
