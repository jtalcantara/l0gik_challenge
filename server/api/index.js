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

// Importar e executar seeder
const { initializeData } = require('../database/memory-db');

const app = express();

// CORS - Configuração mais permissiva para resolver preflight
app.use(cors({
  origin: '*', // Permite qualquer origem
  credentials: false, // Sem credenciais para evitar preflight
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200 // Para navegadores legados
}));

// Middleware para lidar com preflight OPTIONS
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.status(200).end();
});

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

// Executar seeder na inicialização
initializeData().then(() => {
  console.log('✅ Dados iniciais carregados com sucesso');
  
  // Inicializar servidor apenas em desenvolvimento local
  if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
    });
  }
}).catch((error) => {
  console.error('❌ Erro ao carregar dados iniciais:', error);
});

// Exportar para Vercel
module.exports = app;
