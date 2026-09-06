import { useMemo, useState } from "react";
import type { UserType } from "../types";

type MemberView = "practice" | "path" | "sessions" | "profile";
type SessionStatus = "confirmed" | "pending" | "completed";

type MemberDashboardProps = {
  user: UserType;
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

type SessionItem = {
  date: string;
  day: string;
  time: string;
  status: SessionStatus;
  note?: string;
};

const TEXT_ARROW = "\u2197\uFE0E";

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

// Design fixture until the production booking/history adapter is connected.
const MEMBER_PREVIEW = {
  sessionsCompleted: 12,
  memberSince: "JUNE 2026",
  rhythm: "2 SESSIONS / WEEK",
  activeTime: "EVENINGS",
  sessions: [
    { date: "09 SEP", day: "WED", time: "18:00", status: "confirmed" as const },
    {
      date: "12 SEP",
      day: "SAT",
      time: "10:00",
      status: "pending" as const,
      note: "Your request has been received. We’ll confirm your session shortly.",
    },
    { date: "04 SEP", day: "FRI", time: "18:00", status: "completed" as const },
    { date: "01 SEP", day: "TUE", time: "10:00", status: "completed" as const },
    { date: "27 AUG", day: "THU", time: "18:00", status: "completed" as const },
  ] satisfies SessionItem[],
};

const AVAILABLE_SESSIONS = [
  ["MON 07", "09:00", "18:00"],
  ["TUE 08", "10:00", "17:30"],
  ["WED 09", "11:00", "19:00"],
  ["THU 10", "09:30", "18:00"],
];

function getDisplayName(user: UserType) {
  const localPart = user.email.split("@")[0] ?? "member";
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function statusLabel(status: SessionStatus) {
  if (status === "pending") return "PENDING CONFIRMATION";
  if (status === "completed") return "COMPLETED";
  return "CONFIRMED";
}

export function MemberDashboard({ user, onBackToSite, onLogout }: MemberDashboardProps) {
  const [view, setView] = useState<MemberView>("practice");
  const sessionsCompleted = MEMBER_PREVIEW.sessionsCompleted;
  const displayName = getDisplayName(user);

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
    ? Math.min(
        100,
        ((sessionsCompleted - currentLevel.requiredSessions) /
          (nextLevel.requiredSessions - currentLevel.requiredSessions)) *
          100
      )
    : 100;

  const traits: PracticeTrait[] = [
    { name: "SOLARIS", label: "Morning practice", symbol: "☼", earned: true },
    { name: "LUNAR", label: "Evening practice", symbol: "☽", earned: true },
    { name: "ZENITH", label: "Weekend practice", symbol: "△", earned: true },
    { name: "GRAVITY", label: "7 sessions completed", symbol: "∞", earned: true },
    { name: "COMET", label: "3 sessions in 7 days", symbol: "☄", earned: false },
    { name: "AURORA", label: "Explore three class styles", symbol: "✧", earned: false },
    { name: "METEOR", label: "25 sessions completed", symbol: "◇", earned: false },
    { name: "POLARIS", label: "One year of practice", symbol: "✦", earned: false },
  ];

  const confirmedSession = MEMBER_PREVIEW.sessions.find((session) => session.status === "confirmed");
  const pendingSessions = MEMBER_PREVIEW.sessions.filter((session) => session.status === "pending");
  const history = MEMBER_PREVIEW.sessions.filter((session) => session.status === "completed");

  const renderPractice = () => (
    <>
      <section className="rpm-member-hero rpm-member-grid-lines">
        <div className="rpm-member-hero-copy">
          <p className="rpm-member-kicker">MEMBER / YOUR PRACTICE</p>
          <h1>
            your
            <br />
            practice.
          </h1>
          <p className="rpm-member-intro">
            A quiet view of what is next, where your practice is going and the rhythm you are building.
          </p>
        </div>

        <div className="rpm-next-session">
          <p className="rpm-member-kicker">NEXT SESSION</p>
          {confirmedSession ? (
            <>
              <p className="rpm-next-date">{confirmedSession.date}</p>
              <p className="rpm-next-time">{confirmedSession.time}</p>
              <div className="rpm-member-status-row">
                <span className="rpm-status-dot is-confirmed" />
                <span>{statusLabel(confirmedSession.status)}</span>
              </div>
              <button type="button" className="rpm-inline-action" onClick={() => setView("sessions")}>
                <span>view session</span>
                <span aria-hidden="true">{TEXT_ARROW}</span>
              </button>
            </>
          ) : (
            <p className="rpm-member-empty">No confirmed session yet.</p>
          )}
        </div>
      </section>

      <section className="rpm-member-summary-grid">
        <article className="rpm-member-summary rpm-member-summary--current">
          <p className="rpm-member-kicker">CURRENT PATH</p>
          <div className="rpm-current-level-lockup">
            <span>{String(currentLevel.id).padStart(2, "0")}</span>
            <strong>{currentLevel.name}</strong>
          </div>
          <p>{currentLevel.description}</p>
          {nextLevel && <small>{remaining} sessions to {nextLevel.name}</small>}
        </article>

        <article className="rpm-member-summary">
          <p className="rpm-member-kicker">COMPLETED</p>
          <strong className="rpm-summary-number">{sessionsCompleted}</strong>
          <p>sessions</p>
          <small>member since {MEMBER_PREVIEW.memberSince.toLowerCase()}</small>
        </article>

        <article className="rpm-member-summary">
          <p className="rpm-member-kicker">PRACTICE RHYTHM</p>
          <strong className="rpm-summary-word">{MEMBER_PREVIEW.rhythm}</strong>
          <small>most often / {MEMBER_PREVIEW.activeTime.toLowerCase()}</small>
        </article>
      </section>

      <section className="rpm-path-preview rpm-member-section">
        <div className="rpm-member-section-heading">
          <div>
            <p className="rpm-member-kicker">MY PATH</p>
            <h2>Ten chapters. One practice.</h2>
          </div>
          <button type="button" className="rpm-inline-action" onClick={() => setView("path")}>
            <span>explore my path</span>
            <span aria-hidden="true">{TEXT_ARROW}</span>
          </button>
        </div>

        <div className="rpm-path-mini" aria-label="Your path progress">
          {PATH_LEVELS.map((level, index) => {
            const state = index < currentLevelIndex ? "complete" : index === currentLevelIndex ? "current" : "future";
            return (
              <button
                type="button"
                key={level.id}
                className={`rpm-path-mini-step is-${state}`}
                onClick={() => setView("path")}
                aria-label={`${level.name}, ${state}`}
              >
                <span className="rpm-path-mini-index">{String(level.id).padStart(2, "0")}</span>
                <span className="rpm-path-mini-line" />
                <span className="rpm-path-mini-name">{level.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rpm-member-section rpm-book-preview">
        <div className="rpm-member-section-heading">
          <div>
            <p className="rpm-member-kicker">BOOK A SESSION</p>
            <h2>Choose your next hour.</h2>
          </div>
          <button type="button" className="rpm-inline-action" onClick={() => setView("sessions")}>
            <span>all sessions</span>
            <span aria-hidden="true">{TEXT_ARROW}</span>
          </button>
        </div>
        <div className="rpm-availability-grid">
          {AVAILABLE_SESSIONS.map(([date, ...times]) => (
            <article key={date} className="rpm-availability-day">
              <p>{date}</p>
              {times.map((time) => (
                <button type="button" key={time}>
                  <span>{time}</span>
                  <span aria-hidden="true">{TEXT_ARROW}</span>
                </button>
              ))}
            </article>
          ))}
        </div>
      </section>
    </>
  );

  const renderPath = () => (
    <>
      <section className="rpm-path-hero">
        <div>
          <p className="rpm-member-kicker">MY PATH / {String(currentLevel.id).padStart(2, "0")}</p>
          <h1>{currentLevel.name}.</h1>
        </div>
        <div className="rpm-path-hero-meta">
          <p>{sessionsCompleted} sessions completed.</p>
          {nextLevel && <p>{remaining} sessions until {nextLevel.name}.</p>}
          <div className="rpm-path-progress" aria-label={`${Math.round(progressToNext)}% to ${nextLevel?.name ?? "complete"}`}>
            <span style={{ width: `${progressToNext}%` }} />
          </div>
          <div className="rpm-path-progress-labels">
            <span>{currentLevel.requiredSessions}</span>
            <span>{nextLevel?.requiredSessions ?? sessionsCompleted}</span>
          </div>
        </div>
      </section>

      <section className="rpm-path-timeline rpm-member-section">
        {PATH_LEVELS.map((level, index) => {
          const state = index < currentLevelIndex ? "complete" : index === currentLevelIndex ? "current" : index === currentLevelIndex + 1 ? "next" : "future";
          return (
            <article key={level.id} className={`rpm-path-row is-${state}`}>
              <span className="rpm-path-row-index">{String(level.id).padStart(2, "0")}</span>
              <div className="rpm-path-row-main">
                <h2>{level.name}</h2>
                <p>{level.description}</p>
              </div>
              <div className="rpm-path-row-state">
                <span>{state === "current" ? "NOW" : state === "complete" ? "COMPLETE" : state === "next" ? "NEXT" : `${level.requiredSessions} SESSIONS`}</span>
                {state === "current" && nextLevel && <small>{remaining} to the next chapter</small>}
                {state === "next" && <small>available at session {level.requiredSessions}</small>}
              </div>
            </article>
          );
        })}
      </section>

      <section className="rpm-member-section rpm-traits-section">
        <div className="rpm-member-section-heading">
          <div>
            <p className="rpm-member-kicker">HOW YOU PRACTICE</p>
            <h2>Small patterns that make your practice yours.</h2>
          </div>
        </div>
        <div className="rpm-traits-grid">
          {traits.map((trait, index) => (
            <article key={trait.name} className={`rpm-trait-cell ${trait.earned ? "is-earned" : "is-future"}`}>
              <div className="rpm-trait-topline">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{trait.earned ? "EARNED" : "TO COME"}</span>
              </div>
              <span className="rpm-trait-symbol" aria-hidden="true">{trait.symbol}</span>
              <h3>{trait.name}</h3>
              <p>{trait.label}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );

  const renderSessions = () => (
    <>
      <section className="rpm-member-simple-hero">
        <p className="rpm-member-kicker">SESSIONS</p>
        <h1>
          your
          <br />
          sessions.
        </h1>
      </section>

      <section className="rpm-member-section rpm-session-section">
        <div className="rpm-member-section-heading">
          <div>
            <p className="rpm-member-kicker">UPCOMING</p>
            <h2>What is next.</h2>
          </div>
        </div>
        <div className="rpm-session-list">
          {MEMBER_PREVIEW.sessions.filter((session) => session.status !== "completed").map((session) => (
            <article key={`${session.date}-${session.time}`} className="rpm-session-row">
              <div className="rpm-session-date">
                <span>{session.day}</span>
                <strong>{session.date}</strong>
              </div>
              <p className="rpm-session-time">{session.time}</p>
              <div className="rpm-session-state">
                <div className="rpm-member-status-row">
                  <span className={`rpm-status-dot is-${session.status}`} />
                  <span>{statusLabel(session.status)}</span>
                </div>
                {session.note && <small>{session.note}</small>}
              </div>
            </article>
          ))}
        </div>
      </section>

      {pendingSessions.length > 0 && (
        <section className="rpm-member-note">
          <p className="rpm-member-kicker">PENDING REQUEST</p>
          <p>Your instructor will contact you during the day to confirm your lesson.</p>
        </section>
      )}

      <section className="rpm-member-section">
        <div className="rpm-member-section-heading">
          <div>
            <p className="rpm-member-kicker">AVAILABLE SESSIONS</p>
            <h2>Choose your next hour.</h2>
          </div>
        </div>
        <div className="rpm-availability-grid">
          {AVAILABLE_SESSIONS.map(([date, ...times]) => (
            <article key={date} className="rpm-availability-day">
              <p>{date}</p>
              {times.map((time) => (
                <button type="button" key={time}>
                  <span>{time}</span>
                  <span aria-hidden="true">book {TEXT_ARROW}</span>
                </button>
              ))}
            </article>
          ))}
        </div>
      </section>

      <section className="rpm-member-section rpm-history-section">
        <div className="rpm-member-section-heading">
          <div>
            <p className="rpm-member-kicker">HISTORY / {sessionsCompleted} TOTAL</p>
            <h2>Previous sessions.</h2>
          </div>
        </div>
        <div className="rpm-history-list">
          {history.map((session) => (
            <article key={`${session.date}-${session.time}`}>
              <span>{session.date}</span>
              <strong>{session.time}</strong>
              <span>COMPLETED</span>
            </article>
          ))}
        </div>
      </section>
    </>
  );

  const renderProfile = () => (
    <>
      <section className="rpm-member-simple-hero">
        <p className="rpm-member-kicker">PROFILE</p>
        <h1>
          your
          <br />
          details.
        </h1>
      </section>

      <section className="rpm-profile-grid rpm-member-section">
        <div className="rpm-profile-column">
          <p className="rpm-member-kicker">PERSONAL DETAILS</p>
          <dl>
            <div>
              <dt>NAME</dt>
              <dd>{displayName || "Member"}</dd>
            </div>
            <div>
              <dt>EMAIL</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>MEMBER SINCE</dt>
              <dd>{MEMBER_PREVIEW.memberSince}</dd>
            </div>
          </dl>
        </div>
        <div className="rpm-profile-column">
          <p className="rpm-member-kicker">PRACTICE PREFERENCES</p>
          <dl>
            <div>
              <dt>USUAL RHYTHM</dt>
              <dd>{MEMBER_PREVIEW.rhythm}</dd>
            </div>
            <div>
              <dt>PREFERRED TIME</dt>
              <dd>{MEMBER_PREVIEW.activeTime}</dd>
            </div>
            <div>
              <dt>STUDIO</dt>
              <dd>ST JULIAN'S · MALTA</dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );

  return (
    <div className="rpm-member-page">
      <header className="rpm-member-header">
        <button type="button" onClick={onBackToSite} className="rpm-member-brand">
          REFORMER PILATES MALTA
        </button>
        <span className="rpm-member-identity">{displayName || user.email}</span>
        <div className="rpm-member-header-actions">
          <button type="button" onClick={onBackToSite}>site</button>
          <button type="button" onClick={onLogout}>sign out</button>
        </div>
      </header>

      <nav className="rpm-member-nav" aria-label="Member navigation">
        {(["practice", "path", "sessions", "profile"] as MemberView[]).map((item) => (
          <button
            type="button"
            key={item}
            className={view === item ? "is-active" : ""}
            onClick={() => setView(item)}
          >
            {item === "path" ? "my path" : item}
          </button>
        ))}
      </nav>

      <main className="rpm-member-main">
        {view === "practice" && renderPractice()}
        {view === "path" && renderPath()}
        {view === "sessions" && renderSessions()}
        {view === "profile" && renderProfile()}
      </main>

      <footer className="rpm-member-footer">
        <span>REFORMER PILATES MALTA</span>
        <span>ST JULIAN'S · MALTA</span>
      </footer>
    </div>
  );
}
