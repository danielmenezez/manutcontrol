import { CalendarDays, Gauge, ListChecks, Users, Wrench } from "lucide-react";
import { MetricCard } from "../../components/ui/MetricCard";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { projectCosts, projectInfo, projectTasks, team } from "../../data/project";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { getProjectMetrics } from "../../utils/projectMetrics";

export function OverviewSection() {
  const metrics = getProjectMetrics(projectTasks, projectCosts);

  return (
    <section id="inicio" className="scroll-mt-28">
      <SectionHeader
        tag={projectInfo.course}
        title={`${projectInfo.name}: ${projectInfo.title}`}
        text={projectInfo.summary}
      />

      <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-panel">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500">Visão executiva</p>
              <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">
                Controle de manutenção com escopo, prazo, risco e custo visíveis.
              </h1>
              <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                O painel organiza as decisões de gestão do projeto em blocos claros: problema,
                objetivos SMART, EAP, cronograma, riscos, custos e resultados esperados.
              </p>
            </div>
            <div className="min-w-60 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-black uppercase text-slate-500">Período</div>
              <div className="mt-2 flex items-center gap-2 font-black text-slate-950">
                <CalendarDays size={18} className="text-brand-700" />
                {formatDate(projectInfo.periodStart)} a {formatDate(projectInfo.periodEnd)}
              </div>
              <div className="mt-4 text-xs font-black uppercase text-slate-500">Patrocinador</div>
              <div className="mt-1 font-bold text-slate-800">{projectInfo.sponsor}</div>
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-ink p-6 text-white shadow-panel">
          <p className="text-sm font-bold text-slate-300">Progresso do cronograma</p>
          <strong className="mt-2 block text-5xl font-black">{metrics.donePercent}%</strong>
          <div className="mt-5 h-3 overflow-hidden rounded-md bg-white/15">
            <div
              className="h-full rounded-md bg-emerald-400"
              style={{ width: `${metrics.donePercent}%` }}
            />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
            <div>
              <span className="block text-slate-300">Concluídas</span>
              <b className="text-xl">{metrics.doneTasks}</b>
            </div>
            <div>
              <span className="block text-slate-300">Em curso</span>
              <b className="text-xl">{metrics.activeTasks}</b>
            </div>
            <div>
              <span className="block text-slate-300">Pendentes</span>
              <b className="text-xl">{metrics.pendingTasks}</b>
            </div>
          </div>
        </article>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Wrench}
          label="Entregas principais"
          value="4"
          text="Sistema, cronograma, status e riscos"
          tone="blue"
        />
        <MetricCard icon={Users} label="Equipe" value="3" text="Daniel, Higor e Vinícius" tone="violet" />
        <MetricCard
          icon={ListChecks}
          label="Tarefas mapeadas"
          value={String(metrics.totalTasks)}
          text="Atividades conectadas à EAP"
          tone="emerald"
        />
        <MetricCard
          icon={Gauge}
          label="Custo estimado"
          value={formatCurrency(metrics.totalCost)}
          text="Custos fictícios e indiretos"
          tone="amber"
        />
      </div>

      <article className="mt-4 rounded-lg border border-slate-200 bg-white p-6 shadow-panel">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-brand-700">Equipe</p>
            <h2 className="text-2xl font-black text-slate-950">Responsabilidades do projeto</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-500">
            Papéis definidos para manter decisão, execução técnica e validação bem distribuídas.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {team.map((member) => (
            <div key={`${member.role}-${member.name}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <span className="text-xs font-black uppercase text-brand-700">{member.role}</span>
              <h3 className="mt-2 font-black text-slate-950">{member.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{member.desc}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
