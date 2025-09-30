const { error } = require('../utils/http-responses');
const { getRolePermissions } = require('../database');


// Middleware para verificar permissão de leitura
const checkPermissionRead = (req, res, next) => {
  if (!req.user) {
    return error(res, { message: 'Usuário não autenticado' }, 401);
  }

  const userPermissions = getRolePermissions(req.user.role);
  if (!userPermissions || !userPermissions.canRead) {
    return error(res, { message: 'Acesso negado. Permissão de leitura necessária.' }, 403);
  }
 
  next();
};

// Middleware para verificar permissão de escrita
const checkPermissionWrite = (req, res, next) => {
  if (!req.user) {
    return error(res, { message: 'Usuário não autenticado' }, 401);
  }

  const userPermissions = getRolePermissions(req.user.role);
  if (!userPermissions || !userPermissions.canWrite) {
    return error(res, { message: 'Acesso negado. Permissão de escrita necessária.' }, 403);
  }
 
  next();
};

// Middleware para verificar permissão de exclusão
const checkPermissionDelete = (req, res, next) => {
  if (!req.user) {
    return error(res, { message: 'Usuário não autenticado' }, 401);
  }

  const userPermissions = getRolePermissions(req.user.role);
  if (!userPermissions || !userPermissions.canDelete) {
    return error(res, { message: 'Acesso negado. Permissão de exclusão necessária.' }, 403);
  }
 
  next();
};

// Middleware para verificar permissão de exportação
const checkPermissionExport = (req, res, next) => {
  if (!req.user) {
    return error(res, { message: 'Usuário não autenticado' }, 401);
  }

  const userPermissions = getRolePermissions(req.user.role);
  if (!userPermissions || !userPermissions.canExport) {
    return error(res, { message: 'Acesso negado. Permissão de exportação necessária.' }, 403);
  }
 
  next();
};

const Permissions = {
  checkPermissionRead,
  checkPermissionWrite,
  checkPermissionDelete,
  checkPermissionExport
};

module.exports = Permissions;
