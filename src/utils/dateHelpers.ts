// Reference "today" — pinned to mock data so demo always works.
// Use UTC so SSR (UTC) and client (any TZ) agree → no hydration mismatch.
const TODAY_Y = 2026;
const TODAY_M = 4; // May (0-indexed)
const TODAY_D = 16;
const TODAY = new Date(Date.UTC(TODAY_Y, TODAY_M, TODAY_D, 12, 0, 0));

function fmt(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getThisWeekDates(): { start: string; end: string } {
  const end = new Date(TODAY);
  const start = new Date(TODAY);
  start.setUTCDate(start.getUTCDate() - 6);
  return { start: fmt(start), end: fmt(end) };
}

export function getThisMonthDates(): { start: string; end: string } {
  const start = new Date(Date.UTC(TODAY_Y, TODAY_M, 1));
  const end = new Date(Date.UTC(TODAY_Y, TODAY_M + 1, 0));
  return { start: fmt(start), end: fmt(end) };
}

export function getMonthDates(year: number, month: number): { start: string; end: string } {
  const start = new Date(Date.UTC(year, month, 1));
  const end = new Date(Date.UTC(year, month + 1, 0));
  return { start: fmt(start), end: fmt(end) };
}

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function formatDateLabel(dateStr: string): string {
  const todayStr = fmt(TODAY);
  const yesterday = new Date(TODAY);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yesterdayStr = fmt(yesterday);
  if (dateStr === todayStr) return 'Today';
  if (dateStr === yesterdayStr) return 'Yesterday';
  // Parse YYYY-MM-DD without TZ ambiguity
  const [, m, d] = dateStr.split('-').map(Number);
  return `${d} ${MONTHS_SHORT[(m ?? 1) - 1]}`;
}
