const fs = require('fs');
const path = require('path');

// Caminho do arquivo de banco de dados
const DB_PATH = path.join(__dirname, '../data/leads.json');

// Função para ler dados do banco
const readDatabase = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      // Criar arquivo inicial se não existir
    const initialData = {
      leads: [],
      users: [
        {
          id: '1',
          username: 'admin',
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
          role: 'admin'
        },
        {
          id: '2',
          username: 'operador',
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
          role: 'operador'
        }
      ],
      rolePermissions: {
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
      }
    };
      writeDatabase(initialData);
      return initialData;
    }
    
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler banco de dados:', error);
    return { leads: [], users: [] };
  }
};

// Função para escrever dados no banco
const writeDatabase = (data) => {
  try {
    // Criar diretório se não existir
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao escrever banco de dados:', error);
    return false;
  }
};

// Função para obter leads
const getLeads = () => {
  const db = readDatabase();
  return db.leads || [];
};

// Função para obter usuários
const getUsers = () => {
  const db = readDatabase();
  return db.users || [];
};

// Função para adicionar lead
const addLead = (lead) => {
  const db = readDatabase();
  db.leads.push(lead);
  return writeDatabase(db);
};

// Função para atualizar lead
const updateLead = (leadId, leadData) => {
  const db = readDatabase();
  const leadIndex = db.leads.findIndex(lead => lead.id === leadId);
  
  if (leadIndex === -1) {
    return false;
  }
  
  db.leads[leadIndex] = { ...db.leads[leadIndex], ...leadData };
  return writeDatabase(db);
};

// Função para deletar lead
const deleteLead = (leadId) => {
  const db = readDatabase();
  const leadIndex = db.leads.findIndex(lead => lead.id === leadId);
  
  if (leadIndex === -1) {
    return false;
  }
  
  const deletedLead = db.leads.splice(leadIndex, 1)[0];
  writeDatabase(db);
  return deletedLead;
};

// Função para buscar lead por ID
const getLeadById = (leadId) => {
  const db = readDatabase();
  return db.leads.find(lead => lead.id === leadId);
};

// Função para buscar usuário por username
const getUserByUsername = (username) => {
  const db = readDatabase();
  return db.users.find(user => user.username === username);
};

// Função para adicionar usuário
const addUser = (user) => {
  const db = readDatabase();
  db.users.push(user);
  return writeDatabase(db);
};

// Função para obter permissões de um role
const getRolePermissions = (role) => {
  const db = readDatabase();
  return db.rolePermissions?.[role] || {};
};

// Função para obter todas as permissões
const getAllRolePermissions = () => {
  const db = readDatabase();
  return db.rolePermissions || {};
};

// Função para atualizar permissões de um role
const updateRolePermissions = (role, permissions) => {
  const db = readDatabase();
  
  if (!db.rolePermissions) {
    db.rolePermissions = {};
  }
  
  db.rolePermissions[role] = { ...db.rolePermissions[role], ...permissions };
  return writeDatabase(db);
};

// Função para verificar se um usuário tem uma permissão específica
const hasUserPermission = (user, permission) => {
  const userPermissions = getRolePermissions(user.role);
  return userPermissions[permission] === true;
};

// Função para obter permissões de um usuário
const getUserPermissions = (user) => {
  return getRolePermissions(user.role);
};

module.exports = {
  readDatabase,
  writeDatabase,
  getLeads,
  getUsers,
  addLead,
  updateLead,
  deleteLead,
  getLeadById,
  getUserByUsername,
  addUser,
  getRolePermissions,
  getAllRolePermissions,
  updateRolePermissions,
  hasUserPermission,
  getUserPermissions
};
