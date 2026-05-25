import {
  Activity,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Layers3,
  ShieldAlert,
  Target,
} from "lucide-react";
import type { NavigationItem, ProjectSectionId } from "../types/project";

export const navigation: NavigationItem[] = [
  { id: "inicio", label: "Início", icon: Activity },
  { id: "problema", label: "Problema", icon: Target },
  { id: "eap", label: "EAP", icon: Layers3 },
  { id: "cronograma", label: "Cronograma", icon: CalendarDays },
  { id: "riscos", label: "Riscos", icon: ShieldAlert },
  { id: "custos", label: "Custos", icon: BarChart3 },
  { id: "resultados", label: "Resultados", icon: CheckCircle2 },
];

export const sectionIds = navigation.map((item) => item.id) as ProjectSectionId[];
