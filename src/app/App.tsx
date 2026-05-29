import { AppShell } from "../components/layout/AppShell";
import { MaintenanceWorkspace } from "../features/maintenance/MaintenanceWorkspace";
import { useActiveSection } from "../hooks/useActiveSection";
import type { MaintenanceSectionId } from "../types/maintenance";
import { sectionIds } from "./navigation";

export default function App() {
  const activeSection = useActiveSection(sectionIds, "dashboard");

  function navigateTo(section: MaintenanceSectionId) {
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <AppShell activeSection={activeSection} onNavigate={navigateTo}>
      <MaintenanceWorkspace />
    </AppShell>
  );
}
