import type {
  Equipment,
  EquipmentStatus,
  ISODateString,
  MaintenanceState,
  PreventivePlan,
  WorkOrder,
  WorkOrderStatus,
} from "../types/maintenance";

export function parseLocalDate(date: ISODateString) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toISODate(date: Date): ISODateString {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}` as ISODateString;
}

export function addDays(date: ISODateString, days: number): ISODateString {
  const nextDate = parseLocalDate(date);
  nextDate.setDate(nextDate.getDate() + days);
  return toISODate(nextDate);
}

export function getTodayISO(): ISODateString {
  return toISODate(new Date());
}

export function isPastDue(date: ISODateString, today = getTodayISO()) {
  return parseLocalDate(date).getTime() < parseLocalDate(today).getTime();
}

export function isDueSoon(date: ISODateString, days = 7, today = getTodayISO()) {
  const due = parseLocalDate(date).getTime();
  const start = parseLocalDate(today).getTime();
  const end = start + days * 86_400_000;
  return due >= start && due <= end;
}

export function getEquipmentStatusCounts(equipments: Equipment[]) {
  return equipments.reduce(
    (acc, equipment) => {
      acc[equipment.status] += 1;
      return acc;
    },
    {
      Operacional: 0,
      Atenção: 0,
      Manutenção: 0,
      Parado: 0,
    } satisfies Record<EquipmentStatus, number>,
  );
}

export function getOrderStatusCounts(workOrders: WorkOrder[]) {
  return workOrders.reduce(
    (acc, order) => {
      acc[order.status] += 1;
      return acc;
    },
    {
      Aberta: 0,
      "Em execução": 0,
      "Aguardando peça": 0,
      Concluída: 0,
      Cancelada: 0,
    } satisfies Record<WorkOrderStatus, number>,
  );
}

export function getMaintenanceMetrics(state: MaintenanceState) {
  const today = getTodayISO();
  const openOrders = state.workOrders.filter(
    (order) => order.status !== "Concluída" && order.status !== "Cancelada",
  );
  const overdueOrders = openOrders.filter((order) => isPastDue(order.dueDate, today));
  const dueSoonPlans = state.preventivePlans.filter(
    (plan) => plan.active && isDueSoon(plan.nextDue, 7, today),
  );
  const overduePlans = state.preventivePlans.filter(
    (plan) => plan.active && isPastDue(plan.nextDue, today),
  );
  const criticalEquipments = state.equipments.filter(
    (equipment) => equipment.criticality === "Crítica",
  );
  const activePlans = state.preventivePlans.filter((plan) => plan.active);
  const compliantPlans = activePlans.filter((plan) => !isPastDue(plan.nextDue, today));
  const preventiveCompliance = activePlans.length
    ? Math.round((compliantPlans.length / activePlans.length) * 100)
    : 100;
  const monthlyCost = state.workOrders
    .filter((order) => order.openedAt.slice(0, 7) === today.slice(0, 7))
    .reduce((total, order) => total + order.estimatedCost, 0);

  return {
    today,
    totalEquipments: state.equipments.length,
    equipmentStatusCounts: getEquipmentStatusCounts(state.equipments),
    orderStatusCounts: getOrderStatusCounts(state.workOrders),
    openOrders: openOrders.length,
    overdueOrders: overdueOrders.length,
    dueSoonPlans: dueSoonPlans.length,
    overduePlans: overduePlans.length,
    criticalEquipments: criticalEquipments.length,
    preventiveCompliance,
    monthlyCost,
  };
}

export function getEquipmentName(equipments: Equipment[], equipmentId: string) {
  return equipments.find((equipment) => equipment.id === equipmentId)?.name ?? "Equipamento removido";
}

export function sortByDate<T>(items: T[], getDate: (item: T) => ISODateString) {
  return [...items].sort(
    (first, second) => parseLocalDate(getDate(first)).getTime() - parseLocalDate(getDate(second)).getTime(),
  );
}

export function getPlanHealth(plan: PreventivePlan, today = getTodayISO()) {
  if (isPastDue(plan.nextDue, today)) return "Atrasada";
  if (isDueSoon(plan.nextDue, 7, today)) return "Próxima";
  return "Em dia";
}
