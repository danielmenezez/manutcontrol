import type { ISODateString } from "../types/project";

export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function parseProjectDate(date: ISODateString) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(date: ISODateString) {
  return parseProjectDate(date).toLocaleDateString("pt-BR");
}

export function daysBetween(start: Date, end: Date) {
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}
