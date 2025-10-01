const fs = require('fs');
const path = require('path');
const { INITIAL_USERS, INITIAL_LEADS } = require('../seeders/auto-seeder');

// Caminhos dos arquivos de banco de dados
const LEADS_PATH = path.join(__dirname, '../data/leads.json');
const USERS_PATH = path.join(__dirname, '../data/users.json');
const PERMISSIONS_PATH = path.join(__dirname, '../data/rolePermissions.json');

// Função genérica para ler arquivo JSON
const readJsonFile = (filePath, defaultData) => {
  try {
    if (!fs.existsSync(filePath)) {
      writeJsonFile(filePath, defaultData);
      return defaultData;
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erro ao ler arquivo ${filePath}:`, error);
    return defaultData;
  }
};

// Função genérica para escrever arquivo JSON
const writeJsonFile = (filePath, data) => {
  try {
    const dataDir = path.dirname(filePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Erro ao escrever arquivo ${filePath}:`, error);
    return false;
  }
};

// Auto-seed: popular dados iniciais se estiverem vazios
const autoSeed = () => {
  // Verificar e popular usuários
  const users = getUsers();
  if (users.length === 0) {
    console.log('🌱 Auto-seeding: Adicionando usuários iniciais...');
    INITIAL_USERS.forEach(user => {
      addUser(user);
    });
    console.log('✅ Usuários iniciais adicionados');
  }

  // Verificar e popular leads
  const leads = getLeads();
  if (leads.length === 0) {
    console.log('🌱 Auto-seeding: Adicionando leads iniciais...');
    INITIAL_LEADS.forEach(lead => {
      addLead(lead);
    });
    console.log('✅ Leads iniciais adicionados');
  }
};

const INITIAL_PERMISSIONS = {
  admin: {
    canRead: true,
    canWrite: true,
    canDelete: true,
    canExport: true,
    canViewAll: true,
    canManageUsers: true
  },
  operador: {
    canRead: true,
    canWrite: false,
    canDelete: false,
    canExport: false,
    canViewAll: false,
    canManageUsers: false
  }
};

// Funções para leads
const getLeads = () => {
  const db = readJsonFile(LEADS_PATH, { leads: [] });
  return db.leads || [];
};

const addLead = (lead) => {
  const db = readJsonFile(LEADS_PATH, { leads: [] });
  db.leads.push(lead);
  return writeJsonFile(LEADS_PATH, db);
};

const updateLead = (leadId, leadData) => {
  const db = readJsonFile(LEADS_PATH, { leads: [] });
  const leadIndex = db.leads.findIndex(lead => lead.id === leadId);
  
  if (leadIndex === -1) {
    return false;
  }
  
  db.leads[leadIndex] = { ...db.leads[leadIndex], ...leadData };
  return writeJsonFile(LEADS_PATH, db);
};

const deleteLead = (leadId) => {
  const db = readJsonFile(LEADS_PATH, { leads: [] });
  const leadIndex = db.leads.findIndex(lead => lead.id === leadId);
  
  if (leadIndex === -1) {
    return false;
  }
  
  const deletedLead = db.leads.splice(leadIndex, 1)[0];
  writeJsonFile(LEADS_PATH, db);
  return deletedLead;
};

const getLead = (leadId) => {
  const db = readJsonFile(LEADS_PATH, { leads: [] });
  return db.leads.find(lead => lead.id === leadId);
};

// Funções para usuários
const getUsers = () => {
  return readJsonFile(USERS_PATH, []);
};

const getUserByUsername = (username) => {
  const users = getUsers();
  return users.find(user => user.username === username);
};

const addUser = (user) => {
  const users = getUsers();
  users.push(user);
  return writeJsonFile(USERS_PATH, users);
};

// Funções para permissões
const getRolePermissions = (role) => {
  const permissions = readJsonFile(PERMISSIONS_PATH, INITIAL_PERMISSIONS);
  return permissions?.[role] || {};
};

const getAllRolePermissions = () => {
  return readJsonFile(PERMISSIONS_PATH, INITIAL_PERMISSIONS);
};

const updateRolePermissions = (role, permissions) => {
  const db = readJsonFile(PERMISSIONS_PATH, INITIAL_PERMISSIONS);
  db[role] = { ...db[role], ...permissions };
  return writeJsonFile(PERMISSIONS_PATH, db);
};

const hasUserPermission = (user, permission) => {
  const userPermissions = getRolePermissions(user.role);
  return userPermissions[permission] === true;
};

const getUserPermissions = (user) => {
  return getRolePermissions(user.role);
};

// Executar auto-seed na inicialização
autoSeed();

module.exports = {
  getLeads,
  getUsers,
  addLead,
  updateLead,
  deleteLead,
  getLead,
  getUserByUsername,
  addUser,
  getRolePermissions,
  getAllRolePermissions,
  updateRolePermissions,
  hasUserPermission,
  getUserPermissions
};