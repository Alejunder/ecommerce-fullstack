// ✅ Error handlers optimizados para Vercel serverless
function logErrors(err, req, res, next) {
  // ✅ Logging más detallado para debugging en producción
  const errorInfo = {
    message: err.message,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress
  };

  // ✅ Solo mostrar stack trace en desarrollo
  if (process.env.NODE_ENV !== 'production') {
    errorInfo.stack = err.stack;
  }

  console.error('🚨 Error occurred:', errorInfo);
  next(err);
}

// ✅ Handler final mejorado
function errorHandler(err, req, res, next) {
  // ✅ Evitar headers duplicados
  if (res.headersSent) {
    return next(err);
  }

  const response = {
    error: true,
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  };

  // ✅ Stack trace solo en desarrollo
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
    response.details = err.details || null;
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json(response);
}

// ✅ Boom error handler mejorado
function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;

    // ✅ Añadir información adicional
    const response = {
      ...output.payload,
      timestamp: new Date().toISOString()
    };

    // ✅ Logging específico para errores Boom
    if (output.statusCode >= 500) {
      console.error('🔥 Boom Server Error:', {
        message: err.message,
        statusCode: output.statusCode,
        url: req.url,
        method: req.method
      });
    }

    return res.status(output.statusCode).json(response);
  }

  next(err);
}

module.exports = { logErrors, errorHandler, boomErrorHandler }
