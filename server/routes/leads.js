const express = require('express');
const { authenticateToken } = require('@/middleware/auth');
const Permissions = require('@/middleware/permissions');
const { leadSchema, querySchema, validateSchema, validateQuery } = require('@/schemas/validation');
const { 
  getLeads, 
  addLead, 
  getLeadById, 
  updateLead, 
  deleteLead 
} = require('@/database');
const { v4: uuidv4 } = require('uuid');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const XLSX = require('xlsx');
const path = require('path');

const router = express.Router();

// Validações para lead (agora usando Yup)
const leadValidation = validateSchema(leadSchema);

// GET /api/leads - Listar leads (admin e operador podem ver)
router.get('/', authenticateToken, Permissions.checkPermissionRead, validateQuery(querySchema), (req, res) => {
  try {

    let leads = getLeads();

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

    return success(res, { 
      leads: paginatedLeads,
      pagination 
    });

  } catch (err) {
    console.error('Erro ao listar leads:', err);
    return error(res, { message: 'Erro interno do servidor' }, 500);
  }
});

// POST /api/leads - Criar lead (público)
router.post('/', leadValidation, (req, res) => {
  try {

    // Verificar se email já existe
    const existingLead = getLeads().find(lead => lead.email === req.body.email);
    if (existingLead) {
      return error(res, { message: 'Email já cadastrado' }, 409);
    }

    // Criar novo lead
    const newLead = {
      id: uuidv4(),
      ...req.body,
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

    if (addLead(newLead)) {
      return success(res, newLead, 201);
    } else {
      return error(res, { message: 'Erro ao cadastrar lead' }, 500);
    }

  } catch (err) {
    console.error('Erro ao criar lead:', err);
    return error(res, { message: 'Erro interno do servidor' }, 500);
  }
});

// GET /api/leads/:id - Obter lead por ID (admin e operador podem ver)
router.get('/:id', authenticateToken, Permissions.checkPermissionRead, (req, res) => {
  try {
    const lead = getLeadById(req.params.id);
    
    if (!lead) {
      return notFoundResponse(res, 'Lead');
    }

    return successResponse(res, 200, 'Lead recuperado com sucesso', lead);

  } catch (error) {
    return internalErrorResponse(res, error, 'Erro ao obter lead');
  }
});

// PUT /api/leads/:id - Atualizar lead (apenas admin pode editar)
router.put('/:id', authenticateToken, Permissions.checkPermissionWrite, leadValidation, (req, res) => {
  try {

    const existingLead = getLeadById(req.params.id);
    if (!existingLead) {
      return notFoundResponse(res, 'Lead');
    }

    // Verificar se email já existe em outro lead
    const emailExists = getLeads().find(lead => 
      lead.email === req.body.email && lead.id !== req.params.id
    );
    if (emailExists) {
      return conflictResponse(res, 'Email já cadastrado em outro lead');
    }

    // Preparar dados para atualização
    const updateData = {
      ...req.body,
      tracking: {
        utm_source: req.body.utm_source || existingLead.tracking.utm_source,
        utm_medium: req.body.utm_medium || existingLead.tracking.utm_medium,
        utm_campaign: req.body.utm_campaign || existingLead.tracking.utm_campaign,
        utm_term: req.body.utm_term || existingLead.tracking.utm_term,
        utm_content: req.body.utm_content || existingLead.tracking.utm_content,
        gclid: req.body.gclid || existingLead.tracking.gclid,
        fbclid: req.body.fbclid || existingLead.tracking.fbclid
      },
      updatedAt: new Date().toISOString()
    };
    
    if (updateLead(req.params.id, updateData)) {
      const updatedLead = getLeadById(req.params.id);
      return updatedResponse(res, updatedLead, 'Lead');
    } else {
      return errorResponse(res, 500, 'Erro ao atualizar lead');
    }

  } catch (error) {
    return internalErrorResponse(res, error, 'Erro ao atualizar lead');
  }
});

// DELETE /api/leads/:id - Deletar lead (apenas admin pode deletar)
router.delete('/:id', authenticateToken, Permissions.checkPermissionDelete, (req, res) => {
  try {
    const deletedLead = deleteLead(req.params.id);
    
    if (deletedLead) {
      return deletedResponse(res, deletedLead, 'Lead');
    } else {
      return notFoundResponse(res, 'Lead');
    }

  } catch (error) {
    return internalErrorResponse(res, error, 'Erro ao deletar lead');
  }
});

// GET /api/leads/export/csv - Exportar leads em CSV (apenas admin pode exportar)
router.get('/export/csv', authenticateToken, Permissions.checkPermissionExport, (req, res) => {
  try {
    const leads = getLeads();

    if (leads.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nenhum lead encontrado para exportar'
      });
    }

    const csvWriter = createCsvWriter({
      path: path.join(__dirname, '../data/leads_export.csv'),
      header: [
        { id: 'nome', title: 'Nome' },
        { id: 'email', title: 'Email' },
        { id: 'telefone', title: 'Telefone' },
        { id: 'cargo', title: 'Cargo' },
        { id: 'dataNascimento', title: 'Data de Nascimento' },
        { id: 'mensagem', title: 'Mensagem' },
        { id: 'utm_source', title: 'UTM Source' },
        { id: 'utm_medium', title: 'UTM Medium' },
        { id: 'utm_campaign', title: 'UTM Campaign' },
        { id: 'utm_term', title: 'UTM Term' },
        { id: 'utm_content', title: 'UTM Content' },
        { id: 'gclid', title: 'GCLID' },
        { id: 'fbclid', title: 'FBCLID' },
        { id: 'createdAt', title: 'Data de Criação' }
      ]
    });

    const csvData = leads.map(lead => ({
      ...lead,
      utm_source: lead.tracking.utm_source,
      utm_medium: lead.tracking.utm_medium,
      utm_campaign: lead.tracking.utm_campaign,
      utm_term: lead.tracking.utm_term,
      utm_content: lead.tracking.utm_content,
      gclid: lead.tracking.gclid,
      fbclid: lead.tracking.fbclid
    }));

    csvWriter.writeRecords(csvData).then(() => {
      res.download(path.join(__dirname, '../data/leads_export.csv'), 'leads.csv');
    });

  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/leads/export/excel - Exportar leads em Excel (apenas admin pode exportar)
router.get('/export/excel', authenticateToken, Permissions.checkPermissionExport, (req, res) => {
  try {
    const leads = getLeads();

    if (leads.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nenhum lead encontrado para exportar'
      });
    }

    const excelData = leads.map(lead => ({
      Nome: lead.nome,
      Email: lead.email,
      Telefone: lead.telefone,
      Cargo: lead.cargo,
      'Data de Nascimento': lead.dataNascimento,
      Mensagem: lead.mensagem,
      'UTM Source': lead.tracking.utm_source,
      'UTM Medium': lead.tracking.utm_medium,
      'UTM Campaign': lead.tracking.utm_campaign,
      'UTM Term': lead.tracking.utm_term,
      'UTM Content': lead.tracking.utm_content,
      GCLID: lead.tracking.gclid,
      FBCLID: lead.tracking.fbclid,
      'Data de Criação': lead.createdAt
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');

    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.xlsx');
    res.send(excelBuffer);

  } catch (error) {
    console.error('Erro ao exportar Excel:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/leads/limited - Listar leads com informações limitadas (apenas operador)
router.get('/limited', authenticateToken, Permissions.checkPermissionRead, validateQuery(querySchema), (req, res) => {
  try {

    let leads = getLeads();

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

    res.json({
      success: true,
      data: {
        leads: limitedLeads,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(leads.length / limit),
          totalItems: leads.length,
          itemsPerPage: limit
        }
      }
    });

  } catch (error) {
    console.error('Erro ao listar leads limitados:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/leads/limited/:id - Obter lead limitado por ID (apenas operador)
router.get('/limited/:id', authenticateToken, Permissions.checkPermissionRead, (req, res) => {
  try {
    const lead = getLeadById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead não encontrado'
      });
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

    res.json({
      success: true,
      data: limitedLead
    });

  } catch (error) {
    console.error('Erro ao obter lead limitado:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
