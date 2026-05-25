import { AppShell } from "../components/layout/AppShell";
import { sectionIds } from "./navigation";
import { CostSection } from "../features/costs/CostSection";
import { EapSection } from "../features/eap/EapSection";
import { OverviewSection } from "../features/overview/OverviewSection";
import { ProblemSection } from "../features/problem/ProblemSection";
import { ResultsSection } from "../features/results/ResultsSection";
import { RiskSection } from "../features/risks/RiskSection";
import { ScheduleSection } from "../features/schedule/ScheduleSection";
import { useActiveSection } from "../hooks/useActiveSection";
import type { ProjectSectionId } from "../types/project";

export default function App() {
  const activeSection = useActiveSection(sectionIds, "inicio");

  function navigateTo(section: ProjectSectionId) {
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <AppShell activeSection={activeSection} onNavigate={navigateTo}>
      <div className="space-y-10">
        <OverviewSection />
        <ProblemSection />
        <EapSection />
        <ScheduleSection />
        <RiskSection />
        <CostSection />
        <ResultsSection />
      </div>
    </AppShell>
  );
}
