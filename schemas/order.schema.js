const Joi = require('joi');

const id = Joi.number().integer();
const customerId = Joi.number().integer();
const status = Joi.string().valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
const total = Joi.number().positive();

const createOrderSchema = Joi.object({
  customerId: customerId.required(),
  status: status.default('pending'),
  total: total.required()
});

const updateOrderSchema = Joi.object({
  status: status,
  total: total
});

const getOrderSchema = Joi.object({
  id: id.required(),
});

module.exports = { createOrderSchema, updateOrderSchema, getOrderSchema }