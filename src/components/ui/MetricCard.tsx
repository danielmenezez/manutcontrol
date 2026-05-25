import type { LucideIcon } from "lucide-react";
import { cn } from "../../utils/styles";

type MetricTone = "blue" | "emerald" | "amber" | "rose" | "violet";

const toneClasses: Record<MetricTone, string> = {
  blue: "bg-brand-50 text-brand-700 ring-brand-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-800 ring-amber-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  violet: "bg-violet-50 text-violet-700 ring-violet-100",
};

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  text: string;
  tone?: MetricTone;
}

export function MetricCard({ icon: Icon, label, value, text, tone = "blue" }: MetricCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
      <div className={cn("grid h-10 w-10 place-items-center rounded-lg ring-1", toneClasses[tone])}>
        <Icon size={20} />
      </div>
      <span className="mt-4 block text-sm font-bold text-slate-500">{label}</span>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <small className="mt-1 block leading-5 text-slate-500">{text}</small>
    </article>
  );
}
