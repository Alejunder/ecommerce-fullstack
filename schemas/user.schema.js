const Joi = require('joi');
const { createNamedCrudSchemas, commonFields } = require('./../utils/schema.factory');

// ============ ESQUEMAS CRUD ESTÁNDAR ============

// Definir campos para CRUD básico de usuarios
const userCrudFields = {
  email: commonFields.email,
  role: commonFields.role
};

// Generar esquemas CRUD automáticamente - SIN repetición
const crudSchemas = createNamedCrudSchemas(userCrudFields, 'user', 'number');

// ============ ESQUEMAS ESPECÍFICOS DE AUTENTICACIÓN ============

// Esquemas para autenticación (requieren lógica especial)
const loginSchema = Joi.object({
  email: commonFields.email.required(),
  password: Joi.string().required() // No validamos longitud en login
});

const registerSchema = Joi.object({
  email: commonFields.email.required(),
  password: commonFields.password.required(),
  role: commonFields.role.required()
});

// Esquema para creación con password (usado por admin)
const createUserSchema = Joi.object({
  email: commonFields.email.required(),
  password: commonFields.password.required(),
  role: commonFields.role.required()
});

module.exports = {
  // CRUD estándar generado automáticamente
  ...crudSchemas,
  // Esquemas específicos de autenticación
  loginSchema,
  registerSchema,
  // Override del createUserSchema para incluir password
  createUserSchema
};
