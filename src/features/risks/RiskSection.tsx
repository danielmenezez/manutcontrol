import { ShieldAlert } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { MetricCard } from "../../components/ui/MetricCard";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { projectRisks } from "../../data/project";
import { strategyClasses } from "../../utils/badgeStyles";
import { countRisksByStrategy } from "../../utils/projectMetrics";

export function RiskSection() {
  const riskTotals = countRisksByStrategy(projectRisks);

  return (
    <section id="riscos" className="scroll-mt-28">
      <SectionHeader
        tag="Gestão de riscos"
        title="Riscos ligados às entregas do ManutControl"
        text="A análise conecta cada risco a uma área da EAP e define uma estratégia objetiva para prevenção, mitigação, transferência ou aceitação."
      />

      <div className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={ShieldAlert} label="Prevenir" value={String(riskTotals.Prevenir)} text="Ações antes do impacto" tone="emerald" />
        <MetricCard icon={ShieldAlert} label="Mitigar" value={String(riskTotals.Mitigar)} text="Redução de probabilidade" tone="amber" />
        <MetricCard icon={ShieldAlert} label="Transferir" value={String(riskTotals.Transferir)} text="Dependência externa" tone="violet" />
        <MetricCard icon={ShieldAlert} label="Aceitar" value={String(riskTotals.Aceitar)} text="Monitoramento consciente" tone="rose" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projectRisks.map((risk) => (
          <article key={risk.risk} className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
            <Badge className={strategyClasses[risk.strategy]}>{risk.strategy}</Badge>
            <h3 className="mt-4 text-lg font-black text-slate-950">{risk.risk}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              <b>EAP:</b> {risk.eap}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{risk.action}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
