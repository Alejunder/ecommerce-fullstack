/**
 * Schema Factory para eliminar código repetitivo en validaciones Joi
 * Genera automáticamente esquemas CRUD estándar
 */
const Joi = require('joi');

/**
 * Tipos de ID comunes reutilizables
 */
const commonIds = {
  // Para IDs numéricos (PostgreSQL auto-increment)
  numberId: Joi.number().integer().positive(),

  // Para UUIDs o strings flexibles
  stringId: Joi.string().min(1).max(255),

  // Para IDs que pueden ser número o string
  flexibleId: Joi.alternatives().try(
    Joi.number().integer().positive(),
    Joi.string().min(1).max(255)
  )
};

/**
 * Campos comunes reutilizables
 */
const commonFields = {
  name: Joi.string().min(3).max(100),
  shortName: Joi.string().min(3).max(15),
  email: Joi.string().email(),
  password: Joi.string().min(8),
  image: Joi.string().uri(),
  price: Joi.number().positive().precision(2),
  role: Joi.string().valid('admin', 'customer', 'seller'),
  status: Joi.string()
};

/**
 * Factory principal para crear esquemas CRUD estándar
 * @param {Object} fields - Definición de campos del esquema
 * @param {string} idType - Tipo de ID ('number', 'string', 'flexible')
 * @returns {Object} - Esquemas create, update, get
 */
function createCrudSchemas(fields, idType = 'number') {
  // Seleccionar tipo de ID
  const idSchema = commonIds[`${idType}Id`] || commonIds.numberId;

  // Separar campos requeridos y opcionales
  const requiredFields = {};
  const optionalFields = {};

  Object.entries(fields).forEach(([key, schema]) => {
    if (schema._flags && schema._flags.presence === 'required') {
      requiredFields[key] = schema;
      optionalFields[key] = schema.optional();
    } else {
      requiredFields[key] = schema.required();
      optionalFields[key] = schema;
    }
  });

  return {
    // Esquema para crear - todos los campos requeridos
    create: Joi.object(requiredFields),

    // Esquema para actualizar - todos los campos opcionales
    update: Joi.object(optionalFields),

    // Esquema para obtener por ID
    get: Joi.object({
      id: idSchema.required()
    })
  };
}

/**
 * Helper para crear esquemas con nombres personalizados
 * @param {Object} fields - Campos del esquema
 * @param {string} entityName - Nombre de la entidad (ej: 'Category')
 * @param {string} idType - Tipo de ID
 * @returns {Object} - Esquemas con nombres: createEntitySchema, updateEntitySchema, getEntitySchema
 */
function createNamedCrudSchemas(fields, entityName, idType = 'number') {
  const schemas = createCrudSchemas(fields, idType);
  const capitalizedName = entityName.charAt(0).toUpperCase() + entityName.slice(1);

  return {
    [`create${capitalizedName}Schema`]: schemas.create,
    [`update${capitalizedName}Schema`]: schemas.update,
    [`get${capitalizedName}Schema`]: schemas.get
  };
}

/**
 * Validadores especiales para casos específicos
 */
const specialValidators = {
  // Estados de pedidos
  orderStatus: Joi.string().valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),

  // Validador de array de items
  arrayOfIds: Joi.array().items(Joi.number().integer().positive()),

  // Validador de fecha
  dateString: Joi.date().iso(),

  // Validador de teléfono
  phone: Joi.string().pattern(/^[+]?[1-9][\d\s\-()]{7,}$/),

  // Validador de código postal
  zipCode: Joi.string().pattern(/^[\d\-\s]{3,}$/)
};

module.exports = {
  createCrudSchemas,
  createNamedCrudSchemas,
  commonIds,
  commonFields,
  specialValidators
};
