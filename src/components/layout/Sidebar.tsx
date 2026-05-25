import type { NavigationItem, ProjectSectionId } from "../../types/project";
import { cn } from "../../utils/styles";

interface SidebarProps {
  activeSection: ProjectSectionId;
  navigation: NavigationItem[];
  onNavigate: (section: ProjectSectionId) => void;
}

export function Sidebar({ activeSection, navigation, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col border-r border-slate-800 bg-ink p-5 text-white lg:flex">
      <div className="flex items-center gap-3 border-b border-white/10 pb-5">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-white text-sm font-black text-brand-700">
          MC
        </div>
        <div>
          <div className="text-lg font-black">ManutControl</div>
          <div className="text-xs text-slate-300">Gestão do projeto</div>
        </div>
      </div>

      <nav className="mt-6 flex flex-col gap-2" aria-label="Seções do projeto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-bold transition",
                isActive
                  ? "bg-white text-ink shadow-sm"
                  : "text-slate-200 hover:bg-white/10 hover:text-white",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
        <div className="font-bold text-slate-300">Período do projeto</div>
        <div className="mt-1 font-black">01/03/2026 a 25/04/2026</div>
      </div>
    </aside>
  );
}
