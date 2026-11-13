/** "Open now" helper for daily schedules written as «Ежедневно, 10:00–19:00». Anything else → null (shown as plain text). */
export type Daily = { open: number; close: number }; // minutes from midnight

export function parseDaily(value: string | null): Daily | null {
  const m = value?.match(/^Ежедневно,\s*(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})$/i);
  if (!m) return null;
  const [, a, b, c, d] = m.map(Number);
  return { open: a * 60 + b, close: c * 60 + d };
}

export const hhmm = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/** Local minutes-of-day in the business's time zone. */
function localMinutes(now: Date, timeZone: string) {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const get = (t: string) => Number(p.find((x) => x.type === t)?.value ?? 0);
  return get("hour") * 60 + get("minute");
}

export function openState(d: Daily, timeZone: string, now = new Date()): { open: boolean; next: string } {
  const t = localMinutes(now, timeZone);
  const open = t >= d.open && t < d.close;
  return { open, next: hhmm(open ? d.close : d.open) };
}
