const express = require('express');

const ProductsService = require('./../services/product.service');
const validatorHandler = require('./../middlewares/validator.handler');
const { createProductSchema, updateProductSchema, getProductSchema } = require('./../schemas/product.schema');
const { createCrudController } = require('./../utils/crud-controller');

const router = express.Router();
const service = new ProductsService();

// Crear controladores CRUD genéricos
const controller = createCrudController(service, 'product');

// Rutas CRUD simplificadas - SIN repetición de try-catch
router.get('/', controller.getAll);

router.get('/:id',
  validatorHandler(getProductSchema, 'params'),
  controller.getOne
);

router.post('/',
  validatorHandler(createProductSchema, 'body'),
  controller.create
);

router.patch('/:id',
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  controller.update
);

router.delete('/:id',
  validatorHandler(getProductSchema, 'params'),
  controller.delete
);

module.exports = router;
