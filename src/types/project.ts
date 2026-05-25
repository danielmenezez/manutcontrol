import type { LucideIcon } from "lucide-react";

export type ProjectSectionId =
  | "inicio"
  | "problema"
  | "eap"
  | "cronograma"
  | "riscos"
  | "custos"
  | "resultados";

export type ProjectStatus = "Concluído" | "Em andamento" | "Pendente";

export type RiskStrategy = "Prevenir" | "Mitigar" | "Transferir" | "Aceitar";

export type ISODateString = `${number}-${number}-${number}`;

export interface NavigationItem {
  id: ProjectSectionId;
  label: string;
  icon: LucideIcon;
}

export interface ProjectInfo {
  name: string;
  title: string;
  course: string;
  periodStart: ISODateString;
  periodEnd: ISODateString;
  sponsor: string;
  manager: string;
  summary: string;
}

export interface TeamMember {
  role: string;
  name: string;
  desc: string;
}

export interface SmartGoal {
  key: string;
  title: string;
  text: string;
}

export interface EapPhase {
  phase: string;
  tasks: string[];
}

export interface ProjectTask {
  title: string;
  phase: string;
  start: ISODateString;
  end: ISODateString;
  status: ProjectStatus;
}

export interface ProjectRisk {
  risk: string;
  eap: string;
  strategy: RiskStrategy;
  action: string;
}

export interface ProjectCost {
  item: string;
  estimate: string;
  value: number;
}

export interface ProjectResult {
  title: string;
  text: string;
  icon: LucideIcon;
}
