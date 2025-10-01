const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { Permissions } = require('../middleware/permissions');
const { leadSchema, leadPatchSchema, querySchema, validateSchema, validateQuery } = require('../schemas/validation');
const {
  getLeads,
  addLead,
  getLead,
  updateLead,
  deleteLead
} = require('../database/memory-db');
const { v4: uuidv4 } = require('uuid');
const { HttpResponses } = require('../utils/http-responses');

const router = express.Router();

// Validações para lead (agora usando Yup)
const leadValidation = validateSchema(leadSchema);

// GET /api/leads - Listar leads, qualquer um com permissao de leitura pode ver
router.get('/', authenticateToken, Permissions.checkPermissionRead, validateQuery(querySchema), async (req, res) => {
  let leads = await getLeads();

  // Aplicar filtro de busca
  const search = req.query.search;
  if (search) {
    const searchLower = search.toLowerCase();

    leads = leads.filter(lead =>
      lead.nome.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower)
    );
  }

  // Ordenar por data de criação (mais recentes primeiro)
  leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Paginação
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedLeads = leads.slice(startIndex, endIndex);

  const pagination = {
    currentPage: page,
    totalPages: Math.ceil(leads.length / limit),
    totalItems: leads.length,
    itemsPerPage: limit
  };

  return HttpResponses.success(res, {
    leads: paginatedLeads,
    pagination
  });
});

