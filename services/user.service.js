const boom = require('@hapi/boom');

class UserService {
  
  constructor() {
    // TODO: Inyectar conexión PostgreSQL aquí
    // this.db = db;
  }

  async create(data) {
    // TODO: Implementar INSERT en PostgreSQL
    // const query = 'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at';
    // const hashedPassword = await bcrypt.hash(data.password, 10); // TODO: Implementar bcrypt
    // const result = await this.db.query(query, [data.email, hashedPassword, data.role]);
    // return result.rows[0];
    
    // Validación de entrada
    if (!data.email || !data.password || !data.role) {
      throw boom.badRequest('Missing required fields: email, password, role');
    }

    // Simulación temporal hasta PostgreSQL
    const newUser = {
      id: Math.floor(Math.random() * 1000),
      email: data.email,
      role: data.role,
      // No devolvemos password por seguridad
      createdAt: new Date()
    };
    return newUser;
  }

  async find() {
    // TODO: Implementar SELECT en PostgreSQL
    // const query = 'SELECT id, email, role, created_at FROM users ORDER BY id';
    // const result = await this.db.query(query);
    // return result.rows;
    
    // Simulación temporal hasta PostgreSQL
    return [
      { id: 1, email: 'admin@example.com', role: 'admin', createdAt: new Date() },
      { id: 2, email: 'customer@example.com', role: 'customer', createdAt: new Date() }
    ];
  }

  async findOne(id) {
    // TODO: Implementar SELECT WHERE en PostgreSQL
    // const query = 'SELECT id, email, role, created_at FROM users WHERE id = $1';
    // const result = await this.db.query(query, [id]);
    // if (result.rows.length === 0) {
    //   throw boom.notFound('user not found');
    // }
    // return result.rows[0];
    
    // Validación de entrada
    if (!id || isNaN(id)) {
      throw boom.badRequest('Invalid user ID');
    }
    
    // Simulación temporal hasta PostgreSQL
    const user = { 
      id: parseInt(id), 
      email: 'user@example.com', 
      role: 'customer',
      createdAt: new Date()
    };
    return user;
  }

  async update(id, changes) {
    // TODO: Implementar UPDATE en PostgreSQL
    // const setClause = [];
    // const values = [];
    // let paramCount = 1;
    // 
    // if (changes.email) {
    //   setClause.push(`email = $${paramCount++}`);
    //   values.push(changes.email);
    // }
    // if (changes.role) {
    //   setClause.push(`role = $${paramCount++}`);
    //   values.push(changes.role);
    // }
    // 
    // if (setClause.length === 0) {
    //   throw boom.badRequest('No valid fields to update');
    // }
    // 
    // values.push(id);
    // const query = `UPDATE users SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING id, email, role, updated_at`;
    // const result = await this.db.query(query, values);
    // 
    // if (result.rows.length === 0) {
    //   throw boom.notFound('user not found');
    // }
    // return result.rows[0];
    
    // Validación de entrada
    if (!id || isNaN(id)) {
      throw boom.badRequest('Invalid user ID');
    }
    
    // Simulación temporal hasta PostgreSQL
    const updatedUser = {
      id: parseInt(id),
      ...changes,
      updatedAt: new Date()
    };
    return updatedUser;
  }

  async delete(id) {
    // TODO: Implementar DELETE en PostgreSQL
    // const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    // const result = await this.db.query(query, [id]);
    // if (result.rows.length === 0) {
    //   throw boom.notFound('user not found');
    // }
    // return { id: result.rows[0].id };
    
    // Validación de entrada
    if (!id || isNaN(id)) {
      throw boom.badRequest('Invalid user ID');
    }
    
    // Simulación temporal hasta PostgreSQL
    return { id: parseInt(id) };
  }
}

module.exports = UserService;
