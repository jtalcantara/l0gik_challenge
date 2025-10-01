const { HttpResponses } = require('@/utils/http-responses');
const { getRolePermissions } = require('@/database');
const { verifyToken } = require('@/middleware/auth');


// Middleware para verificar permissão de leitura
const checkPermissionRead = (req, res, next) => {
  if (!req.user) {
    return HttpResponses.error(res, { message: 'Usuário não autenticado' }, 401);
  }

  const userPermissions = getRolePermissions(req.user.role);
  if (!userPermissions || !userPermissions.canRead) {
    return HttpResponses.error(res, { message: 'Acesso negado. Permissão de leitura necessária.' }, 403);
  }

  next();
};

// Middleware para verificar permissão de escrita
const checkPermissionWrite = (req, res, next) => {
  if (!req.user) {
    return HttpResponses.error(res, { message: 'Usuário não autenticado' }, 401);
  }

  const userPermissions = getRolePermissions(req.user.role);
  if (!userPermissions || !userPermissions.canWrite) {
    return HttpResponses.error(res, { message: 'Acesso negado. Permissão de escrita necessária.' }, 403);
  }

  next();
};

// Middleware para verificar permissão de exclusão
const checkPermissionDelete = (req, res, next) => {
  if (!req.user) {
    return HttpResponses.error(res, { message: 'Usuário não autenticado' }, 401);
  }

  const userPermissions = getRolePermissions(req.user.role);
  if (!userPermissions || !userPermissions.canDelete) {
    return HttpResponses.error(res, { message: 'Acesso negado. Permissão de exclusão necessária.' }, 403);
  }

  next();
};

// Middleware para verificar permissão de exportação
const checkPermissionExport = (req, res, next) => {
  if (!req.user) {
    return HttpResponses.error(res, { message: 'Usuário não autenticado' }, 401);
  }

  const userPermissions = getRolePermissions(req.user.role);
  if (!userPermissions || !userPermissions.canExport) {
    return HttpResponses.error(res, { message: 'Acesso negado. Permissão de exportação necessária.' }, 403);
  }

  next();
};

//Verifica se é admin
const requireAdmin = (req, res, next) => {

  if (!req.user) {
    return HttpResponses.error(res, { message: 'Usuário não autenticado' }, 401);
  }

  if (req.user.role !== 'admin') {
    return HttpResponses.error(res, { message: 'Acesso negado. Permissão de admin necessária.' }, 403);
  }

  next();
};

module.exports = {
  Permissions: {
    checkPermissionRead,
    checkPermissionWrite,
    checkPermissionDelete,
    checkPermissionExport,
    requireAdmin
  }
};
