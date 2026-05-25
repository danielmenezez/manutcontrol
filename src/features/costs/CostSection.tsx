import { BarChart3 } from "lucide-react";
import { MetricCard } from "../../components/ui/MetricCard";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { projectCosts } from "../../data/project";
import { formatCurrency } from "../../utils/formatters";

export function CostSection() {
  const totalCost = projectCosts.reduce((sum, cost) => sum + cost.value, 0);
  const paidItems = projectCosts.filter((cost) => cost.value > 0).length;

  return (
    <section id="custos" className="scroll-mt-28">
      <SectionHeader
        tag="Custo e recursos"
        title="Custos fictícios e recursos utilizados"
        text="Mesmo sendo acadêmico, o projeto considera custos indiretos para simular melhor a gestão de recursos."
      />

      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <MetricCard icon={BarChart3} label="Total estimado" value={formatCurrency(totalCost)} text="Somatório dos recursos planejados" tone="blue" />
        <MetricCard icon={BarChart3} label="Itens com custo" value={String(paidItems)} text="Despesas indiretas consideradas" tone="amber" />
        <MetricCard icon={BarChart3} label="Ferramentas" value="R$ 0,00" text="Uso de stack gratuita no protótipo" tone="emerald" />
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-panel">
        <table className="w-full min-w-[780px] border-collapse">
          <thead>
            <tr className="bg-ink text-white">
              <th className="p-4 text-left text-sm">Recurso / Despesa</th>
              <th className="p-4 text-left text-sm">Estimativa</th>
              <th className="p-4 text-left text-sm">Valor</th>
            </tr>
          </thead>
          <tbody>
            {projectCosts.map((cost) => (
              <tr key={cost.item} className="border-b border-slate-200 last:border-b-0">
                <td className="p-4 font-bold text-slate-950">{cost.item}</td>
                <td className="p-4 text-slate-600">{cost.estimate}</td>
                <td className="p-4 font-black text-slate-950">{formatCurrency(cost.value)}</td>
              </tr>
            ))}
            <tr className="bg-brand-50 font-black text-slate-950">
              <td className="p-4" colSpan={2}>
                Total estimado
              </td>
              <td className="p-4">{formatCurrency(totalCost)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
