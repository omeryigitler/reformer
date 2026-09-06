import { useMemo, useState } from "react";
import type { Booking, StudioConfiguration, StudioSession } from "../domain/studio";
import type { UserType } from "../types";

type MemberView = "practice" | "path" | "sessions" | "profile";

type MemberDashboardProps = {
  user: UserType;
  configuration: StudioConfiguration;
  onBookSession: (sessionId: string) => Promise<{ bookingId: string; status: "confirmed" }>;
  onBackToSite: () => void;
  onLogout: () => void;
};

type PathLevel = {
  id: number;
  name: string;
  description: string;
  requiredSessions: number;
};

type PracticeTrait = {
  name: string;
  label: string;
  symbol: string;
  earned: boolean;
};

const TEXT_ARROW = "\u2197\uFE0E";
const MALTA_TIMEZONE = "Europe/Malta";

const PATH_LEVELS: PathLevel[] = [
  { id: 1, name: "SEED", description: "Your practice begins with intention.", requiredSessions: 0 },
  { id: 2, name: "NOVA", description: "The first spark becomes a routine.", requiredSessions: 1 },
  { id: 3, name: "PULSE", description: "Rhythm and breath begin to settle.", requiredSessions: 5 },
  { id: 4, name: "FLUX", description: "Your movement is finding flow.", requiredSessions: 10 },
  { id: 5, name: "ORBIT", description: "Balance becomes increasingly instinctive.", requiredSessions: 20 },
  { id: 6, name: "ECLIPSE", description: "Focus deepens and distraction falls away.", requiredSessions: 30 },
  { id: 7, name: "NEBULA", description: "Strength and knowledge begin to expand.", requiredSessions: 50 },
  { id: 8, name: "QUASAR", description: "Control holds even as intensity rises.", requiredSessions: 75 },
  { id: 9, name: "SUPERNOVA", description: "Practice becomes visible transformation.", requiredSessions: 100 },
  { id: 10, name: "COSMOS", description: "Movement and practice feel inseparable.", requiredSessions: 150 },
];

function getDisplayName(user: UserType) {
  if (user.displayName?.trim()) return user.displayName.trim();
  const localPart = user.email.split("@")[0] ?? "member";
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: MALTA_TIMEZONE,
    day: "2-digit",
    month: "short",
  }).format(new Date(value)).toUpperCase();
}

