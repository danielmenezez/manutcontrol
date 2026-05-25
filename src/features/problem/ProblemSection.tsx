import { smartGoals } from "../../data/project";
import { SectionHeader } from "../../components/ui/SectionHeader";

export function ProblemSection() {
  return (
    <section id="problema" className="scroll-mt-28">
      <SectionHeader
        tag="Problema de TI"
        title="Falta de organização no controle de manutenção"
        text="Muitas empresas ainda controlam manutenções com planilhas ou anotações manuais. Isso gera erros, atrasos, perda de histórico e dificuldade para acompanhar prioridades."
      />

      <div className="grid gap-4 xl:grid-cols-[.9fr_1.1fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-panel">
          <h3 className="text-xl font-black text-slate-950">Solução proposta</h3>
          <p className="mt-4 leading-7 text-slate-600">
            O ManutControl centraliza equipamentos, registros de manutenção e status em uma
            interface simples. A proposta reduz dependência de controles soltos e melhora a
            visibilidade para tomada de decisão.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <b className="text-2xl text-brand-700">01</b>
              <span className="mt-2 block text-sm font-bold text-slate-600">Cadastro de equipamentos</span>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <b className="text-2xl text-emerald-700">02</b>
              <span className="mt-2 block text-sm font-bold text-slate-600">Histórico de manutenções</span>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <b className="text-2xl text-amber-700">03</b>
              <span className="mt-2 block text-sm font-bold text-slate-600">Acompanhamento de status</span>
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-panel">
          <h3 className="mb-4 text-xl font-black text-slate-950">Objetivos SMART</h3>
          <div className="grid gap-3">
            {smartGoals.map((item) => (
              <div key={item.key} className="grid grid-cols-[48px_1fr] gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <b className="grid h-12 w-12 place-items-center rounded-lg bg-brand-50 text-lg text-brand-700 ring-1 ring-brand-100">
                  {item.key}
                </b>
                <div>
                  <strong className="text-slate-950">{item.title}</strong>
                  <span className="mt-1 block text-sm leading-6 text-slate-600">{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
