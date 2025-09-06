const express = require('express');

const OrderService = require('./../services/order.service');
const validatorHandler = require('./../middlewares/validator.handler');
const { createOrderSchema, updateOrderSchema, getOrderSchema } = require('./../schemas/order.schema');
const { createCrudController } = require('./../utils/crud-controller');

const router = express.Router();
const service = new OrderService();

// Crear controladores CRUD gericos - sin repetición de try-catch
const controller = createCrudController(service, 'order');

// Rutas CRUD simplificadas usando el controlador genérico
router.get('/', controller.getAll);

router.get('/:id',
  validatorHandler(getOrderSchema, 'params'),
  controller.getOne
);

router.post('/',
  validatorHandler(createOrderSchema, 'body'),
  controller.create
);

router.patch('/:id',
  validatorHandler(getOrderSchema, 'params'),
  validatorHandler(updateOrderSchema, 'body'),
  controller.update
);

router.delete('/:id',
  validatorHandler(getOrderSchema, 'params'),
  controller.delete
);

module.exports = router;
