const express = require('express');

// Importar rotas específicas
const leadsRoutes = require('./leads');
const authRoutes = require('./auth');

const router = express.Router();

// Configurar rotas da API
router.use('/auth', authRoutes);
router.use('/leads', leadsRoutes);

module.exports = router;
