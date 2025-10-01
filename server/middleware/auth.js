const jwt = require('jsonwebtoken');
const { HttpResponses } = require('@/utils/http-responses');
const config = require('@/config');

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Verificar se o header existe
  if (!authHeader) {
    return HttpResponses.error(res, { message: 'Token de acesso necessário' }, 401);
  }
  
  // Verificar se está no formato correto (Bearer TOKEN)
  if (!authHeader.startsWith('Bearer ')) {
    return HttpResponses.error(res, { 
      message: 'Formato de autorização inválido. Use: Bearer <token>',
      hint: 'O header Authorization deve estar no formato: Authorization: Bearer <seu_token>'
    }, 401);
  }
  
  const token = authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return HttpResponses.error(res, { message: 'Token de acesso necessário' }, 401);
  }

  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) {
      return HttpResponses.error(res, { message: 'Token inválido ou expirado' }, 403);
    }
    
    req.user = user;
    next();
  });
};


// Função para gerar token JWT
const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

// Função para verificar token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    return null;
  }
};

module.exports = {
  authenticateToken,
  generateToken,
  verifyToken
};
