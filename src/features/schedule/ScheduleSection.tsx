import { useState } from "react";
import { KanbanSquare, Rows3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SegmentedControl } from "../../components/ui/SegmentedControl";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { GanttChart } from "./components/GanttChart";
import { TrelloBoard } from "./components/TrelloBoard";

type ScheduleView = "trello" | "gantt";

const viewOptions = [
  { icon: KanbanSquare, label: "Trello", value: "trello" },
  { icon: Rows3, label: "Gantt", value: "gantt" },
] satisfies Array<{ icon: LucideIcon; label: string; value: ScheduleView }>;

export function ScheduleSection() {
  const [view, setView] = useState<ScheduleView>("trello");

  return (
    <section id="cronograma" className="scroll-mt-28">
      <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <SectionHeader
          tag="Tempo e cronograma"
          title="Visualização em quadro e Gantt"
          text="As tarefas da EAP foram aplicadas em uma visualização prática para acompanhar status, datas e andamento."
        />
        <SegmentedControl label="Alternar visualização do cronograma" value={view} options={viewOptions} onChange={setView} />
      </div>

      {view === "trello" ? <TrelloBoard /> : <GanttChart />}
    </section>
  );
}
