const yup = require('yup');

// Schema para login
const loginSchema = yup.object({
  username: yup.string()
    .required('Username é obrigatório')
    .min(3, 'Username deve ter pelo menos 3 caracteres'),
  password: yup.string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
});

// Schema para registro
const registerSchema = yup.object({
  username: yup.string()
    .required('Username é obrigatório')
    .min(3, 'Username deve ter pelo menos 3 caracteres'),
  password: yup.string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
});

// Schema para lead
const leadSchema = yup.object({
  nome: yup.string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: yup.string()
    .required('Email é obrigatório')
    .email('Email deve ser válido'),
  telefone: yup.string()
    .required('Telefone é obrigatório')
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (XX) XXXXX-XXXX'),
  cargo: yup.string()
    .required('Cargo é obrigatório')
    .min(2, 'Cargo deve ter pelo menos 2 caracteres'),
  dataNascimento: yup.string()
    .required('Data de nascimento é obrigatória')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  mensagem: yup.string()
    .required('Mensagem é obrigatória')
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
  // Campos opcionais de tracking
  utm_source: yup.string().optional(),
  utm_medium: yup.string().optional(),
  utm_campaign: yup.string().optional(),
  utm_term: yup.string().optional(),
  utm_content: yup.string().optional(),
  gclid: yup.string().optional(),
  fbclid: yup.string().optional()
});

// Schema para query parameters
const querySchema = yup.object({
  page: yup.number()
    .integer('Página deve ser um número inteiro')
    .min(1, 'Página deve ser maior que 0')
    .optional(),
  limit: yup.number()
    .integer('Limite deve ser um número inteiro')
    .min(1, 'Limite deve ser maior que 0')
    .max(100, 'Limite não pode ser maior que 100')
    .optional(),
  search: yup.string()
    .optional()
});

// Middleware de validação com Yup
const validateSchema = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (error) {
      const errors = error.inner.map(err => new Error(err.message));
      
      return HttpResponses.error(res, errors, 400);
    }
  };
};

// Middleware para validação de query parameters
const validateQuery = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validate(req.query, { abortEarly: false });
      next();
    } catch (error) {
      const errors = error.inner.map(err => new Error(err.message));
      
      return HttpResponses.error(res, errors, 400);
    }
  };
};

module.exports = {
  loginSchema,
  registerSchema,
  leadSchema,
  querySchema,
  validateSchema,
  validateQuery
};
