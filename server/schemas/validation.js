const yup = require('yup');
const { HttpResponses } = require('@/utils/http-responses');

// Schema para login
const loginSchema = yup.object({
  username: yup.string()
    .required('Campo "username": Nome de usuário é obrigatório')
    .min(3, 'Campo "username": Nome de usuário deve ter pelo menos 3 caracteres'),
  password: yup.string()
    .required('Campo "password": Senha é obrigatória')
    .min(6, 'Campo "password": Senha deve ter pelo menos 6 caracteres')
    //nao deve conter espaços e caracteres especiais
    .matches(/^[^\s]+$/, 'Campo "password": Senha não deve conter espaços e caracteres especiais'),
});

// Schema para registro
const registerSchema = yup.object({
  username: yup.string()
    .required('Campo "username": Nome de usuário é obrigatório')
    .min(3, 'Campo "username": Nome de usuário deve ter pelo menos 3 caracteres'),
  password: yup.string()
    .required('Campo "password": Senha é obrigatória')
    .min(6, 'Campo "password": Senha deve ter pelo menos 6 caracteres')
});

// Schema para lead
const leadSchema = yup.object({
  nome: yup.string()
    .required('Campo "nome": Nome completo é obrigatório')
    .min(2, 'Campo "nome": Nome completo deve ter pelo menos 2 caracteres'),
  email: yup.string()
    .required('Campo "email": E-mail é obrigatório')
    .email('Campo "email": E-mail deve ser válido'),
  telefone: yup.string()
    .required('Campo "telefone": Telefone é obrigatório')
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Campo "telefone": Telefone deve estar no formato (XX) XXXXX-XXXX'),
  cargo: yup.string()
    .required('Campo "cargo": Cargo é obrigatório')
    .min(2, 'Campo "cargo": Cargo deve ter pelo menos 2 caracteres'),
  dataNascimento: yup.string()
    .required('Campo "dataNascimento": Data de nascimento é obrigatória')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Campo "dataNascimento": Data deve estar no formato YYYY-MM-DD'),
  mensagem: yup.string()
    .required('Campo "mensagem": Mensagem é obrigatória')
    .min(10, 'Campo "mensagem": Mensagem deve ter pelo menos 10 caracteres'),
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
    .integer('Parâmetro "page": Página deve ser um número inteiro')
    .min(1, 'Parâmetro "page": Página deve ser maior que 0')
    .optional(),
  limit: yup.number()
    .integer('Parâmetro "limit": Limite deve ser um número inteiro')
    .min(1, 'Parâmetro "limit": Limite deve ser maior que 0')
    .max(100, 'Parâmetro "limit": Limite não pode ser maior que 100')
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
