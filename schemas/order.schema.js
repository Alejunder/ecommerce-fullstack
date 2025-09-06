const Joi = require('joi');
const { createNamedCrudSchemas, commonFields, specialValidators } = require('./../utils/schema.factory');

// Definir campos específicos de Order
const orderFields = {
  customerId: Joi.number().integer().positive(),
  status: specialValidators.orderStatus.default('pending'),
  total: commonFields.price // Reutilizar validador de precio
};

// Generar esquemas CRUD automáticamente - SIN repetición
const schemas = createNamedCrudSchemas(orderFields, 'order', 'number');

module.exports = schemas;