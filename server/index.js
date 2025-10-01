// Carregar aliases primeiro
require('./aliases');

process.loadEnvFile();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Importar configurações centralizadas
const config = require('@/config');

// Importar rotas centralizadas
const routes = require('@/routes');
const { HttpResponses } = require('@/utils/http-responses');
const { errorHandler } = require('@/middleware/error-handler');

const app = express();

// CORS
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials
}));

// Middlewares

app.use(helmet());

app.use(express.json({ limit: '2mb' }));         // Faz o parse do corpo da requisição e limita o tamanho máximo do payload

app.use(express.urlencoded({ extended: true })); // Converte os dados de URL em objetos JavaScript

app.use('/api', routes);

// Route Not Found
app.use('*', (req, res) => {
  HttpResponses.error(res, new Error('Rota não encontrada'), 404);
});

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

app.listen(config.server.port, config.server.host, () => {
  console.log(`🚀 Servidor rodando na porta ${config.server.port}`);
  console.log(`📊 Ambiente: ${config.server.nodeEnv}`);

  // Só mostra a URL local em desenvolvimento
  if (config.server.nodeEnv !== 'production') {
    console.log(`🔗 API: http://${config.server.host}:${config.server.port}/api`);
  }
});
