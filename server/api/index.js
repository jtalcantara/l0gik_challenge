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

// CORS
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials
}));

// Middlewares
app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

// Route Not Found
app.use('*', (req, res) => {
  HttpResponses.error(res, new Error('Rota não encontrada'), 404);
});

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Exportar para Vercel
module.exports = app;
