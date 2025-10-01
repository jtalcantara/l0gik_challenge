const sqlite3 = require('sqlite3').verbose();
const { INITIAL_USERS, INITIAL_LEADS } = require('../seeders/auto-seeder');

// Banco de dados em memória
let db = null;

// Inicializar banco de dados
const initDB = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(':memory:', (err) => {
      if (err) {
        console.error('Erro ao conectar com SQLite:', err);
        reject(err);
        return;
      }
      
      console.log('✅ SQLite em memória conectado');
      createTables().then(resolve).catch(reject);
    });
  });
};

// Criar tabelas
const createTables = () => {
  return new Promise((resolve, reject) => {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
      )
    `;
    
    const createLeadsTable = `
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT NOT NULL,
        telefone TEXT NOT NULL,
        cargo TEXT NOT NULL,
        dataNascimento TEXT NOT NULL,
        mensagem TEXT NOT NULL,
        utm_source TEXT,
        utm_medium TEXT,
        utm_campaign TEXT,
        utm_term TEXT,
        utm_content TEXT,
        gclid TEXT,
        fbclid TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `;
    
    const createPermissionsTable = `
      CREATE TABLE IF NOT EXISTS permissions (
        role TEXT PRIMARY KEY,
        canRead INTEGER NOT NULL,
        canWrite INTEGER NOT NULL,
        canDelete INTEGER NOT NULL,
        canExport INTEGER NOT NULL,
        canViewAll INTEGER NOT NULL,
        canManageUsers INTEGER NOT NULL
      )
    `;
    
    db.serialize(() => {
      db.run(createUsersTable, (err) => {
        if (err) {
          console.error('Erro ao criar tabela users:', err);
          reject(err);
          return;
        }
        console.log('✅ Tabela users criada');
      });
      
      db.run(createLeadsTable, (err) => {
        if (err) {
          console.error('Erro ao criar tabela leads:', err);
          reject(err);
          return;
        }
        console.log('✅ Tabela leads criada');
      });
      
      db.run(createPermissionsTable, (err) => {
        if (err) {
          console.error('Erro ao criar tabela permissions:', err);
          reject(err);
          return;
        }
        console.log('✅ Tabela permissions criada');
        
        // Inserir dados iniciais após criar todas as tabelas
        insertInitialData(() => {
          resolve();
        });
      });
    });
  });
};

// Inserir dados iniciais
const insertInitialData = (callback) => {
  console.log('🌱 Inserindo dados iniciais...');
  
  // Inserir usuários
  const insertUser = db.prepare(`
    INSERT INTO users (id, username, password, role) 
    VALUES (?, ?, ?, ?)
  `);
  
  console.log(`📝 Inserindo ${INITIAL_USERS.length} usuários...`);
  INITIAL_USERS.forEach((user, index) => {
    insertUser.run(user.id, user.username, user.password, user.role, (err) => {
      if (err) {
        console.error(`❌ Erro ao inserir usuário ${index + 1}:`, err.message);
      } else {
        console.log(`✅ Usuário ${index + 1} inserido: ${user.username}`);
      }
    });
  });
  
  // Inserir leads
  const insertLead = db.prepare(`
    INSERT INTO leads (
      id, nome, email, telefone, cargo, dataNascimento, mensagem,
      utm_source, utm_medium, utm_campaign, utm_term, utm_content,
      gclid, fbclid, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  console.log(`📝 Inserindo ${INITIAL_LEADS.length} leads...`);
  INITIAL_LEADS.forEach((lead, index) => {
    insertLead.run(
      lead.id, lead.nome, lead.email, lead.telefone, lead.cargo,
      lead.dataNascimento, lead.mensagem,
      lead.tracking.utm_source, lead.tracking.utm_medium,
      lead.tracking.utm_campaign, lead.tracking.utm_term,
      lead.tracking.utm_content, lead.tracking.gclid,
      lead.tracking.fbclid, lead.createdAt, lead.updatedAt,
      (err) => {
        if (err) {
          console.error(`❌ Erro ao inserir lead ${index + 1}:`, err.message);
        } else {
          console.log(`✅ Lead ${index + 1} inserido: ${lead.nome}`);
        }
      }
    );
  });
  
  // Inserir permissões
  const insertPermission = db.prepare(`
    INSERT INTO permissions 
    (role, canRead, canWrite, canDelete, canExport, canViewAll, canManageUsers)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  insertPermission.run('admin', 1, 1, 1, 1, 1, 1, (err) => {
    if (err) {
      console.error('❌ Erro ao inserir permissão admin:', err.message);
    } else {
      console.log('✅ Permissão admin inserida');
    }
  });
  
  insertPermission.run('operador', 1, 0, 0, 0, 0, 0, (err) => {
    if (err) {
      console.error('❌ Erro ao inserir permissão operador:', err.message);
    } else {
      console.log('✅ Permissão operador inserida');
    }
  });
  
  console.log('✅ Dados iniciais inseridos no SQLite');
  callback();
};

// Funções para leads
const getLeads = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM leads ORDER BY createdAt DESC", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const addLead = (lead) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO leads (
        id, nome, email, telefone, cargo, dataNascimento, mensagem,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content,
        gclid, fbclid, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      lead.id, lead.nome, lead.email, lead.telefone, lead.cargo,
      lead.dataNascimento, lead.mensagem,
      lead.tracking?.utm_source, lead.tracking?.utm_medium,
      lead.tracking?.utm_campaign, lead.tracking?.utm_term,
      lead.tracking?.utm_content, lead.tracking?.gclid,
      lead.tracking?.fbclid, lead.createdAt, lead.updatedAt,
      (err) => {
        if (err) reject(err);
        else resolve(true);
      }
    );
  });
};

const getLead = (leadId) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM leads WHERE id = ?", [leadId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const updateLead = (leadId, leadData) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      UPDATE leads SET 
        nome = ?, email = ?, telefone = ?, cargo = ?, dataNascimento = ?,
        mensagem = ?, utm_source = ?, utm_medium = ?, utm_campaign = ?,
        utm_term = ?, utm_content = ?, gclid = ?, fbclid = ?, updatedAt = ?
      WHERE id = ?
    `);
    
    stmt.run(
      leadData.nome, leadData.email, leadData.telefone, leadData.cargo,
      leadData.dataNascimento, leadData.mensagem,
      leadData.tracking?.utm_source, leadData.tracking?.utm_medium,
      leadData.tracking?.utm_campaign, leadData.tracking?.utm_term,
      leadData.tracking?.utm_content, leadData.tracking?.gclid,
      leadData.tracking?.fbclid, new Date().toISOString(),
      leadId,
      (err) => {
        if (err) reject(err);
        else resolve(true);
      }
    );
  });
};

const deleteLead = (leadId) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM leads WHERE id = ?", [leadId], (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
};

// Funções para usuários
const getUsers = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const addUser = (user) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare("INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)");
    stmt.run(user.id, user.username, user.password, user.role, (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
};

// Funções para permissões
const getRolePermissions = (role) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM permissions WHERE role = ?", [role], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const getAllRolePermissions = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM permissions", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const hasUserPermission = (user, permission) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM permissions WHERE role = ?", [user.role], (err, row) => {
      if (err) reject(err);
      else resolve(row && row[permission] === 1);
    });
  });
};

const getUserPermissions = (user) => {
  return getRolePermissions(user.role);
};

// Função para inicializar dados
const initializeData = async () => {
  try {
    console.log('🌱 Inicializando SQLite em memória...');
    await initDB();
    console.log('✅ SQLite inicializado com sucesso');
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao inicializar SQLite:', error);
    return false;
  }
};

module.exports = {
  initializeData,
  getLeads,
  addLead,
  getLead,
  updateLead,
  deleteLead,
  getUsers,
  getUserByUsername,
  addUser,
  getRolePermissions,
  getAllRolePermissions,
  hasUserPermission,
  getUserPermissions
};
