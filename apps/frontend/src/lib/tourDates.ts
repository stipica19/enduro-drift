import { API_URL } from "./apiClient";

export interface TourDateItem {
  _id: string;
  number: number;
  season: string;
  startDate: string;
  endDate: string;
  available: boolean;
}

export function formatShortDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export function formatTourDateLabel(
  td: Pick<TourDateItem, "number" | "startDate" | "endDate">,
  prefix: string,
  locale: string,
) {
  return `${prefix} ${td.number}: ${formatShortDate(td.startDate, locale)} - ${formatShortDate(td.endDate, locale)}`;
}

// Stranice su statične, pa je popis termina iz builda zastario čim se netko prijavi.
// Ovo dohvaća svježe stanje u browseru. Vraća null ako API ne odgovori — pozivatelj tada
// ostavlja vrijednosti iz builda, pa stranica nikad ne ostane bez podataka.
export async function fetchTourDates(): Promise<TourDateItem[] | null> {
  try {
    const res = await fetch(`${API_URL}/api/tour-dates`, { cache: "no-store" });
    return res.ok ? ((await res.json()) as TourDateItem[]) : null;
  } catch {
    return null;
  }
}
