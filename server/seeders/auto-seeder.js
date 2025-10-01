const { v4: uuidv4 } = require('uuid');

// Função para gerar data aleatória nos últimos 30 dias
const getRandomDate = () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  const randomTime = thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime());
  return new Date(randomTime).toISOString();
};

// Dados iniciais dos usuários
const INITIAL_USERS = [
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
];

// Dados iniciais dos leads
const INITIAL_LEADS = [
  {
    id: uuidv4(),
    nome: "Maria Silva Santos",
    email: "maria.silva@email.com",
    telefone: "(11) 98765-4321",
    cargo: "Desenvolvedora Frontend",
    dataNascimento: "1985-05-15",
    mensagem: "Tenho interesse em conhecer mais sobre as oportunidades de trabalho na área de desenvolvimento web. Possuo experiência com React e Vue.js.",
    tracking: {
      utm_source: "linkedin",
      utm_medium: "social",
      utm_campaign: "vagas_tech",
      utm_term: "desenvolvedor",
      utm_content: "post_vagas",
      gclid: null,
      fbclid: null
    },
    createdAt: getRandomDate(),
    updatedAt: getRandomDate()
  },
  {
    id: uuidv4(),
    nome: "João Pedro Oliveira",
    email: "joao.pedro@empresa.com.br",
    telefone: "(21) 99876-5432",
    cargo: "Analista de Sistemas",
    dataNascimento: "1992-08-22",
    mensagem: "Estou buscando uma nova oportunidade profissional na área de análise de sistemas. Tenho experiência com metodologias ágeis e gestão de projetos.",
    tracking: {
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "vagas_analista",
      utm_term: "analista sistemas",
      utm_content: "ad_texto",
      gclid: "Cj0KCQjw_5unBhD5ARIsAK2U7Z8",
      fbclid: null
    },
    createdAt: getRandomDate(),
    updatedAt: getRandomDate()
  },
  {
    id: uuidv4(),
    nome: "Ana Carolina Ferreira",
    email: "ana.carolina@outlook.com",
    telefone: "(31) 91234-5678",
    cargo: "UX/UI Designer",
    dataNascimento: "1988-12-03",
    mensagem: "Sou designer com foco em experiência do usuário e interface. Gostaria de saber mais sobre as vagas disponíveis na área de design.",
    tracking: {
      utm_source: "facebook",
      utm_medium: "social",
      utm_campaign: "design_vagas",
      utm_term: null,
      utm_content: "carousel_ads",
      gclid: null,
      fbclid: "IwAR1234567890abcdef"
    },
    createdAt: getRandomDate(),
    updatedAt: getRandomDate()
  },
  {
    id: uuidv4(),
    nome: "Carlos Eduardo Rodrigues",
    email: "carlos.rodrigues@tech.com",
    telefone: "(47) 98888-7777",
    cargo: "Desenvolvedor Full Stack",
    dataNascimento: "1990-03-18",
    mensagem: "Desenvolvedor com experiência em Node.js, React e Python. Interessado em oportunidades de trabalho remoto e projetos desafiadores.",
    tracking: {
      utm_source: "instagram",
      utm_medium: "social",
      utm_campaign: "tech_influencers",
      utm_term: "desenvolvedor",
      utm_content: "story_highlight",
      gclid: null,
      fbclid: null
    },
    createdAt: getRandomDate(),
    updatedAt: getRandomDate()
  },
  {
    id: uuidv4(),
    nome: "Fernanda Costa Lima",
    email: "fernanda.lima@startup.com",
    telefone: "(85) 95555-4444",
    cargo: "Product Manager",
    dataNascimento: "1987-09-25",
    mensagem: "Product Manager com experiência em startups e produtos digitais. Busco oportunidades para liderar produtos inovadores e impactantes.",
    tracking: {
      utm_source: "email",
      utm_medium: "newsletter",
      utm_campaign: "vagas_newsletter",
      utm_term: null,
      utm_content: "newsletter_jan_2024",
      gclid: null,
      fbclid: null
    },
    createdAt: getRandomDate(),
    updatedAt: getRandomDate()
  }
];

module.exports = {
  INITIAL_USERS,
  INITIAL_LEADS
};
