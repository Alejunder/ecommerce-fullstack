// Optimización para Vercel serverless functions
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// ✅ Lazy imports para reducir cold start
let routerApi;
let errorHandlers;

const app = express();

// ✅ Puerto dinámico para Vercel
const port = process.env.PORT || 3000;

// ✅ Configuración de middleware básico
app.use(express.json({ limit: '10mb' }));

// ✅ CORS optimizado para producción
const whitelist = [
  'http://localhost:3000',
  'http://localhost:8080', 
  'https://myapp.co',
  // ✅ Añadir dominios de Vercel automáticamente
  ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ...(process.env.NODE_ENV === 'production' ? [] : ['http://localhost:3000'])
];

const corsOptions = {
  origin: (origin, callback) => {
    // ✅ Permitir requests sin origin (mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// ✅ Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'E-commerce API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ✅ Lazy loading de rutas para mejorar cold start
app.use((req, res, next) => {
  if (!routerApi) {
    routerApi = require('./routes');
    routerApi(app);
  }
  next();
});

// ✅ Lazy loading de error handlers
app.use((err, req, res, next) => {
  if (!errorHandlers) {
    errorHandlers = require('./middlewares/error.handler');
  }
  
  // Aplicar handlers en orden
  errorHandlers.logErrors(err, req, res, (err) => {
    errorHandlers.boomErrorHandler(err, req, res, (err) => {
      errorHandlers.errorHandler(err, req, res, next);
    });
  });
});

// ✅ Vercel no necesita app.listen() 
// Solo para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📖 API Docs: http://localhost:${port}/`);
    console.log(`🔍 Health Check: http://localhost:${port}/health`);
  });
}

// ✅ Exportar para Vercel
module.exports = app;
