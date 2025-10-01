const express = require('express');
const path = require('path');

// Importar configurações centralizadas
const config = require('../config');

// Importar rotas específicas
const leadsRoutes = require('./leads');
const authRoutes = require('./auth');

const router = express.Router();

// Configurar rotas da API
router.use('/auth', authRoutes);
router.use('/leads', leadsRoutes);

// Servir arquivos estáticos do frontend em produção
if (config.server.nodeEnv === 'production') {
  router.use(express.static(path.join(__dirname, '../../client/dist')));
  
  router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

module.exports = router;
