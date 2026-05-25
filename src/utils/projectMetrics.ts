import type { ProjectCost, ProjectRisk, ProjectTask, RiskStrategy } from "../types/project";

export function getProjectMetrics(tasks: ProjectTask[], costs: ProjectCost[]) {
  const totalCost = costs.reduce((sum, cost) => sum + cost.value, 0);
  const doneTasks = tasks.filter((task) => task.status === "Concluído").length;
  const activeTasks = tasks.filter((task) => task.status === "Em andamento").length;
  const pendingTasks = tasks.filter((task) => task.status === "Pendente").length;
  const donePercent = Math.round((doneTasks / tasks.length) * 100);

  return {
    totalCost,
    doneTasks,
    activeTasks,
    pendingTasks,
    donePercent,
    totalTasks: tasks.length,
  };
}

export function countRisksByStrategy(risks: ProjectRisk[]) {
  return risks.reduce<Record<RiskStrategy, number>>(
    (acc, risk) => {
      acc[risk.strategy] += 1;
      return acc;
    },
    {
      Prevenir: 0,
      Mitigar: 0,
      Transferir: 0,
      Aceitar: 0,
    },
  );
}
