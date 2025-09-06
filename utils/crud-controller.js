/**
 * Factory para crear controladores CRUD genéricos
 * Elimina la repetición de código en todos los routers
 */

/**
 * Wrapper para manejo automático de errores en async functions
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Factory que genera controladores CRUD estándar
 * @param {Object} service - Instancia del servicio (UserService, ProductService, etc.)
 * @param {string} entityName - Nombre de la entidad ('user', 'product', etc.)
 * @returns {Object} - Objeto con controladores CRUD
 */
function createCrudController(service, entityName = 'item') {
  return {
    // GET / - Listar todos
    getAll: asyncHandler(async (req, res) => {
      const items = await service.find();
      res.json(items);
    }),

    // GET /:id - Obtener uno
    getOne: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const item = await service.findOne(id);
      res.json(item);
    }),

    // POST / - Crear
    create: asyncHandler(async (req, res) => {
      const body = req.body;
      const newItem = await service.create(body);
      res.status(201).json({
        message: `${entityName} created successfully`,
        [entityName]: newItem
      });
    }),

    // PATCH /:id - Actualizar
    update: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const body = req.body;
      const item = await service.update(id, body);
      res.json({
        message: `${entityName} updated successfully`,
        [entityName]: item
      });
    }),

    // DELETE /:id - Eliminar
    delete: asyncHandler(async (req, res) => {
      const { id } = req.params;
      await service.delete(id);
      res.json({
        message: `${entityName} deleted successfully`,
        id: parseInt(id)
      });
    })
  };
}

module.exports = {
  createCrudController,
  asyncHandler
};
