// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// FIX #9: Formatear fecha respetando timezone de Argentina (America/Argentina/Buenos_Aires)
// Las fechas se guardan en UTC en la DB; sin esto aparecen un día antes en AR.
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:    { label: "Pendiente",   color: "text-yellow-500" },
  approved:   { label: "Aprobada",    color: "text-green-500"  },
  rejected:   { label: "Rechazada",   color: "text-red-500"    },
  in_process: { label: "En proceso",  color: "text-blue-400"   },
  cancelled:  { label: "Cancelada",   color: "text-gray-500"   },
};
