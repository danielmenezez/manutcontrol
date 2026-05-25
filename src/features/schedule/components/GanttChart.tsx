import { Badge } from "../../../components/ui/Badge";
import { projectTasks } from "../../../data/project";
import { statusClasses } from "../../../utils/badgeStyles";
import { daysBetween, formatDate, parseProjectDate } from "../../../utils/formatters";

const barClasses = {
  Concluído: "bg-emerald-500 text-white",
  "Em andamento": "bg-amber-400 text-amber-950",
  Pendente: "bg-rose-500 text-white",
};

export function GanttChart() {
  const startDates = projectTasks.map((task) => parseProjectDate(task.start).getTime());
  const endDates = projectTasks.map((task) => parseProjectDate(task.end).getTime());
  const minDate = new Date(Math.min(...startDates));
  const maxDate = new Date(Math.max(...endDates));
  const totalDays = Math.max(1, daysBetween(minDate, maxDate) + 1);

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 shadow-panel">
      <div className="grid min-w-[1060px] grid-cols-[250px_112px_112px_112px_1fr] gap-3 rounded-lg bg-ink p-3 text-sm font-black text-white">
        <span>Atividade</span>
        <span>Status</span>
        <span>Início</span>
        <span>Fim</span>
        <span>Linha do tempo</span>
      </div>

      <div className="min-w-[1060px]">
        {projectTasks.map((task) => {
          const startDate = parseProjectDate(task.start);
          const endDate = parseProjectDate(task.end);
          const left = Math.max(0, (daysBetween(minDate, startDate) / totalDays) * 100);
          const width = Math.max(8, ((daysBetween(startDate, endDate) + 1) / totalDays) * 100);

          return (
            <div
              key={task.title}
              className="grid grid-cols-[250px_112px_112px_112px_1fr] items-center gap-3 border-b border-slate-200 py-3 last:border-b-0"
            >
              <strong className="text-sm text-slate-950">{task.title}</strong>
              <Badge className={statusClasses[task.status]}>{task.status}</Badge>
              <span className="text-sm text-slate-500">{formatDate(task.start)}</span>
              <span className="text-sm text-slate-500">{formatDate(task.end)}</span>
              <div className="relative h-8 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                <i
                  className={`absolute top-0 flex h-full min-w-20 items-center justify-center overflow-hidden whitespace-nowrap rounded-md px-2 text-[11px] font-black not-italic ${barClasses[task.status]}`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  title={`${task.title}: ${formatDate(task.start)} a ${formatDate(task.end)}`}
                >
                  {task.status}
                </i>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
