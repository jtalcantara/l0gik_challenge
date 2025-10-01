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
 * @param {Array|Object|String} errors - Detalhes do erro ou mensagem de erro
 * @param {number} statusCode - Código de status HTTP (padrão: 500)
 */
const error = (res, errors = 'Erro interno do servidor', statusCode = 500) => {
  // Normalizar diferentes tipos de entrada para array
  let errorsArray;
  
  if (typeof errors === 'string') {
    errorsArray = [{ message: errors }];
  } else if (errors instanceof Error) {
    errorsArray = [{ message: errors.message }];
  } else if (Array.isArray(errors)) {
    errorsArray = errors.map(err => {
      if (typeof err === 'string') {
        return { message: err };
      } else if (err instanceof Error) {
        return { message: err.message };
      } else if (err && typeof err === 'object' && err.message) {
        return { message: err.message };
      }
      return err;
    });
  } else if (errors && typeof errors === 'object') {
    errorsArray = [errors];
  } else {
    errorsArray = [{ message: 'Erro interno do servidor' }];
  }

  return res.status(statusCode).json({
    success: false,
    errors: errorsArray
  });
};

/**
 * Função auxiliar para criar múltiplos erros de validação
 * @param {Array} validationErrors - Array de erros de validação
 * @returns {Array} Array de objetos de erro formatados
 */
const formatValidationErrors = (validationErrors) => {
  return validationErrors.map(err => ({
    message: err.message,
    field: err.path || 'unknown'
  }));
};

/**
 * Função auxiliar para criar erro único
 * @param {String} message - Mensagem de erro
 * @returns {Object} Objeto de erro formatado
 */
const createError = (message) => ({ message });

module.exports = {
  HttpResponses: {
    success,
    error,
    formatValidationErrors,
    createError
  }
};
