const express = require('express');

const UserService = require('./../services/user.service');
const validatorHandler = require('./../middlewares/validator.handler');
const { verifyToken, checkRole, checkOwnership } = require('./../middlewares/auth.handler');
const {
  updateUserSchema,
  createUserSchema,
  getUserSchema,
  loginSchema,
  registerSchema
} = require('./../schemas/user.schema');
const { createCrudController } = require('./../utils/crud-controller');

const router = express.Router();
const service = new UserService();

// Crear controladores CRUD genéricos
const controller = createCrudController(service, 'user');

// ============ RUTAS CRUD CON AUTORIZACIÓN ============

router.get('/',
  verifyToken,
  checkRole(['admin']), // Solo administradores pueden ver todos los usuarios
  controller.getAll
);

router.get('/:id',
  validatorHandler(getUserSchema, 'params'),
  verifyToken,
  checkOwnership, // Los usuarios solo pueden ver sus propios datos
  controller.getOne
);

router.post('/',
  validatorHandler(createUserSchema, 'body'),
  verifyToken,
  checkRole(['admin']), // Solo administradores pueden crear usuarios directamente
  controller.create
);

router.patch('/:id',
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  verifyToken,
  checkOwnership, // Los usuarios solo pueden actualizar sus propios datos
  controller.update
);

router.delete('/:id',
  validatorHandler(getUserSchema, 'params'),
  verifyToken,
  checkOwnership,
  controller.delete
);

// ============ RUTAS DE AUTENTICACIÓN ============

/**
 * POST /api/v1/users/register - Registrar nuevo usuario
 * Body: { email, password, role }
 */
router.post('/register',
  validatorHandler(registerSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newUser = await service.create(body);
      res.status(201).json({
        message: 'User registered successfully',
        user: newUser
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/v1/users/login - Iniciar sesión
 * Body: { email, password }
 * Response: { token, user }
 */
router.post('/login',
  validatorHandler(loginSchema, 'body'),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await service.login(email, password);
      res.json({
        message: 'Login successful',
        ...result
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/v1/users/profile - Obtener perfil del usuario autenticado
 * Headers: Authorization: Bearer <token>
 */
router.get('/profile',
  verifyToken,
  async (req, res, next) => {
    try {
      const user = await service.findByEmail(req.user.email);
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

