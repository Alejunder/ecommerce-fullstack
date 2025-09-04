const boom = require('@hapi/boom');

class CategoryService {

  constructor(){
    // TODO: Inyectar conexión PostgreSQL aquí
    // this.db = db;
  }

  async create(data) {
    // TODO: Implementar INSERT en PostgreSQL
    // const query = 'INSERT INTO categories (name, image) VALUES ($1, $2) RETURNING *';
    // const result = await this.db.query(query, [data.name, data.image]);
    // return result.rows[0];

    // Simulación temporal hasta PostgreSQL
    const newCategory = {
      id: Math.floor(Math.random() * 1000),
      ...data,
      createdAt: new Date()
    };
    return newCategory;
  }

  async find() {
    // TODO: Implementar SELECT en PostgreSQL
    // const query = 'SELECT * FROM categories ORDER BY id';
    // const result = await this.db.query(query);
    // return result.rows;

    // Simulación temporal hasta PostgreSQL
    return [
      { id: 1, name: 'Electronics', image: 'https://example.com/electronics.jpg' },
      { id: 2, name: 'Clothing', image: 'https://example.com/clothing.jpg' }
    ];
  }

  async findOne(id) {
    // TODO: Implementar SELECT WHERE en PostgreSQL
    // const query = 'SELECT * FROM categories WHERE id = $1';
    // const result = await this.db.query(query, [id]);
    // if (result.rows.length === 0) {
    //   throw boom.notFound('category not found');
    // }
    // return result.rows[0];

    // Validación de entrada
    if (!id || isNaN(id)) {
      throw boom.badRequest('Invalid category ID');
    }

    // Simulación temporal hasta PostgreSQL
    const category = { id: parseInt(id), name: 'Sample Category', image: 'https://example.com/sample.jpg' };
    return category;
  }

  async update(id, changes) {
    // TODO: Implementar UPDATE en PostgreSQL
    // const query = 'UPDATE categories SET name = $1, image = $2 WHERE id = $3 RETURNING *';
    // const result = await this.db.query(query, [changes.name, changes.image, id]);
    // if (result.rows.length === 0) {
    //   throw boom.notFound('category not found');
    // }
    // return result.rows[0];

    // Validación de entrada
    if (!id || isNaN(id)) {
      throw boom.badRequest('Invalid category ID');
    }

    // Simulación temporal hasta PostgreSQL
    const updatedCategory = {
      id: parseInt(id),
      ...changes,
      updatedAt: new Date()
    };
    return updatedCategory;
  }

  async delete(id) {
    // TODO: Implementar DELETE en PostgreSQL
    // const query = 'DELETE FROM categories WHERE id = $1 RETURNING id';
    // const result = await this.db.query(query, [id]);
    // if (result.rows.length === 0) {
    //   throw boom.notFound('category not found');
    // }
    // return { id: result.rows[0].id };

    // Validación de entrada
    if (!id || isNaN(id)) {
      throw boom.badRequest('Invalid category ID');
    }

    // Simulación temporal hasta PostgreSQL
    return { id: parseInt(id) };
  }

}

module.exports = CategoryService;
