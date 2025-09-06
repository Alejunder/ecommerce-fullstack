const express = require('express');

const CategoryService = require('./../services/category.service');
const validatorHandler = require('./../middlewares/validator.handler');
const { createCategorySchema, updateCategorySchema, getCategorySchema } = require('./../schemas/category.schema');
const { createCrudController } = require('./../utils/crud-controller');

const router = express.Router();
const service = new CategoryService();

// Crear controladores CRUD genéricos - SIN repetición de try-catch
const controller = createCrudController(service, 'category');

// Rutas CRUD simplificadas usando el controlador genérico
router.get('/', controller.getAll);

router.get('/:id',
  validatorHandler(getCategorySchema, 'params'),
  controller.getOne
);

router.post('/',
  validatorHandler(createCategorySchema, 'body'),
  controller.create
);

router.patch('/:id',
  validatorHandler(getCategorySchema, 'params'),
  validatorHandler(updateCategorySchema, 'body'),
  controller.update
);

router.delete('/:id',
  validatorHandler(getCategorySchema, 'params'),
  controller.delete
);

module.exports = router;
