import { projectInfo, projectResults } from "../../data/project";
import { SectionHeader } from "../../components/ui/SectionHeader";

export function ResultsSection() {
  return (
    <section id="resultados" className="scroll-mt-28">
      <SectionHeader
        tag="Resultados e indicadores"
        title="Um protótipo alinhado ao planejamento"
        text="Os resultados mostram que o escopo foi aplicado em uma visão de projeto com cronograma, riscos, custos e indicadores de gestão."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {projectResults.map((result) => {
          const Icon = result.icon;

          return (
            <article key={result.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <Icon size={20} />
              </div>
              <h3 className="mt-4 font-black text-slate-950">{result.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{result.text}</p>
            </article>
          );
        })}
      </div>

      <article className="mt-4 rounded-lg border border-slate-200 bg-white p-6 shadow-panel">
        <h3 className="text-xl font-black text-slate-950">Aprovação formal</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <span className="text-xs font-black uppercase text-slate-500">Patrocinador</span>
            <p className="mt-1 font-black text-slate-950">{projectInfo.sponsor}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <span className="text-xs font-black uppercase text-slate-500">Gerente do Projeto</span>
            <p className="mt-1 font-black text-slate-950">{projectInfo.manager}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <span className="text-xs font-black uppercase text-slate-500">Data de aprovação</span>
            <p className="mt-1 font-black text-slate-950">____ / ____ / ________</p>
          </div>
        </div>
      </article>
    </section>
  );
}
