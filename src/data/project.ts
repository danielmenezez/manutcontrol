import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  FileText,
} from "lucide-react";
import type {
  EapPhase,
  ProjectCost,
  ProjectInfo,
  ProjectResult,
  ProjectRisk,
  ProjectTask,
  SmartGoal,
  TeamMember,
} from "../types/project";

export const projectInfo: ProjectInfo = {
  name: "ManutControl",
  title: "Sistema de Controle de Manutenção de Equipamentos",
  course: "FATEC Campinas - Gestão de TI",
  periodStart: "2026-03-01",
  periodEnd: "2026-04-25",
  sponsor: "Alessandre Ferreira",
  manager: "Daniel Menezes",
  summary:
    "Projeto acadêmico criado para organizar equipamentos, registrar manutenções, acompanhar status e transformar a EAP em um cronograma visual.",
};

export const team: TeamMember[] = [
  {
    role: "Gerente do Projeto",
    name: "Daniel Menezes",
    desc: "Coordena planejamento, prazos, entregas e alinhamento do projeto.",
  },
  {
    role: "Scrum Master",
    name: "Daniel Menezes",
    desc: "Organiza o time, remove impedimentos e apoia o uso do Scrum.",
  },
  {
    role: "Líder Técnico",
    name: "Higor Moraes Maciel",
    desc: "Cuida da integridade arquitetural e liderança técnica.",
  },
  {
    role: "Analista de QA",
    name: "Vinícius Bazani",
    desc: "Responsável pelos testes e validação do sistema.",
  },
  {
    role: "Product Owner",
    name: "Daniel Menezes",
    desc: "Define requisitos e prioriza o backlog.",
  },
];

export const smartGoals: SmartGoal[] = [
  {
    key: "S",
    title: "Específico",
    text: "Criar um sistema web para controle de manutenção.",
  },
  {
    key: "M",
    title: "Mensurável",
    text: "Permitir cadastro de equipamentos e registro de manutenções.",
  },
  {
    key: "A",
    title: "Atingível",
    text: "Usar HTML, CSS, JavaScript, React e estrutura simples de dados.",
  },
  {
    key: "R",
    title: "Relevante",
    text: "Melhorar a organização e reduzir falhas no controle de manutenção.",
  },
  {
    key: "T",
    title: "Temporal",
    text: "Executar o projeto entre 01/03/2026 e 25/04/2026.",
  },
];

export const eapPhases: EapPhase[] = [
  {
    phase: "Iniciação",
    tasks: [
      "Definição de Escopo",
      "Identificação de Stakeholders",
      "Levantamento de Requisitos",
      "Termo de Abertura",
    ],
  },
  {
    phase: "Planejamento",
    tasks: [
      "Planejamento de Escopo",
      "Cronograma e Recursos",
      "Análise de Riscos",
      "Arquitetura e Banco de Dados",
    ],
  },
  {
    phase: "Desenvolvimento",
    tasks: [
      "Backend: lógica, APIs e dados",
      "Frontend: interface e dashboards",
      "Funcionalidades principais",
    ],
  },
  {
    phase: "Testes",
    tasks: [
      "Testes unitários",
      "Testes de integração",
      "Testes de usabilidade",
      "Correção de erros",
    ],
  },
  {
    phase: "Implantação",
    tasks: [
      "Configuração do ambiente",
      "Publicação do sistema",
      "Organização de dados",
      "Treinamento dos usuários",
    ],
  },
  {
    phase: "Encerramento",
    tasks: ["Validação final", "Entrega do projeto", "Documentação", "Lições aprendidas"],
  },
];

