import type { ProjectStatus, RiskStrategy } from "../types/project";

export const statusClasses: Record<ProjectStatus, string> = {
  Concluído: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "Em andamento": "bg-amber-50 text-amber-800 ring-amber-200",
  Pendente: "bg-rose-50 text-rose-700 ring-rose-200",
};

export const strategyClasses: Record<RiskStrategy, string> = {
  Prevenir: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Mitigar: "bg-amber-50 text-amber-800 ring-amber-200",
  Transferir: "bg-violet-50 text-violet-700 ring-violet-200",
  Aceitar: "bg-rose-50 text-rose-700 ring-rose-200",
};
