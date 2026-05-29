import type { LucideIcon } from "lucide-react";

export type MaintenanceSectionId =
  | "dashboard"
  | "equipamentos"
  | "ordens"
  | "preventivas"
  | "relatorios";

export type ISODateString = `${number}-${number}-${number}`;

export type EquipmentStatus = "Operacional" | "Atenção" | "Manutenção" | "Parado";
export type Criticality = "Baixa" | "Média" | "Alta" | "Crítica";
export type MaintenanceType = "Preventiva" | "Corretiva" | "Inspeção" | "Calibração";
export type WorkOrderPriority = "Baixa" | "Média" | "Alta" | "Urgente";
export type WorkOrderStatus =
  | "Aberta"
  | "Em execução"
  | "Aguardando peça"
  | "Concluída"
  | "Cancelada";

export interface NavigationItem {
  id: MaintenanceSectionId;
  label: string;
  icon: LucideIcon;
}

export interface Equipment {
  id: string;
  tag: string;
  name: string;
  category: string;
  location: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  criticality: Criticality;
  status: EquipmentStatus;
  lastMaintenance: ISODateString;
  nextMaintenance: ISODateString;
  responsible: string;
  notes: string;
}

export interface WorkOrder {
  id: string;
  equipmentId: string;
  title: string;
  type: MaintenanceType;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  openedAt: ISODateString;
  dueDate: ISODateString;
  closedAt?: ISODateString;
  technician: string;
  estimatedCost: number;
  description: string;
  actions: string;
}

export interface PreventivePlan {
  id: string;
  equipmentId: string;
  task: string;
  frequencyDays: number;
  nextDue: ISODateString;
  responsible: string;
  active: boolean;
}

export interface MaintenanceState {
  equipments: Equipment[];
  workOrders: WorkOrder[];
  preventivePlans: PreventivePlan[];
}

export type EquipmentFormData = Omit<Equipment, "id">;
export type WorkOrderFormData = Omit<WorkOrder, "id" | "closedAt" | "status" | "openedAt">;
export type PreventivePlanFormData = Omit<PreventivePlan, "id" | "active">;
