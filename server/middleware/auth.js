const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');

const JWT_SECRET = process.env.JWT_SECRET || 'challenge_l0gik_secret_key_2024';

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return error(res, { message: 'Token de acesso necessário' }, 401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return error(res, { message: 'Token inválido ou expirado' }, 403);
    }
    
    req.user = user;
    next();
  });
};


// Função para gerar token JWT
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

// Função para verificar token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  authenticateToken,
  generateToken,
  verifyToken,
  JWT_SECRET
};
