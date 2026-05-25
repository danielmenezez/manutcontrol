import { Badge } from "../../../components/ui/Badge";
import { projectTasks } from "../../../data/project";
import { formatDate } from "../../../utils/formatters";
import { statusClasses } from "../../../utils/badgeStyles";

export function TrelloBoard() {
  const phases = [...new Set(projectTasks.map((task) => task.phase))];

  return (
    <div className="flex gap-4 overflow-x-auto pb-3">
      {phases.map((phase) => {
        const phaseTasks = projectTasks.filter((task) => task.phase === phase);

        return (
          <article key={phase} className="min-w-72 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-black text-slate-950">{phase}</h3>
              <span className="rounded-md bg-white px-2 py-1 text-xs font-black text-slate-500 ring-1 ring-slate-200">
                {phaseTasks.length}
              </span>
            </div>

            <div className="space-y-3">
              {phaseTasks.map((task) => (
                <div key={task.title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <Badge className={statusClasses[task.status]}>{task.status}</Badge>
                  <h4 className="mt-3 font-black text-slate-950">{task.title}</h4>
                  <p className="mt-2 text-sm text-slate-500">Entrega: {formatDate(task.end)}</p>
                </div>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
