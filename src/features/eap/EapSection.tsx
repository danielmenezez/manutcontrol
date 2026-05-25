import { eapPhases } from "../../data/project";
import { SectionHeader } from "../../components/ui/SectionHeader";

export function EapSection() {
  return (
    <section id="eap" className="scroll-mt-28">
      <SectionHeader
        tag="Estrutura Analítica do Projeto"
        title="EAP organizada por fases"
        text="A estrutura divide o trabalho em partes menores, deixando o escopo mais fácil de planejar, acompanhar e validar."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {eapPhases.map((phase, index) => (
          <article key={phase.phase} className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-xl font-black text-slate-950">{phase.phase}</h3>
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-sm font-black text-brand-700 ring-1 ring-brand-100">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <ul className="space-y-2">
              {phase.tasks.map((task) => (
                <li key={task} className="flex gap-2 text-sm leading-6 text-slate-600">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-700" />
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
