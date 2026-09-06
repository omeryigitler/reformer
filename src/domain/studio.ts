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
  emailStatus?: "queued" | "sent" | "failed";
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

export function buildSessionTimes(date: string, startTime: string, durationMinutes: number) {
  const start = new Date(`${date}T${startTime}:00`);
  if (Number.isNaN(start.getTime())) throw new Error("Invalid session date or time.");
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  return { startAt: start.toISOString(), endAt: end.toISOString() };
}
