const express = require('express');
const bcrypt = require('bcryptjs');
const { generateToken } = require('@/middleware/auth');
const { getUserByUsername, addUser } = require('@/database');
const { HttpResponses } = require('@/utils/http-responses');
const { loginSchema, registerSchema, validateSchema } = require('@/schemas/validation');

const router = express.Router();

// POST /api/auth/login
router.post('/login', validateSchema(loginSchema), async (req, res) => {
  const { username, password } = req.body;

  const user = getUserByUsername(username);

  if (!user)
    return HttpResponses.error(res, [new Error('Credenciais inválidas')], 401);

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword)
    return HttpResponses.error(res, [new Error('Credenciais inválidas')], 401);

  const token = generateToken({
    id: user.id,
    username: user.username,
    role: user.role
  });

  return HttpResponses.success(res, {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
});

// POST /api/auth/register (apenas para desenvolvimento)
router.post('/register', validateSchema(registerSchema), async (req, res) => {
  const { username, password } = req.body;

  // Verificar se usuário já existe
  const existingUser = getUserByUsername(username);
  if (existingUser) {
    return HttpResponses.error(res, { message: 'Username já existe' }, 409);
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Criar novo usuário
  const newUser = {
    id: Date.now().toString(),
    username,
    password: hashedPassword,
    role: 'admin'
  };

  if (addUser(newUser)) {
    return HttpResponses.success(res, {
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role
      }
    }, 201);
  } else {
    return HttpResponses.error(res, { message: 'Erro ao criar usuário' }, 500);
  }
});

// GET /api/auth/verify
router.get('/verify', (req, res) => {
  return HttpResponses.success(res, { message: 'Token válido' });
});

module.exports = router;
