import type { BusinessSettings } from "@/types/business-settings";

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isValidStoreTime(value: string): boolean {
  return TIME_PATTERN.test(value.trim());
}

function minutesFromMidnight(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function currentMinutesInTimezone(now: Date, timezone: string): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? "0",
  );

  return hour * 60 + minute;
}

export function isStoreOpen(
  settings: BusinessSettings,
  now: Date = new Date(),
): boolean {
  const { store_hours_enabled, open_time, close_time, timezone } =
    settings.order;

  if (!store_hours_enabled) {
    return true;
  }

  if (!isValidStoreTime(open_time) || !isValidStoreTime(close_time)) {
    return true;
  }

  const current = currentMinutesInTimezone(now, timezone || "Asia/Kolkata");
  const open = minutesFromMidnight(open_time);
  const close = minutesFromMidnight(close_time);

  if (open === close) {
    return false;
  }

  // Same-day window (e.g. 09:00–22:00)
  if (open < close) {
    return current >= open && current < close;
  }

  // Overnight window (e.g. 22:00–02:00)
  return current >= open || current < close;
}

export function getStoreClosedMessage(settings: BusinessSettings): string {
  const { open_time, close_time } = settings.order;
  return `We're closed right now. Orders are accepted from ${open_time} to ${close_time}.`;
}
