import type { LucideIcon } from "lucide-react";
import { cn } from "../../utils/styles";

interface SegmentedOption<T extends string> {
  icon: LucideIcon;
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm" aria-label={label}>
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-black transition",
              isSelected ? "bg-brand-700 text-white" : "text-slate-600 hover:bg-slate-100",
            )}
          >
            <Icon size={16} />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