// POST /api/leads - Criar lead (público)
router.post('/', leadValidation, async (req, res) => {
  // Verificar se email já existe
  const existingLead = (await getLeads()).find(lead => lead.email === req.body.email);

  if (existingLead) {
    return HttpResponses.error(res, new Error('Email já cadastrado'), 409);
  }

  // Criar novo lead
  const newLead = {
    id: uuidv4(),
    nome: req.body.nome,
    email: req.body.email,
    telefone: req.body.telefone,
    cargo: req.body.cargo,
    dataNascimento: req.body.dataNascimento,
    mensagem: req.body.mensagem,
    tracking: {
      utm_source: req.body.utm_source || null,
      utm_medium: req.body.utm_medium || null,
      utm_campaign: req.body.utm_campaign || null,
      utm_term: req.body.utm_term || null,
      utm_content: req.body.utm_content || null,
      gclid: req.body.gclid || null,
      fbclid: req.body.fbclid || null
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (await addLead(newLead)) {
    return HttpResponses.success(res, newLead, 201);
  } else {
    return HttpResponses.error(res, new Error('Erro ao cadastrar lead'), 500);
  }
});

// GET /api/leads/:id - Obter lead por email ou id, qualquer um com permissao de leitura pode ver
router.get('/:id', authenticateToken, Permissions.checkPermissionRead, async (req, res) => {
  const lead = await getLead(req.params.id);

  if (!lead) {
    return HttpResponses.error(res, new Error('Lead não encontrado'), 404);
  }

  return HttpResponses.success(res, lead);
});


// PATCH /api/leads/:id - Atualizar lead parcialmente, qualquer um com permissao de escrita pode editar
router.patch('/:id', authenticateToken, Permissions.checkPermissionWrite, validateSchema(leadPatchSchema), async (req, res) => {

  const existingLead = await getLead(req.params.id);
  
  if (!existingLead) {
    return HttpResponses.error(res, new Error('Lead não encontrado'), 404);
  }

  // Verificar se email já existe em outro lead (apenas se email está sendo atualizado)
  if (req.body.email) {
    const emailExists = (await getLeads()).find(lead =>
      lead.email === req.body.email && lead.id !== req.params.id
    );
    if (emailExists) {
      return HttpResponses.error(res, new Error('Email já cadastrado em outro lead'), 409);
    }
  }

  // Preparar dados para atualização parcial
  const updateData = {
    ...existingLead,
    ...req.body,
    tracking: {
      ...existingLead.tracking,
      ...(req.body.utm_source !== undefined && { utm_source: req.body.utm_source }),
      ...(req.body.utm_medium !== undefined && { utm_medium: req.body.utm_medium }),
      ...(req.body.utm_campaign !== undefined && { utm_campaign: req.body.utm_campaign }),
      ...(req.body.utm_term !== undefined && { utm_term: req.body.utm_term }),
      ...(req.body.utm_content !== undefined && { utm_content: req.body.utm_content }),
      ...(req.body.gclid !== undefined && { gclid: req.body.gclid }),
      ...(req.body.fbclid !== undefined && { fbclid: req.body.fbclid })
    },
    updatedAt: new Date().toISOString()
  };

  if (await updateLead(req.params.id, updateData)) {
    const updatedLead = await getLead(req.params.id);
    return HttpResponses.success(res, updatedLead, 200);
  } else {
    return HttpResponses.error(res, new Error('Erro ao atualizar lead'), 500);
  }
});

// DELETE /api/leads/:id - Deletar lead (apenas admin pode deletar)
router.delete('/:id', authenticateToken, Permissions.requireAdmin, async (req, res) => {
  const deletedLead = await deleteLead(req.params.id);

  if (deletedLead) {
    return HttpResponses.success(res, { message: 'Lead deletado com sucesso' });
  } else {
    return HttpResponses.error(res, new Error('Lead não encontrado'), 404);
  }
});

// GET /api/leads/export/csv - Exportar leads em CSV, qualquer um com permissao de exportacao pode exportar
router.get('/export/csv', authenticateToken, Permissions.checkPermissionExport, async (req, res) => {
  try {
    const leads = await getLeads();

    if (leads.length === 0) {
      return HttpResponses.error(res, new Error('Nenhum lead encontrado para exportar'), 404);
    }

    // Preparar dados CSV
    const csvData = leads.map(lead => ({
      nome: lead.nome,
      email: lead.email,
      telefone: lead.telefone,
      cargo: lead.cargo,
      dataNascimento: lead.dataNascimento,
      mensagem: lead.mensagem,
      utm_source: lead.tracking?.utm_source || '',
      utm_medium: lead.tracking?.utm_medium || '',
      utm_campaign: lead.tracking?.utm_campaign || '',
      utm_term: lead.tracking?.utm_term || '',
      utm_content: lead.tracking?.utm_content || '',
      gclid: lead.tracking?.gclid || '',
      fbclid: lead.tracking?.fbclid || '',
      createdAt: lead.createdAt
    }));

    // Criar cabeçalho CSV
    const headers = [
      'Nome',
      'Email', 
      'Telefone',
      'Cargo',
      'Data de Nascimento',
      'Mensagem',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'UTM Term',
      'UTM Content',
      'GCLID',
      'FBCLID',
      'Data de Criação'
    ];

    // Converter para CSV
    let csvContent = headers.join(',') + '\n';
    
    csvData.forEach(lead => {
      const row = [
        `"${lead.nome}"`,
        `"${lead.email}"`,
        `"${lead.telefone}"`,
        `"${lead.cargo}"`,
        `"${lead.dataNascimento}"`,
        `"${lead.mensagem.replace(/"/g, '""')}"`, // Escapar aspas duplas
        `"${lead.utm_source}"`,
        `"${lead.utm_medium}"`,
        `"${lead.utm_campaign}"`,
        `"${lead.utm_term}"`,
        `"${lead.utm_content}"`,
        `"${lead.gclid}"`,
        `"${lead.fbclid}"`,
        `"${lead.createdAt}"`
      ];
      csvContent += row.join(',') + '\n';
    });

    // Configurar headers para download
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.setHeader('Cache-Control', 'no-cache');
    
    // Enviar CSV
    res.send(csvContent);
    
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    return HttpResponses.error(res, new Error('Erro interno do servidor'), 500);
  }
});

// GET /api/leads/limited - Listar leads com informações limitadas (apenas operador)
router.get('/limited', authenticateToken, Permissions.checkPermissionRead, validateQuery(querySchema), async (req, res) => {

  let leads = await getLeads();

  // Aplicar filtro de busca
  const search = req.query.search;
  if (search) {
    const searchLower = search.toLowerCase();
    leads = leads.filter(lead =>
      lead.nome.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower)
    );
  }

  // Ordenar por data de criação (mais recentes primeiro)
  leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Paginação
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedLeads = leads.slice(startIndex, endIndex);

  // Filtrar informações sensíveis para operadores
  const limitedLeads = paginatedLeads.map(lead => ({
    id: lead.id,
    nome: lead.nome,
    email: lead.email,
    telefone: lead.telefone,
    cargo: lead.cargo,
    createdAt: lead.createdAt
    // Não incluir: dataNascimento, mensagem, tracking
  }));

  return HttpResponses.success(res, {
    leads: limitedLeads,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(leads.length / limit),
      totalItems: leads.length,
      itemsPerPage: limit
    }
  });
});

// GET /api/leads/limited/:id - Obter lead limitado por ID (apenas operador)
router.get('/limited/:id', authenticateToken, Permissions.checkPermissionRead, async (req, res) => {

  const lead = await getLead(req.params.id);

  if (!lead) {
    return HttpResponses.error(res, new Error('Lead não encontrado'), 404);
  }

  // Filtrar informações sensíveis para operadores
  const limitedLead = {
    id: lead.id,
    nome: lead.nome,
    email: lead.email,
    telefone: lead.telefone,
    cargo: lead.cargo,
    createdAt: lead.createdAt
    // Não incluir: dataNascimento, mensagem, tracking
  };

  return HttpResponses.success(res, limitedLead);

});

module.exports = router;
