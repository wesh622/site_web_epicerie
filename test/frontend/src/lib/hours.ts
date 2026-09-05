// Open-now logic for night schedules crossing midnight (ex. 18:00 → 05:00), Europe/Paris.
import { useEffect, useMemo, useState } from "react";
import type { DayHours } from "./shop";

export interface OpenStatus {
  isOpen: boolean;
  label: string;
  detail: string;
  activeIndex: number;
}

export const formatHour = (t: string): string => {
  const [h, m] = t.split(":");
  return `${Number(h)}h${m}`;
};

const toMinutes = (t: string): number => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export function computeStatus(hours: DayHours[], now = new Date()): OpenStatus {
  const dayName = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "long",
  })
    .format(now)
    .toLowerCase();
  const hmStr = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(now);
  const [hh, mm] = hmStr.split(":").map(Number);
  const minutes = hh * 60 + mm;

  const found = hours.findIndex((d) => d.day.toLowerCase() === dayName);
  const idx = found >= 0 ? found : 0;
  const today = hours[idx];
  const yesterday = hours[(idx + 6) % 7];

  const crosses = (d: DayHours): boolean =>
    !d.closed && !!d.open && !!d.close && toMinutes(d.close) <= toMinutes(d.open);

  // Yesterday's shift spills into this morning (ex. it is 03:12, yesterday opened 18h→5h)
  if (yesterday && crosses(yesterday) && yesterday.close && minutes < toMinutes(yesterday.close)) {
    return {
      isOpen: true,
      label: "Ouvert",
      detail: `Ferme à ${formatHour(yesterday.close)}`,
      activeIndex: (idx + 6) % 7,
    };
  }
  if (today && !today.closed && today.open && today.close && minutes >= toMinutes(today.open)) {
    return {
      isOpen: true,
      label: "Ouvert",
      detail: `Ferme à ${formatHour(today.close)}`,
      activeIndex: idx,
    };
  }
  if (today && !today.closed && today.open && minutes < toMinutes(today.open)) {
    return {
      isOpen: false,
      label: "Fermé",
      detail: `Ouvre à ${formatHour(today.open)}`,
      activeIndex: idx,
    };
  }
  const tomorrow = hours[(idx + 1) % 7];
  return {
    isOpen: false,
    label: "Fermé",
    detail: tomorrow && tomorrow.open ? `Ouvre demain à ${formatHour(tomorrow.open)}` : "Horaires à confirmer",
    activeIndex: (idx + 1) % 7,
  };
}

export function useOpenStatus(hours: DayHours[]): OpenStatus {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  return useMemo(() => computeStatus(hours, now), [hours, now]);
}
