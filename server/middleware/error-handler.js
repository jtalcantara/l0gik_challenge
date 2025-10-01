const { HttpResponses } = require('../utils/http-responses');

/**
 * Middleware simples para capturar erros async
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Middleware global de tratamento de erros
 */
const errorHandler = (err, req, res, next) => {
  console.error('Erro:', err);

  // Se a resposta já foi enviada, delegar para o handler padrão
  if (res.headersSent) {
    return next(err);
  }

  // Se o erro já tem um status definido, usar ele
  if (err.status) {
    return HttpResponses.error(res, [new Error(err.message)], err.status);
  }

  // Erro padrão
  return HttpResponses.error(res, [new Error('Erro interno do servidor')], 500);
};

module.exports = {
  catchAsync,
  errorHandler
};
