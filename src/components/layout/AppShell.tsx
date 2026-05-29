import type { ReactNode } from "react";
import { navigation } from "../../app/navigation";
import type { MaintenanceSectionId } from "../../types/maintenance";
import { cn } from "../../utils/styles";
import { Sidebar } from "./Sidebar";

interface AppShellProps {
  activeSection: MaintenanceSectionId;
  children: ReactNode;
  onNavigate: (section: MaintenanceSectionId) => void;
}

export function AppShell({ activeSection, children, onNavigate }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f6f8fb] text-ink">
      <Sidebar activeSection={activeSection} navigation={navigation} onNavigate={onNavigate} />

      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-base font-black">ManutControl</div>
            <div className="text-xs text-slate-500">Controle de manutenção</div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-700 text-sm font-black text-white">
            MC
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Módulos do sistema">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-bold",
                  isActive ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-700",
                )}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-[1480px] px-4 py-6 lg:ml-72 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}
