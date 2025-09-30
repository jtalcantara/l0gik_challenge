const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { generateToken } = require('../middleware/auth');
const { getUserByUsername, addUser } = require('../database');
const { success, error } = require('../utils/http-responses');

const router = express.Router();

// POST /api/auth/login
router.post('/login', [
  body('username').notEmpty().withMessage('Username é obrigatório'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return error(res, { validation: errors.array() }, 400);
    }

    const { username, password } = req.body;

    const user = getUserByUsername(username);
    if (!user) {
      return error(res, { message: 'Credenciais inválidas' }, 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return error(res, { message: 'Credenciais inválidas' }, 401);
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    return success(res, {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Erro no login:', err);
    return error(res, { message: 'Erro interno do servidor' }, 500);
  }
});

// POST /api/auth/register (apenas para desenvolvimento)
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('Username deve ter pelo menos 3 caracteres'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return error(res, { validation: errors.array() }, 400);
    }

    const { username, password } = req.body;

    // Verificar se usuário já existe
    const existingUser = getUserByUsername(username);
    if (existingUser) {
      return error(res, { message: 'Username já existe' }, 409);
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
      return success(res, {
        user: {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role
        }
      }, 201);
    } else {
      return error(res, { message: 'Erro ao criar usuário' }, 500);
    }

  } catch (err) {
    console.error('Erro no registro:', err);
    return error(res, { message: 'Erro interno do servidor' }, 500);
  }
});

// GET /api/auth/verify
router.get('/verify', (req, res) => {
  return success(res, { message: 'Token válido' });
});

module.exports = router;
