// Carregar aliases primeiro
require('./aliases');

process.loadEnvFile();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Importar rotas centralizadas
const routes = require('@/routes');
const { HttpResponses } = require('@/utils/http-responses');
const { errorHandler } = require('@/middleware/error-handler');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Middlewares

app.use(helmet());

app.use(express.json({ limit: '2mb' }));         // Faz o parse do corpo da requisição e limita o tamanho máximo do payload

app.use(express.urlencoded({ extended: true })); // Converte os dados de URL em objetos JavaScript

app.use('/api', routes);

// Route Not Found
app.use('*', (req, res) => {
  HttpResponses.error(res, [new Error('Rota não encontrada')], 404);
});

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);

  // Só mostra a URL local em desenvolvimento
  if (process.env.NODE_ENV !== 'production') {
    console.log(`🔗 API: http://localhost:${PORT}/api`);
  }
});
