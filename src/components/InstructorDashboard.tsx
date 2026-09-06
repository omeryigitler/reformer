import { useMemo, useState } from "react";
import type { Booking, BookingStatus, StudioConfiguration, StudioSession } from "../domain/studio";
import type { UserType } from "../types";

type InstructorDashboardProps = {
  user: UserType;
  configuration: StudioConfiguration;
  onUpdateAttendance: (bookingId: string, status: Extract<BookingStatus, "attended" | "no_show">) => Promise<unknown>;
  onBackToSite: () => void;
  onLogout: () => void;
};

const MALTA_TIMEZONE = "Europe/Malta";

function formatDay(value: string) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: MALTA_TIMEZONE, weekday: "short" }).format(new Date(value)).toUpperCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: MALTA_TIMEZONE, day: "2-digit", month: "short" }).format(new Date(value)).toUpperCase();
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: MALTA_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function dateKey(value: string | Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: MALTA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  return `${year}-${month}-${day}`;
}

function attendanceError(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  if (code.includes("failed-precondition")) return "Attendance is not open for this session yet.";
  if (code.includes("permission-denied")) return "This session is not assigned to your instructor account.";
  if (error instanceof Error && error.message) return error.message;
  return "Attendance could not be updated.";
}

export function InstructorDashboard({
  user,
  configuration,
  onUpdateAttendance,
  onBackToSite,
  onLogout,
}: InstructorDashboardProps) {
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const instructor = configuration.instructors.find(
    (item) => item.id === user.instructorId || item.userId === user.uid || item.email.toLowerCase() === user.email.toLowerCase()
  );

  const sessions = useMemo(() => {
    if (!instructor) return [];
    return configuration.sessions
      .filter((session) => session.instructorId === instructor.id && session.status !== "cancelled")
      .sort((a, b) => a.startAt.localeCompare(b.startAt));
  }, [configuration.sessions, instructor]);

  const today = dateKey(new Date());
  const todaySessions = sessions.filter((session) => dateKey(session.startAt) === today);
  const upcomingSessions = sessions.filter((session) => new Date(session.startAt) > new Date() && dateKey(session.startAt) !== today);

  const sessionBookings = (session: StudioSession) =>
    configuration.bookings
      .filter((booking) => booking.sessionId === session.id && booking.status !== "cancelled")
      .sort((a, b) => (a.memberNameSnapshot || a.memberId).localeCompare(b.memberNameSnapshot || b.memberId));

  const updateAttendance = async (booking: Booking, status: "attended" | "no_show") => {
    try {
      setUpdatingBookingId(booking.id);
      setNotice(null);
      await onUpdateAttendance(booking.id, status);
      setNotice(`${booking.memberNameSnapshot || "Member"} marked ${status === "attended" ? "attended" : "no-show"}.`);
    } catch (error) {
      setNotice(attendanceError(error));
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const sessionRows = (items: StudioSession[]) => (
    <div className="rpm-session-list">
      {items.length > 0 ? items.map((session) => {
        const bookings = sessionBookings(session);
        const attendanceOpen = Date.now() >= new Date(session.startAt).getTime() - 15 * 60_000;
        return (
          <section key={session.id} className="rpm-instructor-session-block">
            <article className="rpm-session-row">
              <div className="rpm-session-date"><span>{formatDay(session.startAt)}</span><strong>{formatDate(session.startAt)}</strong></div>
              <p className="rpm-session-time">{formatTime(session.startAt)}</p>
              <div className="rpm-session-state">
                <div className="rpm-member-status-row"><span className="rpm-status-dot is-confirmed" /><span>{bookings.length} / {session.capacity}</span></div>
                <small>{session.classNameSnapshot}<br />{session.studioNameSnapshot}</small>
              </div>
            </article>

            {bookings.length > 0 && (
              <div className="rpm-instructor-roster">
                {bookings.map((booking, index) => (
                  <div className="rpm-instructor-roster-row" key={booking.id}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{booking.memberNameSnapshot || "Member"}</strong>
                    <span>{booking.status.replace("_", "-")}</span>
                    <div>
                      <button
                        type="button"
                        disabled={!attendanceOpen || updatingBookingId === booking.id}
                        className={booking.status === "attended" ? "is-active" : ""}
                        onClick={() => void updateAttendance(booking, "attended")}
                      >
                        present
                      </button>
                      <button
                        type="button"
                        disabled={!attendanceOpen || updatingBookingId === booking.id}
                        className={booking.status === "no_show" ? "is-active" : ""}
                        onClick={() => void updateAttendance(booking, "no_show")}
                      >
                        no-show
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      }) : <p className="rpm-member-empty">No sessions in this section.</p>}
    </div>
  );

  return (
    <div className="rpm-member-page">
      <header className="rpm-member-header">
        <button type="button" onClick={onBackToSite} className="rpm-member-brand">REFORMER PILATES MALTA</button>
        <span className="rpm-member-identity">{instructor?.name || user.displayName || user.email}</span>
        <div className="rpm-member-header-actions"><button type="button" onClick={onBackToSite}>site</button><button type="button" onClick={onLogout}>sign out</button></div>
      </header>

      <nav className="rpm-member-nav" aria-label="Instructor navigation">
        <button type="button" className="is-active">schedule</button>
      </nav>

      {notice && <div className="rpm-instructor-notice" role="status">{notice}</div>}

      <main className="rpm-member-main">
        <section className="rpm-member-simple-hero">
          <p className="rpm-member-kicker">INSTRUCTOR</p>
          <h1>your<br />schedule.</h1>
        </section>

        {!instructor ? (
          <section className="rpm-member-section">
            <div className="rpm-member-section-heading"><div><p className="rpm-member-kicker">ACCOUNT LINK</p><h2>Instructor profile not linked yet.</h2></div></div>
            <p className="rpm-member-empty">Ask an administrator to provision this instructor account from the Instructors section.</p>
          </section>
        ) : (
          <>
            <section className="rpm-member-section rpm-session-section">
              <div className="rpm-member-section-heading"><div><p className="rpm-member-kicker">TODAY</p><h2>Your studio hours.</h2></div></div>
              {sessionRows(todaySessions)}
            </section>
            <section className="rpm-member-section rpm-session-section">
              <div className="rpm-member-section-heading"><div><p className="rpm-member-kicker">UPCOMING</p><h2>What comes next.</h2></div></div>
              {sessionRows(upcomingSessions)}
            </section>
          </>
        )}
      </main>

      <footer className="rpm-member-footer"><span>REFORMER PILATES MALTA</span><span>INSTRUCTOR ACCESS</span></footer>
    </div>
  );
}
