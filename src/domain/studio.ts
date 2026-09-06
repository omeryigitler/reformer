export type EntityStatus = "active" | "archived";
export type ClassCategory = "reformer" | "mat" | "yoga" | "private" | "other";
export type SessionStatus = "draft" | "published" | "cancelled" | "completed";
export type BookingStatus = "confirmed" | "cancelled" | "attended" | "no_show";
export type BookingSource = "member" | "admin";

export type StudioLocation = {
  id: string;
  name: string;
  address: string;
  timezone: string;
  status: EntityStatus;
};

export type Studio = {
  id: string;
  locationId: string;
  name: string;
  description: string;
  maxCapacity: number;
  status: EntityStatus;
  sortOrder: number;
  createdAt: string;
};

export type ClassDefinition = {
  id: string;
  name: string;
  category: ClassCategory;
  description: string;
  defaultDurationMinutes: number;
  defaultCapacity: number;
  allowedStudioIds: string[];
  status: EntityStatus;
  createdAt: string;
};

export type Instructor = {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  classIds: string[];
  studioIds: string[];
  accountAccess: boolean;
  status: EntityStatus;
  createdAt: string;
};

export type StudioSession = {
  id: string;
  classId: string;
  studioId: string;
  instructorId: string;
  startAt: string;
  endAt: string;
  capacity: number;
  bookedCount: number;
  status: SessionStatus;
  createdBy: string;
  createdAt: string;
  seriesId?: string;
  classNameSnapshot: string;
  studioNameSnapshot: string;
  instructorNameSnapshot: string;
};

export type Booking = {
  id: string;
  sessionId: string;
  memberId: string;
  status: BookingStatus;
  source: BookingSource;
  bookedAt: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  emailStatus?: "queued" | "sent" | "failed";
  cancellationEmailStatus?: "queued" | "sent" | "failed";
  memberNameSnapshot?: string;
  memberEmailSnapshot?: string;
  classNameSnapshot: string;
  studioNameSnapshot: string;
  instructorNameSnapshot: string;
  startAt: string;
  endAt: string;
};

export type StudioConfiguration = {
  locations: StudioLocation[];
  studios: Studio[];
  classes: ClassDefinition[];
  instructors: Instructor[];
  sessions: StudioSession[];
  bookings: Booking[];
};

export type SessionDraft = {
  classId: string;
  studioId: string;
  instructorId: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  capacity: number;
};

export function intervalsOverlap(startA: string, endA: string, startB: string, endB: string) {
  const aStart = new Date(startA).getTime();
  const aEnd = new Date(endA).getTime();
  const bStart = new Date(startB).getTime();
  const bEnd = new Date(endB).getTime();
  return aStart < bEnd && bStart < aEnd;
}

function timeZoneOffsetMs(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  const representedAsUtc = Date.UTC(
    value("year"),
    value("month") - 1,
    value("day"),
    value("hour"),
    value("minute"),
    value("second")
  );
  return representedAsUtc - date.getTime();
}

function zonedLocalToUtc(date: string, time: string, timeZone: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  if (![year, month, day, hour, minute].every(Number.isFinite)) {
    throw new Error("Invalid session date or time.");
  }

  const localAsUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  const firstOffset = timeZoneOffsetMs(new Date(localAsUtc), timeZone);
  let timestamp = localAsUtc - firstOffset;
  const correctedOffset = timeZoneOffsetMs(new Date(timestamp), timeZone);
  if (correctedOffset !== firstOffset) timestamp = localAsUtc - correctedOffset;
  return new Date(timestamp);
}

export function buildSessionTimes(
  date: string,
  startTime: string,
  durationMinutes: number,
  timeZone = "Europe/Malta"
) {
  const start = zonedLocalToUtc(date, startTime, timeZone);
  if (Number.isNaN(start.getTime())) throw new Error("Invalid session date or time.");
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  return { startAt: start.toISOString(), endAt: end.toISOString() };
}
