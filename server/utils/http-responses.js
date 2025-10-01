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
 * @param {Object} errors - Detalhes do erro ou mensagem de erro
 * @param {number} statusCode - Código de status HTTP (padrão: 500)
 */
const error = (res, errors = [new Error('Erro interno do servidor')], statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    errors
  });
};

module.exports = {
  HttpResponses: {
    success,
    error
  }
};
