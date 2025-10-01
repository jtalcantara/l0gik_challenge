// Arquivo específico para Vercel - API Routes
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Importar configurações centralizadas (sem aliases)
const config = require('../config');

// Importar rotas centralizadas (sem aliases)
const routes = require('../routes');
const { HttpResponses } = require('../utils/http-responses');
const { errorHandler } = require('../middleware/error-handler');

const app = express();

// CORS - Configuração para frontend
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://l0gik-challenge-client.vercel.app',
    'https://l0gik-challenge-client-git-main-jtalcantaras-projects.vercel.app',
    'https://l0gik-challenge-iupdzwsjs-jtalcantaras-projects.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization']
}));

// Middlewares
app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

// Rota para informações da API
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Challenge L0gik API',
    version: '1.0.0',
    endpoints: [
      'GET /api/leads',
      'POST /api/leads', 
      'GET /api/leads/:id',
      'PATCH /api/leads/:id',
      'DELETE /api/leads/:id',
      'POST /api/auth/login',
      'GET /api/auth/verify',
      'POST /api/auth/register'
    ]
  });
});

// Route Not Found
app.use('*', (req, res) => {
  HttpResponses.error(res, new Error('Rota não encontrada'), 404);
});

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Exportar para Vercel
module.exports = app;
