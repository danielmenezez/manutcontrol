import { cn } from "../../utils/styles";

interface BadgeProps {
  children: string;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2.5 py-1 text-xs font-black ring-1 ring-inset",
        className,
      )}
    >
      {children}
    </span>
  );
}
