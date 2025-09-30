// Utilitários para padronização de respostas da API

/**
 * Resposta de sucesso padronizada
 * @param {Object} res - Objeto response do Express
 * @param {Object} data - Dados a serem retornados
 * @param {number} statusCode - Código de status HTTP (padrão: 200)
 */
const success = (res, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data
  });
};

/**
 * Resposta de erro padronizada
 * @param {Object} res - Objeto response do Express
 * @param {Object} errors - Detalhes dos erros
 * @param {number} statusCode - Código de status HTTP (padrão: 400)
 */
const error = (res, errors = {}, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    errors
  });
};

module.exports = {
  success,
  error
};
