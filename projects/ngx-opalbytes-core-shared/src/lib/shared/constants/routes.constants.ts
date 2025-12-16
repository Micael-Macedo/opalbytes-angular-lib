export const ROUTES = {
  HOME: {
    path: "",
    title: "Home - OPALBYTES EAD",
  },
  CATALOGO: {
    path: "catalogo",
    title: "Catálogo de Cursos",
  },
  CURSO_ATUALIZACAO_CNH: {
    path: "curso/atualizacao-cnh",
    title: "Curso: Atualização CNH",
  },
  CURSO_RECICLAGEM_CONDUTORES: {
    path: "curso/reciclagem-condutores-infratores",
    title: "Curso: Reciclagem de Condutores",
  },
  CURSO_PREVENTIVO_RECICLAGEM: {
    path: "curso/preventivo-reciclagem",
    title: "Curso: Preventivo Reciclagem",
  },
  CURSO_ESPECIALIZADOS: {
    path: "curso/especializados-capacitacao",
    title: "Cursos Especializados",
  },
  HOMOLOGACAO: {
    path: "homologacao/",
    title: "Informações de Homologação",
  },
  VALIDAR_CERTIFICADO: {
    path: "validar-certificado",
    title: "Validar Certificado",
  },
  AJUDA: {
    path: "ajuda",
    title: "Ajuda",
  },
  PRE_INSCRICAO: {
    path: "pre-inscricao",
    title: "Pré-inscrição",
  },
  PRE_INSCRICAO_CONFIRMADA: {
    path: "pre-inscricao-confirmada",
    title: "Pré-inscrição Confirmada",
  },
  LOGIN: {
    path: "login",
    title: "Login",
  },
  CADASTRO_ALUNO: {
    path: "cadastro-aluno",
    title: "Cadastro de Aluno",
  },
} as const;

export type RouteKey = keyof typeof ROUTES;