export const projectTasks: ProjectTask[] = [
  {
    title: "Definição de Escopo",
    phase: "Iniciação",
    start: "2026-03-01",
    end: "2026-03-05",
    status: "Concluído",
  },
  {
    title: "Stakeholders",
    phase: "Iniciação",
    start: "2026-03-03",
    end: "2026-03-06",
    status: "Concluído",
  },
  {
    title: "Levantamento de Requisitos",
    phase: "Iniciação",
    start: "2026-03-05",
    end: "2026-03-08",
    status: "Concluído",
  },
  {
    title: "Cronograma e Recursos",
    phase: "Planejamento",
    start: "2026-03-10",
    end: "2026-03-14",
    status: "Concluído",
  },
  {
    title: "Análise de Riscos",
    phase: "Planejamento",
    start: "2026-03-14",
    end: "2026-03-16",
    status: "Concluído",
  },
  {
    title: "Backend e Banco de Dados",
    phase: "Desenvolvimento",
    start: "2026-03-18",
    end: "2026-03-25",
    status: "Em andamento",
  },
  {
    title: "Frontend e Dashboards",
    phase: "Desenvolvimento",
    start: "2026-03-24",
    end: "2026-04-01",
    status: "Em andamento",
  },
  {
    title: "Funcionalidades Principais",
    phase: "Desenvolvimento",
    start: "2026-04-01",
    end: "2026-04-06",
    status: "Pendente",
  },
  {
    title: "Testes e Correções",
    phase: "Testes",
    start: "2026-04-07",
    end: "2026-04-14",
    status: "Pendente",
  },
  {
    title: "Implantação",
    phase: "Implantação",
    start: "2026-04-15",
    end: "2026-04-19",
    status: "Pendente",
  },
  {
    title: "Documentação e Entrega",
    phase: "Encerramento",
    start: "2026-04-20",
    end: "2026-04-25",
    status: "Pendente",
  },
];

export const projectRisks: ProjectRisk[] = [
  {
    risk: "Dificuldade na integração entre frontend e backend",
    eap: "Desenvolvimento do Sistema",
    strategy: "Mitigar",
    action:
      "Fazer testes de integração durante o desenvolvimento, evitando descobrir erros apenas no final.",
  },
  {
    risk: "Problemas na configuração do ambiente ou hospedagem",
    eap: "Implantação",
    strategy: "Prevenir",
    action:
      "Testar o ambiente antes da entrega e manter uma segunda opção de hospedagem.",
  },
  {
    risk: "Erro ou perda de dados no banco",
    eap: "Banco de Dados",
    strategy: "Prevenir",
    action: "Organizar bem a estrutura de dados e manter cópias de segurança.",
  },
  {
    risk: "Falta de conhecimento técnico em alguma tecnologia",
    eap: "Desenvolvimento do Sistema",
    strategy: "Mitigar",
    action:
      "Dividir tarefas conforme conhecimento do grupo e pesquisar soluções quando necessário.",
  },
  {
    risk: "Dependência de ferramenta externa de hospedagem",
    eap: "Infraestrutura",
    strategy: "Transferir",
    action:
      "Parte do risco fica ligada ao serviço usado, então é importante ter outra alternativa.",
  },
  {
    risk: "Interface incompleta ou pouco intuitiva",
    eap: "Frontend",
    strategy: "Aceitar",
    action:
      "Melhorias visuais podem ficar para versão futura, desde que o sistema funcione.",
  },
];

export const projectCosts: ProjectCost[] = [
  {
    item: "Transporte para reuniões presenciais",
    estimate: "3 integrantes x R$ 12,00 x 6 encontros",
    value: 216,
  },
  {
    item: "Alimentação em reunião/apresentação",
    estimate: "3 integrantes x R$ 20,00 x 4 dias",
    value: 240,
  },
  {
    item: "Internet e energia elétrica",
    estimate: "Uso doméstico durante desenvolvimento",
    value: 120,
  },
  {
    item: "Tempo de trabalho dos integrantes",
    estimate: "3 integrantes x 25 horas x R$ 15,00/hora",
    value: 1125,
  },
  {
    item: "Ferramentas de desenvolvimento",
    estimate: "React, navegador e editor de código",
    value: 0,
  },
  {
    item: "Hospedagem do protótipo",
    estimate: "Uso de ambiente gratuito/local",
    value: 0,
  },
];

export const projectResults: ProjectResult[] = [
  {
    icon: CheckCircle2,
    title: "Integração com o escopo",
    text: "As principais fases da EAP foram representadas no cronograma visual.",
  },
  {
    icon: ClipboardList,
    title: "Boas práticas",
    text: "Planejar antes de desenvolver ajudou a organizar tarefas, riscos e entregas.",
  },
  {
    icon: AlertTriangle,
    title: "Pontos de atenção",
    text: "Evitar testes só no final e não aumentar o escopo sem avaliar impacto.",
  },
  {
    icon: FileText,
    title: "Lição aprendida",
    text: "Ferramentas visuais como Trello e Gantt facilitam bastante o acompanhamento.",
  },
];
