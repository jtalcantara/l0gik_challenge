const { HttpResponses } = require('../utils/http-responses');
const { getRolePermissions } = require('../database/memory-db');


// Middleware para verificar permissão de leitura
const checkPermissionRead = async (req, res, next) => {
  if (!req.user) {
    return HttpResponses.error(res, { message: 'Usuário não autenticado' }, 401);
  }

  try {
    const userPermissions = await getRolePermissions(req.user.role);
    if (!userPermissions || !userPermissions.canRead) {
      return HttpResponses.error(res, { message: 'Acesso negado. Permissão de leitura necessária.' }, 403);
    }
    next();
  } catch (error) {
    return HttpResponses.error(res, { message: 'Erro ao verificar permissões' }, 500);
  }
};

// Middleware para verificar permissão de escrita
const checkPermissionWrite = async (req, res, next) => {
  if (!req.user) {
    return HttpResponses.error(res, { message: 'Usuário não autenticado' }, 401);
  }

  try {
    const userPermissions = await getRolePermissions(req.user.role);
    if (!userPermissions || !userPermissions.canWrite) {
      return HttpResponses.error(res, { message: 'Acesso negado. Permissão de escrita necessária.' }, 403);
    }
    next();
  } catch (error) {
    return HttpResponses.error(res, { message: 'Erro ao verificar permissões' }, 500);
  }
};

// Middleware para verificar permissão de exclusão
const checkPermissionDelete = async (req, res, next) => {
  if (!req.user) {
    return HttpResponses.error(res, { message: 'Usuário não autenticado' }, 401);
  }

  try {
    const userPermissions = await getRolePermissions(req.user.role);
    if (!userPermissions || !userPermissions.canDelete) {
      return HttpResponses.error(res, { message: 'Acesso negado. Permissão de exclusão necessária.' }, 403);
    }
    next();
  } catch (error) {
    return HttpResponses.error(res, { message: 'Erro ao verificar permissões' }, 500);
  }
};

// Middleware para verificar permissão de exportação
const checkPermissionExport = async (req, res, next) => {
  if (!req.user) {
    return HttpResponses.error(res, { message: 'Usuário não autenticado' }, 401);
  }

  try {
    const userPermissions = await getRolePermissions(req.user.role);
    if (!userPermissions || !userPermissions.canExport) {
      return HttpResponses.error(res, { message: 'Acesso negado. Permissão de exportação necessária.' }, 403);
    }
    next();
  } catch (error) {
    return HttpResponses.error(res, { message: 'Erro ao verificar permissões' }, 500);
  }
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
