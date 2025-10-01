// Arquivo de teste simples para Vercel
const express = require('express');
const app = express();

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Challenge L0gik API',
    version: '1.0.0',
    endpoints: [
      'GET /api/test',
      'POST /api/leads',
      'GET /api/leads',
      'POST /api/auth/login'
    ]
  });
});

module.exports = app;
