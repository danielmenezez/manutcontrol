import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  ClipboardList,
  Download,
  Gauge,
  Pencil,
  PlayCircle,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
  Wrench,
  XCircle,
} from "lucide-react";
import {
  useMemo,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { Badge } from "../../components/ui/Badge";
import { MetricCard } from "../../components/ui/MetricCard";
import { initialMaintenanceState } from "../../data/maintenance";
import { usePersistedState } from "../../hooks/usePersistedState";
import type {
  Criticality,
  Equipment,
  EquipmentFormData,
  EquipmentStatus,
  MaintenanceState,
  MaintenanceType,
  PreventivePlan,
  PreventivePlanFormData,
  WorkOrder,
  WorkOrderFormData,
  WorkOrderPriority,
  WorkOrderStatus,
} from "../../types/maintenance";
import { formatCurrency, formatDate } from "../../utils/formatters";
import {
  addDays,
  getEquipmentName,
  getMaintenanceMetrics,
  getPlanHealth,
  getTodayISO,
  isPastDue,
  isDueSoon,
  sortByDate,
} from "../../utils/maintenanceMetrics";
import { cn } from "../../utils/styles";

const STORAGE_KEY = "manutcontrol-maintenance-state-v1";

const equipmentStatuses: EquipmentStatus[] = ["Operacional", "Atenção", "Manutenção", "Parado"];
const criticalities: Criticality[] = ["Baixa", "Média", "Alta", "Crítica"];
const maintenanceTypes: MaintenanceType[] = ["Preventiva", "Corretiva", "Inspeção", "Calibração"];
const priorities: WorkOrderPriority[] = ["Baixa", "Média", "Alta", "Urgente"];
const orderStatuses: WorkOrderStatus[] = [
  "Aberta",
  "Em execução",
  "Aguardando peça",
  "Concluída",
  "Cancelada",
];

const equipmentStatusClasses: Record<EquipmentStatus, string> = {
  Operacional: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Atenção: "bg-amber-50 text-amber-800 ring-amber-200",
  Manutenção: "bg-blue-50 text-blue-700 ring-blue-200",
  Parado: "bg-rose-50 text-rose-700 ring-rose-200",
};

const criticalityClasses: Record<Criticality, string> = {
  Baixa: "bg-slate-50 text-slate-700 ring-slate-200",
  Média: "bg-sky-50 text-sky-700 ring-sky-200",
  Alta: "bg-amber-50 text-amber-800 ring-amber-200",
  Crítica: "bg-rose-50 text-rose-700 ring-rose-200",
};

const orderStatusClasses: Record<WorkOrderStatus, string> = {
  Aberta: "bg-slate-50 text-slate-700 ring-slate-200",
  "Em execução": "bg-blue-50 text-blue-700 ring-blue-200",
  "Aguardando peça": "bg-amber-50 text-amber-800 ring-amber-200",
  Concluída: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Cancelada: "bg-rose-50 text-rose-700 ring-rose-200",
};

const priorityClasses: Record<WorkOrderPriority, string> = {
  Baixa: "bg-slate-50 text-slate-700 ring-slate-200",
  Média: "bg-sky-50 text-sky-700 ring-sky-200",
  Alta: "bg-amber-50 text-amber-800 ring-amber-200",
  Urgente: "bg-rose-50 text-rose-700 ring-rose-200",
};

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function createEmptyEquipmentForm(): EquipmentFormData {
  const today = getTodayISO();

  return {
    tag: "",
    name: "",
    category: "",
    location: "",
    manufacturer: "",
    model: "",
    serialNumber: "",
    criticality: "Média",
    status: "Operacional",
    lastMaintenance: today,
    nextMaintenance: addDays(today, 30),
    responsible: "",
    notes: "",
  };
}

function createWorkOrderForm(equipmentId: string): WorkOrderFormData {
  return {
    equipmentId,
    title: "",
    type: "Preventiva",
    priority: "Média",
    dueDate: addDays(getTodayISO(), 3),
    technician: "",
    estimatedCost: 0,
    description: "",
    actions: "",
  };
}

function createPreventivePlanForm(equipmentId: string): PreventivePlanFormData {
  return {
    equipmentId,
    task: "",
    frequencyDays: 30,
    nextDue: addDays(getTodayISO(), 30),
    responsible: "",
  };
}

export function MaintenanceWorkspace() {
  const [state, setState] = usePersistedState<MaintenanceState>(
    STORAGE_KEY,
    initialMaintenanceState,
  );
  const [equipmentForm, setEquipmentForm] = useState<EquipmentFormData>(
    createEmptyEquipmentForm,
  );
  const [editingEquipmentId, setEditingEquipmentId] = useState<string | null>(null);
  const [equipmentQuery, setEquipmentQuery] = useState("");
  const [workOrderForm, setWorkOrderForm] = useState<WorkOrderFormData>(() =>
    createWorkOrderForm(initialMaintenanceState.equipments[0]?.id ?? ""),
  );
  const [orderFilter, setOrderFilter] = useState<WorkOrderStatus | "Todas">("Todas");
  const [preventiveForm, setPreventiveForm] = useState<PreventivePlanFormData>(() =>
    createPreventivePlanForm(initialMaintenanceState.equipments[0]?.id ?? ""),
  );

  const metrics = useMemo(() => getMaintenanceMetrics(state), [state]);
  const sortedOrders = useMemo(
    () => sortByDate(state.workOrders, (order) => order.dueDate),
    [state.workOrders],
  );
  const sortedPlans = useMemo(
    () => sortByDate(state.preventivePlans, (plan) => plan.nextDue),
    [state.preventivePlans],
  );
  const filteredEquipments = useMemo(() => {
    const query = equipmentQuery.trim().toLowerCase();
    if (!query) return state.equipments;

    return state.equipments.filter((equipment) =>
      [
        equipment.tag,
        equipment.name,
        equipment.category,
        equipment.location,
        equipment.responsible,
        equipment.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [equipmentQuery, state.equipments]);
  const filteredOrders = useMemo(() => {
    if (orderFilter === "Todas") return sortedOrders;
    return sortedOrders.filter((order) => order.status === orderFilter);
  }, [orderFilter, sortedOrders]);
  const fallbackEquipmentId = state.equipments[0]?.id ?? "";
  const selectedOrderEquipmentId = state.equipments.some(
    (equipment) => equipment.id === workOrderForm.equipmentId,
  )
    ? workOrderForm.equipmentId
    : fallbackEquipmentId;
  const selectedPlanEquipmentId = state.equipments.some(
    (equipment) => equipment.id === preventiveForm.equipmentId,
  )
    ? preventiveForm.equipmentId
    : fallbackEquipmentId;

  function updateEquipmentForm<TField extends keyof EquipmentFormData>(
    field: TField,
    value: EquipmentFormData[TField],
  ) {
    setEquipmentForm((current) => ({ ...current, [field]: value }));
  }

  function updateWorkOrderForm<TField extends keyof WorkOrderFormData>(
    field: TField,
    value: WorkOrderFormData[TField],
  ) {
    setWorkOrderForm((current) => ({ ...current, [field]: value }));
  }

  function updatePreventiveForm<TField extends keyof PreventivePlanFormData>(
    field: TField,
    value: PreventivePlanFormData[TField],
  ) {
    setPreventiveForm((current) => ({ ...current, [field]: value }));
  }

  function handleEquipmentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: EquipmentFormData = {
      ...equipmentForm,
      tag: equipmentForm.tag.trim().toUpperCase(),
      name: equipmentForm.name.trim(),
      category: equipmentForm.category.trim(),
      location: equipmentForm.location.trim(),
      manufacturer: equipmentForm.manufacturer.trim(),
      model: equipmentForm.model.trim(),
      serialNumber: equipmentForm.serialNumber.trim(),
      responsible: equipmentForm.responsible.trim(),
      notes: equipmentForm.notes.trim(),
    };

    if (editingEquipmentId) {
      setState((current) => ({
        ...current,
        equipments: current.equipments.map((equipment) =>
          equipment.id === editingEquipmentId ? { ...equipment, ...payload } : equipment,
        ),
      }));
      setEditingEquipmentId(null);
    } else {
      setState((current) => ({
        ...current,
        equipments: [{ id: createId("eq"), ...payload }, ...current.equipments],
      }));
    }

    setEquipmentForm(createEmptyEquipmentForm());
  }

  function editEquipment(equipment: Equipment) {
    const { id, ...formData } = equipment;
    setEditingEquipmentId(id);
    setEquipmentForm(formData);
    document.getElementById("equipamento-form")?.scrollIntoView({ behavior: "smooth" });
  }

  function removeEquipment(equipmentId: string) {
    const equipment = state.equipments.find((item) => item.id === equipmentId);
    if (!equipment) return;

    const confirmed = window.confirm(
      `Remover ${equipment.tag} e seus planos/ordens vinculados?`,
    );
    if (!confirmed) return;

    setState((current) => ({
      equipments: current.equipments.filter((item) => item.id !== equipmentId),
      workOrders: current.workOrders.filter((order) => order.equipmentId !== equipmentId),
      preventivePlans: current.preventivePlans.filter((plan) => plan.equipmentId !== equipmentId),
    }));
  }

  function handleWorkOrderSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedOrderEquipmentId) return;

    const order: WorkOrder = {
      id: createId("os"),
      ...workOrderForm,
      equipmentId: selectedOrderEquipmentId,
      title: workOrderForm.title.trim(),
      technician: workOrderForm.technician.trim(),
      description: workOrderForm.description.trim(),
      actions: workOrderForm.actions.trim(),
      status: "Aberta",
      openedAt: getTodayISO(),
    };

    setState((current) => ({
      ...current,
      workOrders: [order, ...current.workOrders],
      equipments: current.equipments.map((equipment) =>
        equipment.id === order.equipmentId ? { ...equipment, status: "Manutenção" } : equipment,
      ),
    }));
    setWorkOrderForm(createWorkOrderForm(state.equipments[0]?.id ?? ""));
  }

  function advanceWorkOrder(orderId: string) {
    const nextByStatus: Partial<Record<WorkOrderStatus, WorkOrderStatus>> = {
      Aberta: "Em execução",
      "Em execução": "Aguardando peça",
      "Aguardando peça": "Concluída",
    };
    const order = state.workOrders.find((item) => item.id === orderId);
    const nextStatus = order ? nextByStatus[order.status] : undefined;

    if (!order || !nextStatus) return;
    if (nextStatus === "Concluída") {
      completeWorkOrder(orderId);
      return;
    }

    setState((current) => ({
      ...current,
      workOrders: current.workOrders.map((item) =>
        item.id === orderId ? { ...item, status: nextStatus } : item,
      ),
      equipments: current.equipments.map((equipment) =>
        equipment.id === order.equipmentId ? { ...equipment, status: "Manutenção" } : equipment,
      ),
    }));
  }

  function completeWorkOrder(orderId: string) {
    const today = getTodayISO();

    setState((current) => {
      const target = current.workOrders.find((order) => order.id === orderId);
      if (!target) return current;

      const completedStatus: WorkOrderStatus = "Concluída";
      const workOrders = current.workOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: completedStatus, closedAt: today }
          : order,
      );
      const hasOtherOpenOrder = workOrders.some(
        (order) =>
          order.equipmentId === target.equipmentId &&
          order.id !== orderId &&
          order.status !== "Concluída" &&
          order.status !== "Cancelada",
      );

      return {
        ...current,
        workOrders,
        equipments: current.equipments.map((equipment) =>
          equipment.id === target.equipmentId
            ? {
                ...equipment,
                status: hasOtherOpenOrder ? "Manutenção" : "Operacional",
                lastMaintenance: today,
              }
            : equipment,
        ),
      };
    });
  }

  function cancelWorkOrder(orderId: string) {
    setState((current) => {
      const target = current.workOrders.find((order) => order.id === orderId);
      if (!target) return current;

      const canceledStatus: WorkOrderStatus = "Cancelada";
      const workOrders = current.workOrders.map((order) =>
        order.id === orderId ? { ...order, status: canceledStatus } : order,
      );
      const hasOtherOpenOrder = workOrders.some(
        (order) =>
          order.equipmentId === target.equipmentId &&
          order.id !== orderId &&
          order.status !== "Concluída" &&
          order.status !== "Cancelada",
      );

      return {
        ...current,
        workOrders,
        equipments: current.equipments.map((equipment) =>
          equipment.id === target.equipmentId && !hasOtherOpenOrder
            ? { ...equipment, status: "Operacional" }
            : equipment,
        ),
      };
    });
  }

  function removeWorkOrder(orderId: string) {
    setState((current) => ({
      ...current,
      workOrders: current.workOrders.filter((order) => order.id !== orderId),
    }));
  }

  function handlePreventiveSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedPlanEquipmentId) return;

    const plan: PreventivePlan = {
      id: createId("pp"),
      ...preventiveForm,
      equipmentId: selectedPlanEquipmentId,
      task: preventiveForm.task.trim(),
      responsible: preventiveForm.responsible.trim(),
      active: true,
    };

    setState((current) => ({
      ...current,
      preventivePlans: [plan, ...current.preventivePlans],
    }));
    setPreventiveForm(createPreventivePlanForm(state.equipments[0]?.id ?? ""));
  }

  function togglePreventivePlan(planId: string) {
    setState((current) => ({
      ...current,
      preventivePlans: current.preventivePlans.map((plan) =>
        plan.id === planId ? { ...plan, active: !plan.active } : plan,
      ),
    }));
  }

  function generateOrderFromPlan(plan: PreventivePlan) {
    const order: WorkOrder = {
      id: createId("os"),
      equipmentId: plan.equipmentId,
      title: plan.task,
      type: "Preventiva",
      priority: "Média",
      status: "Aberta",
      openedAt: getTodayISO(),
      dueDate: plan.nextDue,
      technician: plan.responsible,
      estimatedCost: 0,
      description: `Plano preventivo automático: ${plan.task}.`,
      actions: "",
    };

    setState((current) => ({
      ...current,
      workOrders: [order, ...current.workOrders],
      preventivePlans: current.preventivePlans.map((item) =>
        item.id === plan.id ? { ...item, nextDue: addDays(item.nextDue, item.frequencyDays) } : item,
      ),
      equipments: current.equipments.map((equipment) =>
        equipment.id === plan.equipmentId ? { ...equipment, status: "Manutenção" } : equipment,
      ),
    }));
  }

  function removePreventivePlan(planId: string) {
    setState((current) => ({
      ...current,
      preventivePlans: current.preventivePlans.filter((plan) => plan.id !== planId),
    }));
  }

  function exportJson() {
    downloadFile(
      `manutcontrol-backup-${getTodayISO()}.json`,
      JSON.stringify(state, null, 2),
      "application/json",
    );
  }

  function exportOrdersCsv() {
    const headers = [
      "id",
      "equipamento",
      "titulo",
      "tipo",
      "prioridade",
      "status",
      "abertura",
      "prazo",
      "fechamento",
      "tecnico",
      "custo",
    ];
    const rows = state.workOrders.map((order) => [
      order.id,
      getEquipmentName(state.equipments, order.equipmentId),
      order.title,
      order.type,
      order.priority,
      order.status,
      order.openedAt,
      order.dueDate,
      order.closedAt ?? "",
      order.technician,
      String(order.estimatedCost),
    ]);
    const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(";")).join("\n");
    downloadFile(`manutcontrol-ordens-${getTodayISO()}.csv`, csv, "text/csv;charset=utf-8");
  }

  function resetSampleData() {
    const confirmed = window.confirm("Restaurar os dados iniciais do ManutControl?");
    if (confirmed) {
      setState(initialMaintenanceState);
      setEditingEquipmentId(null);
      setEquipmentForm(createEmptyEquipmentForm());
    }
  }

  return (
    <div className="space-y-10">
      <section id="dashboard" className="scroll-mt-28">
        <SectionTitle
          eyebrow="Operação"
          title="ManutControl"
          text="Sistema web para cadastro de equipamentos, ordens de serviço, planos preventivos e indicadores de manutenção."
        />

        <div className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
          <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-panel">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="inline-flex rounded-md bg-brand-50 px-3 py-1 text-xs font-black uppercase text-brand-700 ring-1 ring-brand-100">
                  Fase 2 pronta para uso local
                </div>
                <h1 className="mt-4 max-w-3xl text-3xl font-black text-slate-950 md:text-4xl">
                  Controle a vida útil dos ativos com OS, preventivas e histórico em um só painel.
                </h1>
                <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                  Os dados ficam salvos no navegador e podem ser exportados para backup ou evolução
                  posterior com MySQL.
                </p>
              </div>
              <div className="min-w-60 border-l-4 border-brand-700 pl-4">
                <span className="block text-xs font-black uppercase text-slate-500">Hoje</span>
                <strong className="mt-1 block text-xl text-slate-950">
                  {formatDate(metrics.today)}
                </strong>
                <span className="mt-3 block text-xs font-black uppercase text-slate-500">
                  OS abertas
                </span>
                <strong className="mt-1 block text-xl text-slate-950">{metrics.openOrders}</strong>
              </div>
            </div>
          </article>

          <article className="rounded-lg border border-slate-800 bg-ink p-6 text-white shadow-panel">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-300">Conformidade preventiva</p>
                <strong className="mt-2 block text-5xl font-black">
                  {metrics.preventiveCompliance}%
                </strong>
              </div>
              <Gauge className="text-emerald-300" size={36} />
            </div>
            <div className="mt-6 h-3 overflow-hidden rounded-md bg-white/15">
              <div
                className="h-full rounded-md bg-emerald-400"
                style={{ width: `${metrics.preventiveCompliance}%` }}
              />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
              <div>
                <span className="block text-slate-300">Críticos</span>
                <b className="text-xl">{metrics.criticalEquipments}</b>
              </div>
              <div>
                <span className="block text-slate-300">Atrasos</span>
                <b className="text-xl">{metrics.overdueOrders + metrics.overduePlans}</b>
              </div>
              <div>
                <span className="block text-slate-300">Custo mês</span>
                <b className="text-xl">{formatCurrency(metrics.monthlyCost)}</b>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={Wrench}
            label="Equipamentos"
            value={String(metrics.totalEquipments)}
            text="Ativos cadastrados"
            tone="blue"
          />
          <MetricCard
            icon={ClipboardList}
            label="Ordens abertas"
            value={String(metrics.openOrders)}
            text="OS em atendimento"
            tone="amber"
          />
          <MetricCard
            icon={AlertTriangle}
            label="Atrasadas"
            value={String(metrics.overdueOrders + metrics.overduePlans)}
            text="OS e preventivas vencidas"
            tone="rose"
          />
          <MetricCard
            icon={CalendarClock}
            label="Próximas preventivas"
            value={String(metrics.dueSoonPlans)}
            text="Vencem em até 7 dias"
            tone="emerald"
          />
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
            <PanelHeading
              icon={ClipboardCheck}
              title="Fila crítica"
              text="Ordens abertas por prazo e prioridade."
            />
            <div className="mt-4 space-y-3">
              {sortedOrders
                .filter((order) => order.status !== "Concluída" && order.status !== "Cancelada")
                .slice(0, 4)
                .map((order) => (
                  <CompactOrderRow
                    key={order.id}
                    order={order}
                    equipmentName={getEquipmentName(state.equipments, order.equipmentId)}
                  />
                ))}
            </div>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
            <PanelHeading
              icon={RotateCcw}
              title="Agenda preventiva"
              text="Planos ativos ordenados por vencimento."
            />
            <div className="mt-4 space-y-3">
              {sortedPlans
                .filter((plan) => plan.active)
                .slice(0, 4)
                .map((plan) => (
                  <CompactPlanRow
                    key={plan.id}
                    plan={plan}
                    equipmentName={getEquipmentName(state.equipments, plan.equipmentId)}
                  />
                ))}
            </div>
          </article>
        </div>
      </section>

      <section id="equipamentos" className="scroll-mt-28">
        <SectionTitle
          eyebrow="Ativos"
          title="Equipamentos"
          text="Cadastro operacional com criticidade, localização, responsável e próximas manutenções."
        />
        <div className="grid gap-4 xl:grid-cols-[420px_1fr]">
          <form
            id="equipamento-form"
            onSubmit={handleEquipmentSubmit}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel"
          >
            <PanelHeading
              icon={Save}
              title={editingEquipmentId ? "Editar equipamento" : "Novo equipamento"}
              text="Dados principais do ativo."
            />
            <div className="mt-5 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput
                  id="tag"
                  label="Tag"
                  value={equipmentForm.tag}
                  onChange={(event) => updateEquipmentForm("tag", event.target.value)}
                  required
                />
                <TextInput
                  id="category"
                  label="Categoria"
                  value={equipmentForm.category}
                  onChange={(event) => updateEquipmentForm("category", event.target.value)}
                  required
                />
              </div>
              <TextInput
                id="equipment-name"
                label="Nome"
                value={equipmentForm.name}
                onChange={(event) => updateEquipmentForm("name", event.target.value)}
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput
                  id="location"
                  label="Localização"
                  value={equipmentForm.location}
                  onChange={(event) => updateEquipmentForm("location", event.target.value)}
                  required
                />
                <TextInput
                  id="responsible"
                  label="Responsável"
                  value={equipmentForm.responsible}
                  onChange={(event) => updateEquipmentForm("responsible", event.target.value)}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  id="criticality"
                  label="Criticidade"
                  value={equipmentForm.criticality}
                  onChange={(event) =>
                    updateEquipmentForm("criticality", event.target.value as Criticality)
                  }
                  options={criticalities}
                />
                <SelectField
                  id="equipment-status"
                  label="Status"
                  value={equipmentForm.status}
                  onChange={(event) =>
                    updateEquipmentForm("status", event.target.value as EquipmentStatus)
                  }
                  options={equipmentStatuses}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput
                  id="manufacturer"
                  label="Fabricante"
                  value={equipmentForm.manufacturer}
                  onChange={(event) => updateEquipmentForm("manufacturer", event.target.value)}
                />
                <TextInput
                  id="model"
                  label="Modelo"
                  value={equipmentForm.model}
                  onChange={(event) => updateEquipmentForm("model", event.target.value)}
                />
              </div>
              <TextInput
                id="serial-number"
                label="Número de série"
                value={equipmentForm.serialNumber}
                onChange={(event) => updateEquipmentForm("serialNumber", event.target.value)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput
                  id="last-maintenance"
                  label="Última manutenção"
                  type="date"
                  value={equipmentForm.lastMaintenance}
                  onChange={(event) =>
                    updateEquipmentForm("lastMaintenance", event.target.value as Equipment["lastMaintenance"])
                  }
                />
                <TextInput
                  id="next-maintenance"
                  label="Próxima manutenção"
                  type="date"
                  value={equipmentForm.nextMaintenance}
                  onChange={(event) =>
                    updateEquipmentForm("nextMaintenance", event.target.value as Equipment["nextMaintenance"])
                  }
                />
              </div>
              <TextAreaField
                id="equipment-notes"
                label="Observações"
                value={equipmentForm.notes}
                onChange={(event) => updateEquipmentForm("notes", event.target.value)}
                rows={3}
              />
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-black text-white transition hover:bg-brand-900"
                >
                  <Save size={18} />
                  {editingEquipmentId ? "Salvar alterações" : "Cadastrar equipamento"}
                </button>
                {editingEquipmentId ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEquipmentId(null);
                      setEquipmentForm(createEmptyEquipmentForm());
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                  >
                    <XCircle size={18} />
                    Cancelar
                  </button>
                ) : null}
              </div>
            </div>
          </form>

          <div>
            <div className="mb-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-panel md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={18} />
                <input
                  value={equipmentQuery}
                  onChange={(event) => setEquipmentQuery(event.target.value)}
                  placeholder="Buscar por tag, local, status..."
                  className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-100"
                />
              </div>
              <div className="text-sm font-bold text-slate-500">
                {filteredEquipments.length} de {state.equipments.length} equipamentos
              </div>
            </div>

            <div className="grid gap-4 2xl:grid-cols-2">
              {filteredEquipments.map((equipment) => (
                <article
                  key={equipment.id}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700">
                          {equipment.tag}
                        </span>
                        <Badge className={equipmentStatusClasses[equipment.status]}>
                          {equipment.status}
                        </Badge>
                        <Badge className={criticalityClasses[equipment.criticality]}>
                          {equipment.criticality}
                        </Badge>
                      </div>
                      <h3 className="mt-3 break-words text-xl font-black text-slate-950">
                        {equipment.name}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {equipment.category} · {equipment.location}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <IconButton label="Editar equipamento" onClick={() => editEquipment(equipment)}>
                        <Pencil size={17} />
                      </IconButton>
                      <IconButton
                        label="Remover equipamento"
                        tone="danger"
                        onClick={() => removeEquipment(equipment.id)}
                      >
                        <Trash2 size={17} />
                      </IconButton>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <InfoPair label="Fabricante" value={equipment.manufacturer || "Não informado"} />
                    <InfoPair label="Modelo" value={equipment.model || "Não informado"} />
                    <InfoPair label="Série" value={equipment.serialNumber || "Não informado"} />
                    <InfoPair label="Responsável" value={equipment.responsible} />
                    <InfoPair label="Última manutenção" value={formatDate(equipment.lastMaintenance)} />
                    <InfoPair label="Próxima manutenção" value={formatDate(equipment.nextMaintenance)} />
                  </div>
                  {equipment.notes ? (
                    <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                      {equipment.notes}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="ordens" className="scroll-mt-28">
        <SectionTitle
          eyebrow="Execução"
          title="Ordens de serviço"
          text="Abertura, acompanhamento, cancelamento e conclusão de manutenções."
        />
        <div className="grid gap-4 xl:grid-cols-[420px_1fr]">
          <form
            onSubmit={handleWorkOrderSubmit}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel"
          >
            <PanelHeading icon={Plus} title="Nova OS" text="Registro de atendimento." />
            <div className="mt-5 grid gap-4">
              <EquipmentSelect
                id="order-equipment"
                label="Equipamento"
                equipments={state.equipments}
                value={selectedOrderEquipmentId}
                onChange={(value) => updateWorkOrderForm("equipmentId", value)}
                required
              />
              <TextInput
                id="order-title"
                label="Título"
                value={workOrderForm.title}
                onChange={(event) => updateWorkOrderForm("title", event.target.value)}
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  id="order-type"
                  label="Tipo"
                  value={workOrderForm.type}
                  onChange={(event) =>
                    updateWorkOrderForm("type", event.target.value as MaintenanceType)
                  }
                  options={maintenanceTypes}
                />
                <SelectField
                  id="order-priority"
                  label="Prioridade"
                  value={workOrderForm.priority}
                  onChange={(event) =>
                    updateWorkOrderForm("priority", event.target.value as WorkOrderPriority)
                  }
                  options={priorities}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput
                  id="order-due-date"
                  label="Prazo"
                  type="date"
                  value={workOrderForm.dueDate}
                  onChange={(event) =>
                    updateWorkOrderForm("dueDate", event.target.value as WorkOrder["dueDate"])
                  }
                />
                <TextInput
                  id="order-cost"
                  label="Custo estimado"
                  type="number"
                  min="0"
                  step="0.01"
                  value={workOrderForm.estimatedCost}
                  onChange={(event) =>
                    updateWorkOrderForm("estimatedCost", Number(event.target.value))
                  }
                />
              </div>
              <TextInput
                id="order-technician"
                label="Técnico"
                value={workOrderForm.technician}
                onChange={(event) => updateWorkOrderForm("technician", event.target.value)}
                required
              />
              <TextAreaField
                id="order-description"
                label="Descrição"
                value={workOrderForm.description}
                onChange={(event) => updateWorkOrderForm("description", event.target.value)}
                rows={3}
              />
              <button
                type="submit"
                disabled={!state.equipments.length}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-black text-white transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Plus size={18} />
                Abrir ordem
              </button>
            </div>
          </form>

          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-panel">
              {(["Todas", ...orderStatuses] as Array<WorkOrderStatus | "Todas">).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setOrderFilter(status)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-black transition",
                    orderFilter === status
                      ? "bg-brand-700 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                  )}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="grid gap-4 2xl:grid-cols-2">
              {filteredOrders.map((order) => (
                <article
                  key={order.id}
                  className={cn(
                    "rounded-lg border bg-white p-5 shadow-panel",
                    isPastDue(order.dueDate) &&
                      order.status !== "Concluída" &&
                      order.status !== "Cancelada"
                      ? "border-rose-200"
                      : "border-slate-200",
                  )}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={orderStatusClasses[order.status]}>{order.status}</Badge>
                        <Badge className={priorityClasses[order.priority]}>{order.priority}</Badge>
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700">
                          {order.type}
                        </span>
                      </div>
                      <h3 className="mt-3 break-words text-xl font-black text-slate-950">
                        {order.title}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {getEquipmentName(state.equipments, order.equipmentId)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {order.status !== "Concluída" && order.status !== "Cancelada" ? (
                        <>
                          <IconButton
                            label="Avançar status"
                            onClick={() => advanceWorkOrder(order.id)}
                          >
                            <PlayCircle size={17} />
                          </IconButton>
                          <IconButton
                            label="Concluir OS"
                            tone="success"
                            onClick={() => completeWorkOrder(order.id)}
                          >
                            <CheckCircle2 size={17} />
                          </IconButton>
                          <IconButton
                            label="Cancelar OS"
                            tone="danger"
                            onClick={() => cancelWorkOrder(order.id)}
                          >
                            <XCircle size={17} />
                          </IconButton>
                        </>
                      ) : null}
                      <IconButton
                        label="Remover OS"
                        tone="danger"
                        onClick={() => removeWorkOrder(order.id)}
                      >
                        <Trash2 size={17} />
                      </IconButton>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <InfoPair label="Abertura" value={formatDate(order.openedAt)} />
                    <InfoPair label="Prazo" value={formatDate(order.dueDate)} />
                    <InfoPair label="Técnico" value={order.technician} />
                    <InfoPair label="Custo" value={formatCurrency(order.estimatedCost)} />
                  </div>
                  {order.description ? (
                    <p className="mt-4 text-sm leading-6 text-slate-600">{order.description}</p>
                  ) : null}
                  {order.actions ? (
                    <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                      {order.actions}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="preventivas" className="scroll-mt-28">
        <SectionTitle
          eyebrow="Prevenção"
          title="Planos preventivos"
          text="Programação recorrente para reduzir corretivas e manter ativos disponíveis."
        />
        <div className="grid gap-4 xl:grid-cols-[420px_1fr]">
          <form
            onSubmit={handlePreventiveSubmit}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel"
          >
            <PanelHeading icon={RotateCcw} title="Novo plano" text="Rotina preventiva." />
            <div className="mt-5 grid gap-4">
              <EquipmentSelect
                id="plan-equipment"
                label="Equipamento"
                equipments={state.equipments}
                value={selectedPlanEquipmentId}
                onChange={(value) => updatePreventiveForm("equipmentId", value)}
                required
              />
              <TextInput
                id="plan-task"
                label="Atividade"
                value={preventiveForm.task}
                onChange={(event) => updatePreventiveForm("task", event.target.value)}
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput
                  id="plan-frequency"
                  label="Frequência em dias"
                  type="number"
                  min="1"
                  value={preventiveForm.frequencyDays}
                  onChange={(event) =>
                    updatePreventiveForm("frequencyDays", Number(event.target.value))
                  }
                />
                <TextInput
                  id="plan-next-due"
                  label="Próximo vencimento"
                  type="date"
                  value={preventiveForm.nextDue}
                  onChange={(event) =>
                    updatePreventiveForm("nextDue", event.target.value as PreventivePlan["nextDue"])
                  }
                />
              </div>
              <TextInput
                id="plan-responsible"
                label="Responsável"
                value={preventiveForm.responsible}
                onChange={(event) => updatePreventiveForm("responsible", event.target.value)}
                required
              />
              <button
                type="submit"
                disabled={!state.equipments.length}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-black text-white transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Plus size={18} />
                Criar plano
              </button>
            </div>
          </form>

          <div className="grid gap-4 2xl:grid-cols-2">
            {sortedPlans.map((plan) => {
              const health = getPlanHealth(plan);
              const healthClass =
                health === "Atrasada"
                  ? "bg-rose-50 text-rose-700 ring-rose-200"
                  : health === "Próxima"
                    ? "bg-amber-50 text-amber-800 ring-amber-200"
                    : "bg-emerald-50 text-emerald-700 ring-emerald-200";

              return (
                <article
                  key={plan.id}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={healthClass}>{health}</Badge>
                        <Badge
                          className={
                            plan.active
                              ? "bg-blue-50 text-blue-700 ring-blue-200"
                              : "bg-slate-50 text-slate-500 ring-slate-200"
                          }
                        >
                          {plan.active ? "Ativo" : "Pausado"}
                        </Badge>
                      </div>
                      <h3 className="mt-3 break-words text-xl font-black text-slate-950">
                        {plan.task}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {getEquipmentName(state.equipments, plan.equipmentId)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <IconButton label="Gerar OS" onClick={() => generateOrderFromPlan(plan)}>
                        <ClipboardList size={17} />
                      </IconButton>
                      <IconButton label={plan.active ? "Pausar plano" : "Ativar plano"} onClick={() => togglePreventivePlan(plan.id)}>
                        <RotateCcw size={17} />
                      </IconButton>
                      <IconButton
                        label="Remover plano"
                        tone="danger"
                        onClick={() => removePreventivePlan(plan.id)}
                      >
                        <Trash2 size={17} />
                      </IconButton>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                    <InfoPair label="Frequência" value={`${plan.frequencyDays} dias`} />
                    <InfoPair label="Próximo vencimento" value={formatDate(plan.nextDue)} />
                    <InfoPair label="Responsável" value={plan.responsible} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="relatorios" className="scroll-mt-28">
        <SectionTitle
          eyebrow="Indicadores"
          title="Relatórios"
          text="Visão consolidada para acompanhamento semanal, auditoria e evolução da base."
        />
        <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
            <PanelHeading icon={Gauge} title="Resumo operacional" text="Distribuição dos ativos e OS." />
            <div className="mt-5 grid gap-6 xl:grid-cols-2">
              <StatusBars
                title="Status dos equipamentos"
                total={Math.max(state.equipments.length, 1)}
                data={metrics.equipmentStatusCounts}
              />
              <StatusBars
                title="Status das ordens"
                total={Math.max(state.workOrders.length, 1)}
                data={metrics.orderStatusCounts}
              />
            </div>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
            <PanelHeading icon={Download} title="Dados" text="Backup e arquivos de trabalho." />
            <div className="mt-5 grid gap-3">
              <button
                type="button"
                onClick={exportJson}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-black text-white transition hover:bg-brand-900"
              >
                <Download size={18} />
                Exportar backup JSON
              </button>
              <button
                type="button"
                onClick={exportOrdersCsv}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                <Download size={18} />
                Exportar ordens CSV
              </button>
              <button
                type="button"
                onClick={resetSampleData}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 px-4 py-2.5 text-sm font-black text-rose-700 transition hover:bg-rose-50"
              >
                <RotateCcw size={18} />
                Restaurar dados iniciais
              </button>
            </div>
            <div className="mt-5 grid gap-3 border-t border-slate-200 pt-5 text-sm">
              <InfoPair label="Persistência" value="LocalStorage do navegador" />
              <InfoPair label="Meta Fase 2" value="Banco MySQL e hospedagem PHP/MySQL" />
              <InfoPair label="Entrega-alvo" value="17/11/2026" />
            </div>
          </article>
        </div>

        <article className="mt-4 rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <PanelHeading
            icon={CircleDollarSign}
            title="Custos das ordens"
            text="Valores estimados registrados nas OS."
          />
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="py-3 pr-4">OS</th>
                  <th className="py-3 pr-4">Equipamento</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Prazo</th>
                  <th className="py-3 pr-4">Técnico</th>
                  <th className="py-3 pr-4 text-right">Custo</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4 font-black text-slate-950">{order.id}</td>
                    <td className="py-3 pr-4 text-slate-700">
                      {getEquipmentName(state.equipments, order.equipmentId)}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge className={orderStatusClasses[order.status]}>{order.status}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-slate-700">{formatDate(order.dueDate)}</td>
                    <td className="py-3 pr-4 text-slate-700">{order.technician}</td>
                    <td className="py-3 pr-4 text-right font-black text-slate-950">
                      {formatCurrency(order.estimatedCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  text: string;
}

function SectionTitle({ eyebrow, title, text }: SectionTitleProps) {
  return (
    <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-black uppercase text-brand-700">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">{title}</h2>
      </div>
      <p className="max-w-2xl text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

interface PanelHeadingProps {
  icon: typeof Save;
  title: string;
  text: string;
}

function PanelHeading({ icon: Icon, title, text }: PanelHeadingProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
        <Icon size={20} />
      </div>
      <div>
        <h3 className="font-black text-slate-950">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-slate-500">{text}</p>
      </div>
    </div>
  );
}

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

function TextInput({ id, label, className, ...props }: TextInputProps) {
  return (
    <label htmlFor={id} className="grid gap-1.5 text-sm font-bold text-slate-700">
      {label}
      <input
        id={id}
        className={cn(
          "h-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-100",
          className,
        )}
        {...props}
      />
    </label>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: string[];
}

function SelectField({ id, label, options, className, ...props }: SelectFieldProps) {
  return (
    <label htmlFor={id} className="grid gap-1.5 text-sm font-bold text-slate-700">
      {label}
      <select
        id={id}
        className={cn(
          "h-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-100",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
}

function TextAreaField({ id, label, className, ...props }: TextAreaFieldProps) {
  return (
    <label htmlFor={id} className="grid gap-1.5 text-sm font-bold text-slate-700">
      {label}
      <textarea
        id={id}
        className={cn(
          "rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-100",
          className,
        )}
        {...props}
      />
    </label>
  );
}

interface EquipmentSelectProps {
  id: string;
  label: string;
  equipments: Equipment[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

function EquipmentSelect({
  id,
  label,
  equipments,
  value,
  onChange,
  required,
}: EquipmentSelectProps) {
  return (
    <label htmlFor={id} className="grid gap-1.5 text-sm font-bold text-slate-700">
      {label}
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-100"
      >
        {equipments.map((equipment) => (
          <option key={equipment.id} value={equipment.id}>
            {equipment.tag} · {equipment.name}
          </option>
        ))}
      </select>
    </label>
  );
}

interface IconButtonProps {
  children: ReactNode;
  label: string;
  onClick: () => void;
  tone?: "default" | "danger" | "success";
}

function IconButton({ children, label, onClick, tone = "default" }: IconButtonProps) {
  const toneClass =
    tone === "danger"
      ? "border-rose-200 text-rose-700 hover:bg-rose-50"
      : tone === "success"
        ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
        : "border-slate-200 text-slate-700 hover:bg-slate-50";

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition",
        toneClass,
      )}
    >
      {children}
    </button>
  );
}

interface InfoPairProps {
  label: string;
  value: string;
}

function InfoPair({ label, value }: InfoPairProps) {
  return (
    <div className="min-w-0">
      <span className="block text-xs font-black uppercase text-slate-400">{label}</span>
      <strong className="mt-1 block break-words text-slate-800">{value}</strong>
    </div>
  );
}

interface CompactOrderRowProps {
  order: WorkOrder;
  equipmentName: string;
}

function CompactOrderRow({ order, equipmentName }: CompactOrderRowProps) {
  const late = isPastDue(order.dueDate);

  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={orderStatusClasses[order.status]}>{order.status}</Badge>
          <Badge className={priorityClasses[order.priority]}>{order.priority}</Badge>
        </div>
        <strong className="mt-2 block break-words text-slate-950">{order.title}</strong>
        <span className="mt-1 block text-sm text-slate-500">{equipmentName}</span>
      </div>
      <div className={cn("text-sm font-black", late ? "text-rose-700" : "text-slate-700")}>
        {formatDate(order.dueDate)}
      </div>
    </div>
  );
}

interface CompactPlanRowProps {
  plan: PreventivePlan;
  equipmentName: string;
}

function CompactPlanRow({ plan, equipmentName }: CompactPlanRowProps) {
  const health = getPlanHealth(plan);
  const late = health === "Atrasada";
  const soon = isDueSoon(plan.nextDue);

  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Badge
          className={
            late
              ? "bg-rose-50 text-rose-700 ring-rose-200"
              : soon
                ? "bg-amber-50 text-amber-800 ring-amber-200"
                : "bg-emerald-50 text-emerald-700 ring-emerald-200"
          }
        >
          {health}
        </Badge>
        <strong className="mt-2 block break-words text-slate-950">{plan.task}</strong>
        <span className="mt-1 block text-sm text-slate-500">{equipmentName}</span>
      </div>
      <div className={cn("text-sm font-black", late ? "text-rose-700" : "text-slate-700")}>
        {formatDate(plan.nextDue)}
      </div>
    </div>
  );
}

interface StatusBarsProps<TStatus extends string> {
  title: string;
  total: number;
  data: Record<TStatus, number>;
}

function StatusBars<TStatus extends string>({ title, total, data }: StatusBarsProps<TStatus>) {
  const entries = Object.entries(data) as Array<[string, number]>;

  return (
    <div>
      <h4 className="font-black text-slate-950">{title}</h4>
      <div className="mt-4 space-y-3">
        {entries.map(([status, count]) => {
          const percent = Math.round((count / total) * 100);

          return (
            <div key={status}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="font-bold text-slate-700">{status}</span>
                <span className="font-black text-slate-950">{count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-md bg-slate-100">
                <div className="h-full rounded-md bg-brand-700" style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
