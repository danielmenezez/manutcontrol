import {
  ClipboardList,
  Gauge,
  LineChart,
  RotateCcw,
  Wrench,
} from "lucide-react";
import type { MaintenanceSectionId, NavigationItem } from "../types/maintenance";

export const navigation: NavigationItem[] = [
  { id: "dashboard", label: "Painel", icon: Gauge },
  { id: "equipamentos", label: "Equipamentos", icon: Wrench },
  { id: "ordens", label: "Ordens", icon: ClipboardList },
  { id: "preventivas", label: "Preventivas", icon: RotateCcw },
  { id: "relatorios", label: "Relatórios", icon: LineChart },
];

export const sectionIds = navigation.map((item) => item.id) as MaintenanceSectionId[];
