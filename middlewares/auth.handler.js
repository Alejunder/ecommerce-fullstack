const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar token JWT en rutas protegidas
 * Uso: router.get('/protected', verifyToken, controller);
 */
function verifyToken(req, res, next) {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next(boom.unauthorized('Authorization header required'));
    }

    if (!authHeader.startsWith('Bearer ')) {
      return next(boom.unauthorized('Invalid authorization format. Use: Bearer <token>'));
    }

    const token = authHeader.substring(7); // Remover 'Bearer '
    
    if (!token) {
      return next(boom.unauthorized('Token required'));
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Agregar información del usuario al request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next(); // Continuar al siguiente middleware/controlador
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(boom.unauthorized('Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(boom.unauthorized('Token expired'));
    }
    return next(boom.unauthorized('Token verification failed'));
  }
}

/**
 * Middleware para verificar roles específicos
 * Uso: router.get('/admin', verifyToken, checkRole(['admin']), controller);
 */
function checkRole(allowedRoles) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return next(boom.unauthorized('Authentication required'));
      }

      const userRole = req.user.role;
      
      if (!allowedRoles.includes(userRole)) {
        return next(boom.forbidden(`Access denied. Required roles: ${allowedRoles.join(', ')}`));
      }

      next();
    } catch (error) {
      return next(boom.forbidden('Role verification failed'));
    }
  };
}

/**
 * Middleware para verificar que el usuario accede a sus propios datos
 * Uso: router.get('/users/:id', verifyToken, checkOwnership, controller);
 */
function checkOwnership(req, res, next) {
  try {
    if (!req.user) {
      return next(boom.unauthorized('Authentication required'));
    }

    const requestedUserId = parseInt(req.params.id);
    const currentUserId = req.user.userId;
    const userRole = req.user.role;

    // Los administradores pueden acceder a cualquier usuario
    if (userRole === 'admin') {
      return next();
    }

    // Los usuarios solo pueden acceder a sus propios datos
    if (currentUserId !== requestedUserId) {
      return next(boom.forbidden('Access denied. You can only access your own data'));
    }

    next();
  } catch (error) {
    return next(boom.forbidden('Ownership verification failed'));
  }
}

module.exports = {
  verifyToken,
  checkRole,
  checkOwnership
};
