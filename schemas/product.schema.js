// ✅ Schemas optimizados para producción usando Schema Factory
const { createNamedCrudSchemas, commonFields } = require('./../utils/schema.factory');

// Definir campos específicos de Product
const productFields = {
  name: commonFields.name, // min: 3, max: 100
  price: commonFields.price, // positive, precision(2)
  image: commonFields.image
};

// Generar esquemas CRUD automáticamente - SIN repetición
// Usar 'string' porque products usan UUID
const schemas = createNamedCrudSchemas(productFields, 'product', 'string');

module.exports = schemas;