function formatDay(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: MALTA_TIMEZONE,
    weekday: "short",
  }).format(new Date(value)).toUpperCase();
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: MALTA_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function dateKey(value: string) {
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

function memberSince(value?: string) {
  if (!value) return "JUST JOINED";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.toUpperCase();
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" })
    .format(date)
    .toUpperCase();
}

function hasThreeSessionsWithinSevenDays(bookings: Booking[]) {
  const timestamps = bookings
    .map((booking) => new Date(booking.startAt).getTime())
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  for (let index = 0; index < timestamps.length; index += 1) {
    if (timestamps[index + 2] !== undefined && timestamps[index + 2] - timestamps[index] <= 7 * 86_400_000) {
      return true;
    }
  }
  return false;
}

function bookingError(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  if (code.includes("resource-exhausted")) return "This session has just filled up.";
  if (code.includes("already-exists")) return "You already have this session booked.";
  if (code.includes("failed-precondition")) return "This session is no longer available.";
  if (code.includes("unauthenticated")) return "Please sign in again before booking.";
  if (error instanceof Error && error.message) return error.message;
  return "Booking could not be completed. Please try again.";
}

export function MemberDashboard({
  user,
  configuration,
  onBookSession,
  onBackToSite,
  onLogout,
}: MemberDashboardProps) {
  const [view, setView] = useState<MemberView>("practice");
  const [bookingSessionId, setBookingSessionId] = useState<string | null>(null);
  const [bookingNotice, setBookingNotice] = useState<string | null>(null);
  const displayName = getDisplayName(user);

  const myBookings = useMemo(
    () => configuration.bookings.filter((booking) => booking.memberId === user.uid),
    [configuration.bookings, user.uid]
  );
  const attendedBookings = useMemo(
    () => myBookings.filter((booking) => booking.status === "attended"),
    [myBookings]
  );
  const upcomingBookings = useMemo(
    () =>
      myBookings
        .filter((booking) => booking.status === "confirmed" && new Date(booking.startAt) > new Date())
        .sort((a, b) => a.startAt.localeCompare(b.startAt)),
    [myBookings]
  );
  const historyBookings = useMemo(
    () =>
      myBookings
        .filter((booking) => booking.status === "attended" || booking.status === "no_show")
        .sort((a, b) => b.startAt.localeCompare(a.startAt)),
    [myBookings]
  );
  const bookedSessionIds = useMemo(
    () => new Set(myBookings.filter((booking) => booking.status === "confirmed" || booking.status === "attended").map((booking) => booking.sessionId)),
    [myBookings]
  );
  const availableSessions = useMemo(
    () =>
      configuration.sessions
        .filter(
          (session) =>
            session.status === "published" &&
            new Date(session.startAt) > new Date() &&
            session.bookedCount < session.capacity &&
            !bookedSessionIds.has(session.id)
        )
        .sort((a, b) => a.startAt.localeCompare(b.startAt)),
    [configuration.sessions, bookedSessionIds]
  );

  const sessionsCompleted = attendedBookings.length;
  const currentLevelIndex = useMemo(() => {
    let current = 0;
    PATH_LEVELS.forEach((level, index) => {
      if (sessionsCompleted >= level.requiredSessions) current = index;
    });
    return current;
  }, [sessionsCompleted]);
  const currentLevel = PATH_LEVELS[currentLevelIndex];
  const nextLevel = PATH_LEVELS[currentLevelIndex + 1];
  const remaining = nextLevel ? Math.max(nextLevel.requiredSessions - sessionsCompleted, 0) : 0;
  const progressToNext = nextLevel
    ? Math.min(100, ((sessionsCompleted - currentLevel.requiredSessions) / (nextLevel.requiredSessions - currentLevel.requiredSessions)) * 100)
    : 100;

  const practiceRhythm = useMemo(() => {
    if (sessionsCompleted === 0) return "STARTING OUT";
    const registered = user.registeredAt ? new Date(user.registeredAt).getTime() : Date.now();
    const weeks = Math.max(1, (Date.now() - registered) / (7 * 86_400_000));
    return `${(sessionsCompleted / weeks).toFixed(1)} SESSIONS / WEEK`;
  }, [sessionsCompleted, user.registeredAt]);

  const preferredTime = useMemo(() => {
    if (attendedBookings.length === 0) return "TO BE DISCOVERED";
    let morning = 0;
    let daytime = 0;
    let evening = 0;
    attendedBookings.forEach((booking) => {
      const hour = Number(formatTime(booking.startAt).slice(0, 2));
      if (hour < 12) morning += 1;
      else if (hour >= 17) evening += 1;
      else daytime += 1;
    });
    if (morning >= daytime && morning >= evening) return "MORNINGS";
    if (evening >= morning && evening >= daytime) return "EVENINGS";
    return "DAYTIME";
  }, [attendedBookings]);

  const traits: PracticeTrait[] = useMemo(() => {
    const morning = attendedBookings.some((booking) => Number(formatTime(booking.startAt).slice(0, 2)) < 12);
    const evening = attendedBookings.some((booking) => Number(formatTime(booking.startAt).slice(0, 2)) >= 17);
    const weekend = attendedBookings.some((booking) => {
      const day = new Intl.DateTimeFormat("en-GB", { timeZone: MALTA_TIMEZONE, weekday: "short" }).format(new Date(booking.startAt));
      return day === "Sat" || day === "Sun";
    });
    const classStyles = new Set(attendedBookings.map((booking) => booking.classNameSnapshot));
    const oneYear = user.registeredAt
      ? Date.now() - new Date(user.registeredAt).getTime() >= 365 * 86_400_000
      : false;
    return [
      { name: "SOLARIS", label: "Morning practice", symbol: "☼", earned: morning },
      { name: "LUNAR", label: "Evening practice", symbol: "☽", earned: evening },
      { name: "ZENITH", label: "Weekend practice", symbol: "△", earned: weekend },
      { name: "GRAVITY", label: "7 sessions completed", symbol: "∞", earned: sessionsCompleted >= 7 },
      { name: "COMET", label: "3 sessions in 7 days", symbol: "☄", earned: hasThreeSessionsWithinSevenDays(attendedBookings) },
      { name: "AURORA", label: "Explore three class styles", symbol: "✧", earned: classStyles.size >= 3 },
      { name: "METEOR", label: "25 sessions completed", symbol: "◇", earned: sessionsCompleted >= 25 },
      { name: "POLARIS", label: "One year of practice", symbol: "✦", earned: oneYear },
    ];
  }, [attendedBookings, sessionsCompleted, user.registeredAt]);

  const groupedAvailability = useMemo(() => {
    const groups = new Map<string, StudioSession[]>();
    availableSessions.forEach((session) => {
      const key = dateKey(session.startAt);
      const existing = groups.get(key) ?? [];
      existing.push(session);
      groups.set(key, existing);
    });
    return Array.from(groups.entries()).slice(0, 4);
  }, [availableSessions]);

  const confirmedSession = upcomingBookings[0];

  const handleBook = async (session: StudioSession) => {
    try {
      setBookingSessionId(session.id);
      setBookingNotice(null);
      await onBookSession(session.id);
      setBookingNotice(`BOOKED — ${session.classNameSnapshot}, ${formatDate(session.startAt)} at ${formatTime(session.startAt)}.`);
    } catch (error) {
      setBookingNotice(bookingError(error));
    } finally {
      setBookingSessionId(null);
    }
  };

  const availabilityGrid = (showHeading = true) => (
    <section className="rpm-member-section">
      {showHeading && (
        <div className="rpm-member-section-heading">
          <div>
            <p className="rpm-member-kicker">AVAILABLE SESSIONS</p>
            <h2>Choose your next hour.</h2>
          </div>
        </div>
      )}
      {bookingNotice && <p className="rpm-booking-notice" role="status">{bookingNotice}</p>}
      {groupedAvailability.length > 0 ? (
        <div className="rpm-availability-grid">
          {groupedAvailability.map(([, sessions]) => (
            <article key={dateKey(sessions[0].startAt)} className="rpm-availability-day">
              <p>{formatDay(sessions[0].startAt)} {formatDate(sessions[0].startAt)}</p>
              {sessions.map((session) => (
                <button
                  type="button"
                  key={session.id}
                  className="rpm-availability-session"
                  disabled={bookingSessionId === session.id}
                  onClick={() => void handleBook(session)}
                >
                  <span className="rpm-availability-session-main">
                    <strong>{formatTime(session.startAt)}</strong>
                    <small>{session.classNameSnapshot}<br />{session.studioNameSnapshot} · with {session.instructorNameSnapshot}</small>
                  </span>
                  <span aria-hidden="true">{bookingSessionId === session.id ? "booking…" : `book ${TEXT_ARROW}`}</span>
                </button>
              ))}
            </article>
          ))}
        </div>
      ) : (
        <p className="rpm-member-empty">No published sessions with open spots right now.</p>
      )}
    </section>
  );

  const renderPractice = () => (
    <>
      <section className="rpm-member-hero rpm-member-grid-lines">
        <div className="rpm-member-hero-copy">
          <p className="rpm-member-kicker">MEMBER / YOUR PRACTICE</p>
          <h1>your<br />practice.</h1>
          <p className="rpm-member-intro">A quiet view of what is next, where your practice is going and the rhythm you are building.</p>
        </div>
        <div className="rpm-next-session">
          <p className="rpm-member-kicker">NEXT SESSION</p>
          {confirmedSession ? (
            <>
              <p className="rpm-next-date">{formatDate(confirmedSession.startAt)}</p>
              <p className="rpm-next-time">{formatTime(confirmedSession.startAt)}</p>
              <div className="rpm-member-status-row"><span className="rpm-status-dot is-confirmed" /><span>CONFIRMED</span></div>
              <p className="rpm-next-session-detail">{confirmedSession.classNameSnapshot}<br />{confirmedSession.studioNameSnapshot}<br />with {confirmedSession.instructorNameSnapshot}</p>
              <button type="button" className="rpm-inline-action" onClick={() => setView("sessions")}><span>view session</span><span aria-hidden="true">{TEXT_ARROW}</span></button>
            </>
          ) : <p className="rpm-member-empty">No booked session yet.</p>}
        </div>
      </section>

      <section className="rpm-member-summary-grid">
        <article className="rpm-member-summary rpm-member-summary--current">
          <p className="rpm-member-kicker">CURRENT PATH</p>
          <div className="rpm-current-level-lockup"><span>{String(currentLevel.id).padStart(2, "0")}</span><strong>{currentLevel.name}</strong></div>
          <p>{currentLevel.description}</p>
          {nextLevel && <small>{remaining} sessions to {nextLevel.name}</small>}
        </article>
        <article className="rpm-member-summary">
          <p className="rpm-member-kicker">ATTENDED</p>
          <strong className="rpm-summary-number">{sessionsCompleted}</strong>
          <p>sessions</p>
          <small>member since {memberSince(user.registeredAt).toLowerCase()}</small>
        </article>
        <article className="rpm-member-summary">
          <p className="rpm-member-kicker">PRACTICE RHYTHM</p>
          <strong className="rpm-summary-word">{practiceRhythm}</strong>
          <small>most often / {preferredTime.toLowerCase()}</small>
        </article>
      </section>

      <section className="rpm-path-preview rpm-member-section">
        <div className="rpm-member-section-heading">
          <div><p className="rpm-member-kicker">MY PATH</p><h2>Ten chapters. One practice.</h2></div>
          <button type="button" className="rpm-inline-action" onClick={() => setView("path")}><span>explore my path</span><span aria-hidden="true">{TEXT_ARROW}</span></button>
        </div>
        <div className="rpm-path-mini" aria-label="Your path progress">
          {PATH_LEVELS.map((level, index) => {
            const state = index < currentLevelIndex ? "complete" : index === currentLevelIndex ? "current" : "future";
            return <button type="button" key={level.id} className={`rpm-path-mini-step is-${state}`} onClick={() => setView("path")} aria-label={`${level.name}, ${state}`}><span className="rpm-path-mini-index">{String(level.id).padStart(2, "0")}</span><span className="rpm-path-mini-line" /><span className="rpm-path-mini-name">{level.name}</span></button>;
          })}
        </div>
      </section>

      {availabilityGrid(true)}
    </>
  );

  const renderPath = () => (
    <>
      <section className="rpm-path-hero">
        <div><p className="rpm-member-kicker">MY PATH / {String(currentLevel.id).padStart(2, "0")}</p><h1>{currentLevel.name}.</h1></div>
        <div className="rpm-path-hero-meta">
          <p>{sessionsCompleted} sessions attended.</p>
          {nextLevel && <p>{remaining} sessions until {nextLevel.name}.</p>}
          <div className="rpm-path-progress" aria-label={`${Math.round(progressToNext)}% to ${nextLevel?.name ?? "complete"}`}><span style={{ width: `${progressToNext}%` }} /></div>
          <div className="rpm-path-progress-labels"><span>{currentLevel.requiredSessions}</span><span>{nextLevel?.requiredSessions ?? sessionsCompleted}</span></div>
        </div>
      </section>
      <section className="rpm-path-timeline rpm-member-section">
        {PATH_LEVELS.map((level, index) => {
          const state = index < currentLevelIndex ? "complete" : index === currentLevelIndex ? "current" : index === currentLevelIndex + 1 ? "next" : "future";
          return <article key={level.id} className={`rpm-path-row is-${state}`}><span className="rpm-path-row-index">{String(level.id).padStart(2, "0")}</span><div className="rpm-path-row-main"><h2>{level.name}</h2><p>{level.description}</p></div><div className="rpm-path-row-state"><span>{state === "current" ? "NOW" : state === "complete" ? "COMPLETE" : state === "next" ? "NEXT" : `${level.requiredSessions} SESSIONS`}</span>{state === "current" && nextLevel && <small>{remaining} to the next chapter</small>}{state === "next" && <small>available at session {level.requiredSessions}</small>}</div></article>;
        })}
      </section>
      <section className="rpm-member-section rpm-traits-section">
        <div className="rpm-member-section-heading"><div><p className="rpm-member-kicker">HOW YOU PRACTICE</p><h2>Small patterns that make your practice yours.</h2></div></div>
        <div className="rpm-traits-grid">
          {traits.map((trait, index) => <article key={trait.name} className={`rpm-trait-cell ${trait.earned ? "is-earned" : "is-future"}`}><div className="rpm-trait-topline"><span>{String(index + 1).padStart(2, "0")}</span><span>{trait.earned ? "EARNED" : "TO COME"}</span></div><span className="rpm-trait-symbol" aria-hidden="true">{trait.symbol}</span><h3>{trait.name}</h3><p>{trait.label}</p></article>)}
        </div>
      </section>
    </>
  );

  const renderSessions = () => (
    <>
      <section className="rpm-member-simple-hero"><p className="rpm-member-kicker">SESSIONS</p><h1>your<br />sessions.</h1></section>
      <section className="rpm-member-section rpm-session-section">
        <div className="rpm-member-section-heading"><div><p className="rpm-member-kicker">UPCOMING</p><h2>What is next.</h2></div></div>
        <div className="rpm-session-list">
          {upcomingBookings.length > 0 ? upcomingBookings.map((booking) => (
            <article key={booking.id} className="rpm-session-row">
              <div className="rpm-session-date"><span>{formatDay(booking.startAt)}</span><strong>{formatDate(booking.startAt)}</strong></div>
              <p className="rpm-session-time">{formatTime(booking.startAt)}</p>
              <div className="rpm-session-state"><div className="rpm-member-status-row"><span className="rpm-status-dot is-confirmed" /><span>CONFIRMED</span></div><small>{booking.classNameSnapshot}<br />{booking.studioNameSnapshot} · with {booking.instructorNameSnapshot}</small></div>
            </article>
          )) : <p className="rpm-member-empty">No upcoming bookings.</p>}
        </div>
      </section>
      {availabilityGrid(true)}
      <section className="rpm-member-section rpm-history-section">
        <div className="rpm-member-section-heading"><div><p className="rpm-member-kicker">HISTORY / {sessionsCompleted} ATTENDED</p><h2>Previous sessions.</h2></div></div>
        <div className="rpm-history-list">
          {historyBookings.length > 0 ? historyBookings.map((booking) => <article key={booking.id}><span>{formatDate(booking.startAt)} · {booking.classNameSnapshot}</span><strong>{formatTime(booking.startAt)}</strong><span>{booking.status === "attended" ? "ATTENDED" : "NO-SHOW"}</span></article>) : <p className="rpm-member-empty">Your attended sessions will appear here.</p>}
        </div>
      </section>
    </>
  );

  const renderProfile = () => (
    <>
      <section className="rpm-member-simple-hero"><p className="rpm-member-kicker">PROFILE</p><h1>your<br />details.</h1></section>
      <section className="rpm-profile-grid rpm-member-section">
        <div className="rpm-profile-column"><p className="rpm-member-kicker">PERSONAL DETAILS</p><dl><div><dt>NAME</dt><dd>{displayName || "Member"}</dd></div><div><dt>EMAIL</dt><dd>{user.email}</dd></div>{user.phone && <div><dt>PHONE</dt><dd>{user.phone}</dd></div>}<div><dt>MEMBER SINCE</dt><dd>{memberSince(user.registeredAt)}</dd></div></dl></div>
        <div className="rpm-profile-column"><p className="rpm-member-kicker">PRACTICE</p><dl><div><dt>USUAL RHYTHM</dt><dd>{practiceRhythm}</dd></div><div><dt>PREFERRED TIME</dt><dd>{preferredTime}</dd></div><div><dt>ATTENDED</dt><dd>{sessionsCompleted} SESSIONS</dd></div><div><dt>LOCATION</dt><dd>ST JULIAN'S · MALTA</dd></div></dl></div>
      </section>
    </>
  );

  return (
    <div className="rpm-member-page">
      <header className="rpm-member-header">
        <button type="button" onClick={onBackToSite} className="rpm-member-brand">REFORMER PILATES MALTA</button>
        <span className="rpm-member-identity">{displayName || user.email}</span>
        <div className="rpm-member-header-actions"><button type="button" onClick={onBackToSite}>site</button><button type="button" onClick={onLogout}>sign out</button></div>
      </header>
      <nav className="rpm-member-nav" aria-label="Member navigation">
        {(["practice", "path", "sessions", "profile"] as MemberView[]).map((item) => <button type="button" key={item} className={view === item ? "is-active" : ""} onClick={() => setView(item)}>{item === "path" ? "my path" : item}</button>)}
      </nav>
      <main className="rpm-member-main">{view === "practice" && renderPractice()}{view === "path" && renderPath()}{view === "sessions" && renderSessions()}{view === "profile" && renderProfile()}</main>
      <footer className="rpm-member-footer"><span>REFORMER PILATES MALTA</span><span>ST JULIAN'S · MALTA</span></footer>
    </div>
  );
}
