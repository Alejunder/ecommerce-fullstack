const { createNamedCrudSchemas, commonFields } = require('./../utils/schema.factory');

// Definir campos específicos de Category
const categoryFields = {
  name: commonFields.shortName, // min: 3, max: 15
  image: commonFields.image
};

// Generar esquemas CRUD automáticamente - SIN repetición
const schemas = createNamedCrudSchemas(categoryFields, 'category', 'number');

module.exports = schemas;
