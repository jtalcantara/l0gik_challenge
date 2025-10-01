/**
 * Configurações centralizadas da aplicação
 * Centraliza todas as variáveis de ambiente e configurações dinâmicas
 */

const config = {
  // Configurações do servidor
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    nodeEnv: process.env.NODE_ENV || 'development'
  },

  // Configurações de autenticação JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'challenge_l0gik_secret_key_2024',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // Configurações de CORS
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  },

  // Configurações de segurança
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10
  }
};

module.exports = config;
