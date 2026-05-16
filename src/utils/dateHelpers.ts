// Reference "today" — pinned to mock data so demo always works
const TODAY = new Date('2026-05-16T12:00:00');

function fmt(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getThisWeekDates(): { start: string; end: string } {
  const end = new Date(TODAY);
  const start = new Date(TODAY);
  start.setDate(start.getDate() - 6);
  return { start: fmt(start), end: fmt(end) };
}

export function getThisMonthDates(): { start: string; end: string } {
  const start = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
  const end = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0);
  return { start: fmt(start), end: fmt(end) };
}

export function getMonthDates(year: number, month: number): { start: string; end: string } {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return { start: fmt(start), end: fmt(end) };
}

export function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date(TODAY);
  const yesterday = new Date(TODAY);
  yesterday.setDate(yesterday.getDate() - 1);
  if (fmt(d) === fmt(today)) return 'Today';
  if (fmt(d) === fmt(yesterday)) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
