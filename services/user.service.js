// ✅ UserService optimizado para Vercel serverless
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ✅ Cache global para datos de usuarios (mejor que en constructor)
let usersCache = null;

class UserService {

  constructor() {
    // ✅ TODO: Conectar a base de datos externa
    // this.db = await connectToDatabase();
  }

  // ✅ Lazy initialization de usuarios
  getUsers() {
    if (usersCache === null) {
      usersCache = this.initializeUsers();
    }
    return usersCache;
  }

  initializeUsers() {
    return [
      {
        id: 1,
        email: 'admin@example.com',
        password: '$2b$10$8K1p/a0dCVRH5UMCgKqF9e7pD.O6HZeOBM.8zH2Y7eMK6LvNyDUym', // admin123
        role: 'admin',
        createdAt: new Date()
      },
      {
        id: 2,
        email: 'customer@example.com',
        password: '$2b$10$8K1p/a0dCVRH5UMCgKqF9e7pD.O6HZeOBM.8zH2Y7eMK6LvNyDUym', // customer123
        role: 'customer',
        createdAt: new Date()
      }
    ];
  }

  async create(data) {
    // TODO: Implementar INSERT en PostgreSQL
    // const query = 'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at';
    // const hashedPassword = await bcrypt.hash(data.password, 10);
    // const result = await this.db.query(query, [data.email, hashedPassword, data.role]);
    // return result.rows[0];

    // Validación de entrada
    if (!data.email || !data.password || !data.role) {
      throw boom.badRequest('Missing required fields: email, password, role');
    }

    // Verificar si el email ya existe
    const existingUser = this.getUsers().find(user => user.email === data.email);
    if (existingUser) {
      throw boom.conflict('Email already exists');
    }

    // Hashear password antes de guardar
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // ✅ Simulación temporal hasta base de datos
    const newUser = {
      id: Math.floor(Math.random() * 1000) + 100,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      createdAt: new Date()
    };

    // Agregar al cache
    this.getUsers().push(newUser);

    // Retornar sin password por seguridad
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async find() {
    // ✅ TODO: Implementar SELECT en base de datos
    // const query = 'SELECT id, email, role, created_at FROM users ORDER BY id';
    // const result = await this.db.query(query);
    // return result.rows;

    // Retornar sin passwords por seguridad
    return this.getUsers().map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
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

  // ============ MÉTODOS DE AUTENTICACIÓN ============

  async findByEmail(email) {
    // ✅ TODO: Implementar SELECT WHERE email en base de datos
    // const query = 'SELECT id, email, password, role, created_at FROM users WHERE email = $1';
    // const result = await this.db.query(query, [email]);
    // if (result.rows.length === 0) {
    //   throw boom.notFound('User not found');
    // }
    // return result.rows[0];

    const user = this.getUsers().find(user => user.email === email);
    if (!user) {
      throw boom.notFound('User not found');
    }
    return user;
  }

  async login(email, password) {
    try {
      // Buscar usuario por email
      const user = await this.findByEmail(email);

      // Verificar password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw boom.unauthorized('Invalid credentials');
      }

      // Generar JWT token
      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      });

      // Retornar token y datos del usuario (sin password)
      const { password: _, ...userWithoutPassword } = user;
      return {
        token,
        user: userWithoutPassword
      };

    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      throw boom.unauthorized('Login failed');
    }
  }

  // ELIMINADO: async verifyToken() - Esta responsabilidad es del middleware
  // El middleware auth.handler.js se encarga de verificar tokens
  // Los servicios solo deben manejar lógica de negocio
}

module.exports = UserService;
