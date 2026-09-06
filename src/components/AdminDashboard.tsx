import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { UserType } from "../types";
import {
  buildSessionTimes,
  intervalsOverlap,
  type ClassCategory,
  type ClassDefinition,
  type Instructor,
  type Studio,
  type StudioConfiguration,
  type StudioSession,
} from "../domain/studio";

type AdminView = "schedule" | "studios" | "classes" | "instructors";

type AdminDashboardProps = {
  user: UserType;
  configuration: StudioConfiguration;
  setConfiguration: (updater: (current: StudioConfiguration) => StudioConfiguration) => void;
  onBackToSite: () => void;
  onLogout: () => void;
};

const TEXT_ARROW = "\u2197\uFE0E";
const CATEGORY_OPTIONS: ClassCategory[] = ["reformer", "mat", "yoga", "private", "other"];

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatSessionDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function EmptyState({ children }: { children: string }) {
  return <p className="rpm-admin-empty">{children}</p>;
}

export function AdminDashboard({
  user,
  configuration,
  setConfiguration,
  onBackToSite,
  onLogout,
}: AdminDashboardProps) {
  const [view, setView] = useState<AdminView>("schedule");
  const [notice, setNotice] = useState<string | null>(null);

  const activeStudios = useMemo(
    () => configuration.studios.filter((studio) => studio.status === "active"),
    [configuration.studios]
  );
  const activeClasses = useMemo(
    () => configuration.classes.filter((item) => item.status === "active"),
    [configuration.classes]
  );
  const activeInstructors = useMemo(
    () => configuration.instructors.filter((item) => item.status === "active"),
    [configuration.instructors]
  );

  const [studioName, setStudioName] = useState("");
  const [studioCapacity, setStudioCapacity] = useState("8");
  const [studioDescription, setStudioDescription] = useState("");

  const [className, setClassName] = useState("");
  const [classCategory, setClassCategory] = useState<ClassCategory>("reformer");
  const [classDuration, setClassDuration] = useState("50");
  const [classCapacity, setClassCapacity] = useState("4");
  const [classDescription, setClassDescription] = useState("");
  const [classStudioIds, setClassStudioIds] = useState<string[]>([]);

  const [instructorName, setInstructorName] = useState("");
  const [instructorEmail, setInstructorEmail] = useState("");
  const [instructorPhone, setInstructorPhone] = useState("");
  const [instructorBio, setInstructorBio] = useState("");
  const [instructorClassIds, setInstructorClassIds] = useState<string[]>([]);
  const [instructorStudioIds, setInstructorStudioIds] = useState<string[]>([]);
  const [instructorAccountAccess, setInstructorAccountAccess] = useState(false);

  const [sessionClassId, setSessionClassId] = useState("");
  const [sessionStudioId, setSessionStudioId] = useState("");
  const [sessionInstructorId, setSessionInstructorId] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [sessionDuration, setSessionDuration] = useState("50");
  const [sessionCapacity, setSessionCapacity] = useState("4");

  const selectedClass = configuration.classes.find((item) => item.id === sessionClassId);
  const selectedStudio = configuration.studios.find((item) => item.id === sessionStudioId);

  const compatibleStudios = useMemo(() => {
    if (!selectedClass || selectedClass.allowedStudioIds.length === 0) return activeStudios;
    return activeStudios.filter((studio) => selectedClass.allowedStudioIds.includes(studio.id));
  }, [activeStudios, selectedClass]);

  const compatibleInstructors = useMemo(() => {
    return activeInstructors.filter((instructor) => {
      const classMatch = instructor.classIds.length === 0 || instructor.classIds.includes(sessionClassId);
      const studioMatch = instructor.studioIds.length === 0 || instructor.studioIds.includes(sessionStudioId);
      return classMatch && studioMatch;
    });
  }, [activeInstructors, sessionClassId, sessionStudioId]);

  const upcomingSessions = useMemo(
    () =>
      [...configuration.sessions]
        .filter((session) => session.status !== "cancelled")
        .sort((a, b) => a.startAt.localeCompare(b.startAt)),
    [configuration.sessions]
  );

  const toggleSelection = (id: string, values: string[], setter: (next: string[]) => void) => {
    setter(values.includes(id) ? values.filter((value) => value !== id) : [...values, id]);
  };

  const addStudio = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const capacity = Number(studioCapacity);
    const name = studioName.trim();
    if (!name || !Number.isInteger(capacity) || capacity < 1) {
      setNotice("Studio name and a valid maximum capacity are required.");
      return;
    }
    const duplicate = configuration.studios.some(
      (studio) => studio.status === "active" && studio.name.trim().toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      setNotice("An active studio with this name already exists.");
      return;
    }

    const locationId = configuration.locations.find((location) => location.status === "active")?.id;
    if (!locationId) {
      setNotice("Create an active location before adding a studio.");
      return;
    }

    const studio: Studio = {
      id: makeId("studio"),
      locationId,
      name,
      description: studioDescription.trim(),
      maxCapacity: capacity,
      status: "active",
      sortOrder: configuration.studios.length + 1,
      createdAt: new Date().toISOString(),
    };
    setConfiguration((current) => ({ ...current, studios: [...current.studios, studio] }));
    setStudioName("");
    setStudioDescription("");
    setNotice(`${studio.name} created.`);
  };

  const archiveStudio = (studioId: string) => {
    const hasFutureSession = configuration.sessions.some(
      (session) => session.studioId === studioId && session.status !== "cancelled" && new Date(session.endAt) > new Date()
    );
    if (hasFutureSession) {
      setNotice("This studio has active future sessions. Cancel or move them before archiving the studio.");
      return;
    }
    setConfiguration((current) => ({
      ...current,
      studios: current.studios.map((studio) =>
        studio.id === studioId ? { ...studio, status: "archived" } : studio
      ),
    }));
    setNotice("Studio archived. Historical sessions remain unchanged.");
  };

  const addClass = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const duration = Number(classDuration);
    const capacity = Number(classCapacity);
    const name = className.trim();
    if (!name || !Number.isInteger(duration) || duration < 10 || !Number.isInteger(capacity) || capacity < 1) {
      setNotice("Class name, duration and capacity are required.");
      return;
    }
    const allowedStudios = classStudioIds.length > 0 ? classStudioIds : activeStudios.map((studio) => studio.id);
    const tooSmall = allowedStudios.some((studioId) => {
      const studio = configuration.studios.find((item) => item.id === studioId);
      return studio ? capacity > studio.maxCapacity : false;
    });
    if (tooSmall) {
      setNotice("Class default capacity cannot exceed the capacity of an allowed studio.");
      return;
    }

    const definition: ClassDefinition = {
      id: makeId("class"),
      name,
      category: classCategory,
      description: classDescription.trim(),
      defaultDurationMinutes: duration,
      defaultCapacity: capacity,
      allowedStudioIds: allowedStudios,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    setConfiguration((current) => ({ ...current, classes: [...current.classes, definition] }));
    setClassName("");
    setClassDescription("");
    setClassStudioIds([]);
    setNotice(`${definition.name} created.`);
  };

  const archiveClass = (classId: string) => {
    setConfiguration((current) => ({
      ...current,
      classes: current.classes.map((item) =>
        item.id === classId ? { ...item, status: "archived" } : item
      ),
    }));
    setNotice("Class archived. Existing session snapshots remain available.");
  };

  const addInstructor = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = instructorName.trim();
    const email = instructorEmail.trim().toLowerCase();
    if (!name || !email.includes("@")) {
      setNotice("Instructor name and a valid email address are required.");
      return;
    }
    if (configuration.instructors.some((instructor) => instructor.email === email && instructor.status === "active")) {
      setNotice("An active instructor with this email already exists.");
      return;
    }

    const instructor: Instructor = {
      id: makeId("instructor"),
      name,
      email,
      phone: instructorPhone.trim(),
      bio: instructorBio.trim(),
      classIds: instructorClassIds,
      studioIds: instructorStudioIds,
      accountAccess: instructorAccountAccess,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    setConfiguration((current) => ({ ...current, instructors: [...current.instructors, instructor] }));
    setInstructorName("");
    setInstructorEmail("");
    setInstructorPhone("");
    setInstructorBio("");
    setInstructorClassIds([]);
    setInstructorStudioIds([]);
    setInstructorAccountAccess(false);
    setNotice(`${instructor.name} added as an instructor.`);
  };

  const archiveInstructor = (instructorId: string) => {
    const hasFutureSession = configuration.sessions.some(
      (session) =>
        session.instructorId === instructorId &&
        session.status !== "cancelled" &&
        new Date(session.endAt) > new Date()
    );
    if (hasFutureSession) {
      setNotice("This instructor has active future sessions. Reassign them before archiving the instructor.");
      return;
    }
    setConfiguration((current) => ({
      ...current,
      instructors: current.instructors.map((instructor) =>
        instructor.id === instructorId ? { ...instructor, status: "archived" } : instructor
      ),
    }));
    setNotice("Instructor archived.");
  };

  const selectClassForSession = (classId: string) => {
    setSessionClassId(classId);
    const classItem = configuration.classes.find((item) => item.id === classId);
    if (!classItem) return;
    setSessionDuration(String(classItem.defaultDurationMinutes));
    setSessionCapacity(String(classItem.defaultCapacity));
    if (classItem.allowedStudioIds.length === 1) setSessionStudioId(classItem.allowedStudioIds[0]);
    else setSessionStudioId("");
    setSessionInstructorId("");
  };

  const selectStudioForSession = (studioId: string) => {
    setSessionStudioId(studioId);
    const studio = configuration.studios.find((item) => item.id === studioId);
    const classItem = configuration.classes.find((item) => item.id === sessionClassId);
    if (studio && classItem) setSessionCapacity(String(Math.min(studio.maxCapacity, classItem.defaultCapacity)));
    setSessionInstructorId("");
  };

  const addSession = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const classItem = configuration.classes.find((item) => item.id === sessionClassId);
    const studio = configuration.studios.find((item) => item.id === sessionStudioId);
    const instructor = configuration.instructors.find((item) => item.id === sessionInstructorId);
    const duration = Number(sessionDuration);
    const capacity = Number(sessionCapacity);

    if (!classItem || !studio || !instructor || !sessionDate || !sessionTime) {
      setNotice("Class, studio, instructor, date and start time are required.");
      return;
    }
    if (!Number.isInteger(duration) || duration < 10 || !Number.isInteger(capacity) || capacity < 1) {
      setNotice("Session duration and capacity are invalid.");
      return;
    }
    if (capacity > studio.maxCapacity) {
      setNotice(`Capacity cannot exceed ${studio.name}'s maximum of ${studio.maxCapacity}.`);
      return;
    }
    if (classItem.allowedStudioIds.length > 0 && !classItem.allowedStudioIds.includes(studio.id)) {
      setNotice(`${classItem.name} is not configured for ${studio.name}.`);
      return;
    }
    if (instructor.classIds.length > 0 && !instructor.classIds.includes(classItem.id)) {
      setNotice(`${instructor.name} is not assigned to ${classItem.name}.`);
      return;
    }
    if (instructor.studioIds.length > 0 && !instructor.studioIds.includes(studio.id)) {
      setNotice(`${instructor.name} is not assigned to ${studio.name}.`);
      return;
    }

    let times: { startAt: string; endAt: string };
    try {
      times = buildSessionTimes(sessionDate, sessionTime, duration);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Invalid session date or time.");
      return;
    }
    if (new Date(times.startAt) <= new Date()) {
      setNotice("Sessions must start in the future.");
      return;
    }

    const conflict = configuration.sessions.find(
      (session) =>
        session.status !== "cancelled" &&
        intervalsOverlap(times.startAt, times.endAt, session.startAt, session.endAt) &&
        (session.studioId === studio.id || session.instructorId === instructor.id)
    );
    if (conflict) {
      const reason = conflict.studioId === studio.id ? studio.name : instructor.name;
      setNotice(`${reason} already has an overlapping session.`);
      return;
    }

    const session: StudioSession = {
      id: makeId("session"),
      classId: classItem.id,
      studioId: studio.id,
      instructorId: instructor.id,
      startAt: times.startAt,
      endAt: times.endAt,
      capacity,
      bookedCount: 0,
      status: "published",
      createdBy: user.uid,
      createdAt: new Date().toISOString(),
      classNameSnapshot: classItem.name,
      studioNameSnapshot: studio.name,
      instructorNameSnapshot: instructor.name,
    };
    setConfiguration((current) => ({ ...current, sessions: [...current.sessions, session] }));
    setSessionDate("");
    setSessionTime("");
    setNotice(`${session.classNameSnapshot} published in ${session.studioNameSnapshot}.`);
  };

  const cancelSession = (sessionId: string) => {
    setConfiguration((current) => ({
      ...current,
      sessions: current.sessions.map((session) =>
        session.id === sessionId ? { ...session, status: "cancelled" } : session
      ),
    }));
    setNotice("Session cancelled. Booking notification logic will be connected in the backend phase.");
  };

  return (
    <div className="rpm-admin">
      <header className="rpm-admin-header">
        <button type="button" className="rpm-admin-brand" onClick={onBackToSite}>
          Reformer Pilates Malta
        </button>
        <div className="rpm-admin-header-meta">
          <span>admin</span>
          <span>{user.email}</span>
        </div>
        <div className="rpm-admin-header-actions">
          <button type="button" onClick={onBackToSite}>site</button>
          <button type="button" onClick={onLogout}>sign out</button>
        </div>
      </header>

      <nav className="rpm-admin-nav" aria-label="Admin sections">
        {(["schedule", "studios", "classes", "instructors"] as AdminView[]).map((item) => (
          <button
            key={item}
            type="button"
            className={view === item ? "is-active" : ""}
            onClick={() => {
              setView(item);
              setNotice(null);
            }}
          >
            {item}
          </button>
        ))}
      </nav>

      {notice && (
        <div className="rpm-admin-notice" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss message">×</button>
        </div>
      )}

      <main className="rpm-admin-main">
        <section className="rpm-admin-hero">
          <p className="rpm-admin-kicker">studio operations</p>
          <h1>{view}.</h1>
          <div className="rpm-admin-metrics">
            <div><strong>{activeStudios.length}</strong><span>active studios</span></div>
            <div><strong>{activeClasses.length}</strong><span>active classes</span></div>
            <div><strong>{activeInstructors.length}</strong><span>instructors</span></div>
            <div><strong>{upcomingSessions.length}</strong><span>sessions</span></div>
          </div>
        </section>

        {view === "studios" && (
          <section className="rpm-admin-split">
            <div className="rpm-admin-list">
              <div className="rpm-admin-section-head"><span>studios</span><span>{activeStudios.length} active</span></div>
              {configuration.studios.length === 0 ? <EmptyState>No studios yet.</EmptyState> : configuration.studios.map((studio, index) => (
                <article key={studio.id} className={`rpm-admin-row ${studio.status === "archived" ? "is-muted" : ""}`}>
                  <span className="rpm-admin-index">{String(index + 1).padStart(2, "0")}</span>
                  <div><h2>{studio.name}</h2><p>{studio.description || "No description"}</p></div>
                  <div className="rpm-admin-row-meta"><strong>{studio.maxCapacity}</strong><span>max capacity</span></div>
                  <div className="rpm-admin-row-meta"><strong>{studio.status}</strong><span>status</span></div>
                  {studio.status === "active" && <button type="button" className="rpm-admin-text-action" onClick={() => archiveStudio(studio.id)}>archive {TEXT_ARROW}</button>}
                </article>
              ))}
            </div>
            <form className="rpm-admin-form" onSubmit={addStudio}>
              <p className="rpm-admin-kicker">add studio</p>
              <h2>new space.</h2>
              <label><span>studio name</span><input value={studioName} onChange={(event) => setStudioName(event.target.value)} placeholder="Studio Three" required /></label>
              <label><span>maximum capacity</span><input type="number" min="1" value={studioCapacity} onChange={(event) => setStudioCapacity(event.target.value)} required /></label>
              <label><span>description</span><textarea value={studioDescription} onChange={(event) => setStudioDescription(event.target.value)} placeholder="Flexible room for yoga, private or specialty sessions." /></label>
              <button className="rpm-admin-primary" type="submit"><span>create studio</span><span>{TEXT_ARROW}</span></button>
            </form>
          </section>
        )}

        {view === "classes" && (
          <section className="rpm-admin-split">
            <div className="rpm-admin-list">
              <div className="rpm-admin-section-head"><span>classes</span><span>{activeClasses.length} active</span></div>
              {configuration.classes.map((item, index) => (
                <article key={item.id} className={`rpm-admin-row ${item.status === "archived" ? "is-muted" : ""}`}>
                  <span className="rpm-admin-index">{String(index + 1).padStart(2, "0")}</span>
                  <div><h2>{item.name}</h2><p>{item.category} · {item.defaultDurationMinutes} min</p></div>
                  <div className="rpm-admin-row-meta"><strong>{item.defaultCapacity}</strong><span>default capacity</span></div>
                  <div className="rpm-admin-row-meta"><strong>{item.allowedStudioIds.length}</strong><span>studios</span></div>
                  {item.status === "active" && <button type="button" className="rpm-admin-text-action" onClick={() => archiveClass(item.id)}>archive {TEXT_ARROW}</button>}
                </article>
              ))}
            </div>
            <form className="rpm-admin-form" onSubmit={addClass}>
              <p className="rpm-admin-kicker">add class</p>
              <h2>new class.</h2>
              <label><span>class name</span><input value={className} onChange={(event) => setClassName(event.target.value)} placeholder="Yoga Flow" required /></label>
              <label><span>category</span><select value={classCategory} onChange={(event) => setClassCategory(event.target.value as ClassCategory)}>{CATEGORY_OPTIONS.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
              <div className="rpm-admin-form-grid">
                <label><span>duration / min</span><input type="number" min="10" value={classDuration} onChange={(event) => setClassDuration(event.target.value)} /></label>
                <label><span>default capacity</span><input type="number" min="1" value={classCapacity} onChange={(event) => setClassCapacity(event.target.value)} /></label>
              </div>
              <fieldset><legend>allowed studios</legend><p>Leave all unselected to use every active studio.</p><div className="rpm-admin-check-grid">{activeStudios.map((studio) => <label key={studio.id} className="rpm-admin-check"><input type="checkbox" checked={classStudioIds.includes(studio.id)} onChange={() => toggleSelection(studio.id, classStudioIds, setClassStudioIds)} /><span>{studio.name}</span></label>)}</div></fieldset>
              <label><span>description</span><textarea value={classDescription} onChange={(event) => setClassDescription(event.target.value)} /></label>
              <button className="rpm-admin-primary" type="submit"><span>create class</span><span>{TEXT_ARROW}</span></button>
            </form>
          </section>
        )}

        {view === "instructors" && (
          <section className="rpm-admin-split">
            <div className="rpm-admin-list">
              <div className="rpm-admin-section-head"><span>instructors</span><span>{activeInstructors.length} active</span></div>
              {configuration.instructors.length === 0 ? <EmptyState>Add the first instructor to start publishing sessions.</EmptyState> : configuration.instructors.map((instructor, index) => (
                <article key={instructor.id} className={`rpm-admin-row ${instructor.status === "archived" ? "is-muted" : ""}`}>
                  <span className="rpm-admin-index">{String(index + 1).padStart(2, "0")}</span>
                  <div><h2>{instructor.name}</h2><p>{instructor.email}</p></div>
                  <div className="rpm-admin-row-meta"><strong>{instructor.classIds.length || "all"}</strong><span>classes</span></div>
                  <div className="rpm-admin-row-meta"><strong>{instructor.accountAccess ? "yes" : "no"}</strong><span>account access</span></div>
                  {instructor.status === "active" && <button type="button" className="rpm-admin-text-action" onClick={() => archiveInstructor(instructor.id)}>archive {TEXT_ARROW}</button>}
                </article>
              ))}
            </div>
            <form className="rpm-admin-form" onSubmit={addInstructor}>
              <p className="rpm-admin-kicker">add instructor</p>
              <h2>new teacher.</h2>
              <label><span>name</span><input value={instructorName} onChange={(event) => setInstructorName(event.target.value)} required /></label>
              <label><span>email</span><input type="email" value={instructorEmail} onChange={(event) => setInstructorEmail(event.target.value)} required /></label>
              <label><span>phone</span><input value={instructorPhone} onChange={(event) => setInstructorPhone(event.target.value)} /></label>
              <fieldset><legend>classes</legend><p>Leave unselected to allow all active classes.</p><div className="rpm-admin-check-grid">{activeClasses.map((item) => <label key={item.id} className="rpm-admin-check"><input type="checkbox" checked={instructorClassIds.includes(item.id)} onChange={() => toggleSelection(item.id, instructorClassIds, setInstructorClassIds)} /><span>{item.name}</span></label>)}</div></fieldset>
              <fieldset><legend>studios</legend><p>Leave unselected to allow all active studios.</p><div className="rpm-admin-check-grid">{activeStudios.map((studio) => <label key={studio.id} className="rpm-admin-check"><input type="checkbox" checked={instructorStudioIds.includes(studio.id)} onChange={() => toggleSelection(studio.id, instructorStudioIds, setInstructorStudioIds)} /><span>{studio.name}</span></label>)}</div></fieldset>
              <label><span>bio</span><textarea value={instructorBio} onChange={(event) => setInstructorBio(event.target.value)} /></label>
              <label className="rpm-admin-switch"><input type="checkbox" checked={instructorAccountAccess} onChange={(event) => setInstructorAccountAccess(event.target.checked)} /><span>give instructor account access</span></label>
              <button className="rpm-admin-primary" type="submit"><span>add instructor</span><span>{TEXT_ARROW}</span></button>
            </form>
          </section>
        )}

        {view === "schedule" && (
          <section className="rpm-admin-split rpm-admin-split--schedule">
            <div className="rpm-admin-list">
              <div className="rpm-admin-section-head"><span>published sessions</span><span>{upcomingSessions.length} total</span></div>
              {upcomingSessions.length === 0 ? <EmptyState>No sessions published yet. Add an instructor, then create the first session.</EmptyState> : upcomingSessions.map((session, index) => (
                <article key={session.id} className={`rpm-admin-row rpm-admin-session-row ${session.status === "cancelled" ? "is-muted" : ""}`}>
                  <span className="rpm-admin-index">{String(index + 1).padStart(2, "0")}</span>
                  <div><h2>{session.classNameSnapshot}</h2><p>{formatSessionDate(session.startAt)}</p></div>
                  <div className="rpm-admin-row-meta"><strong>{session.studioNameSnapshot}</strong><span>studio</span></div>
                  <div className="rpm-admin-row-meta"><strong>{session.instructorNameSnapshot}</strong><span>instructor</span></div>
                  <div className="rpm-admin-row-meta"><strong>{session.bookedCount} / {session.capacity}</strong><span>booked</span></div>
                  {session.status === "published" && <button type="button" className="rpm-admin-text-action" onClick={() => cancelSession(session.id)}>cancel {TEXT_ARROW}</button>}
                </article>
              ))}
            </div>
            <form className="rpm-admin-form" onSubmit={addSession}>
              <p className="rpm-admin-kicker">new session</p>
              <h2>publish hour.</h2>
              {activeInstructors.length === 0 && <p className="rpm-admin-form-warning">Add at least one instructor before publishing a session.</p>}
              <label><span>class</span><select value={sessionClassId} onChange={(event) => selectClassForSession(event.target.value)} required><option value="">Choose class</option>{activeClasses.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
              <label><span>studio</span><select value={sessionStudioId} onChange={(event) => selectStudioForSession(event.target.value)} required><option value="">Choose studio</option>{compatibleStudios.map((studio) => <option key={studio.id} value={studio.id}>{studio.name}</option>)}</select></label>
              <label><span>instructor</span><select value={sessionInstructorId} onChange={(event) => setSessionInstructorId(event.target.value)} required><option value="">Choose instructor</option>{compatibleInstructors.map((instructor) => <option key={instructor.id} value={instructor.id}>{instructor.name}</option>)}</select></label>
              <div className="rpm-admin-form-grid"><label><span>date</span><input type="date" value={sessionDate} onChange={(event) => setSessionDate(event.target.value)} required /></label><label><span>start</span><input type="time" value={sessionTime} onChange={(event) => setSessionTime(event.target.value)} required /></label></div>
              <div className="rpm-admin-form-grid"><label><span>duration / min</span><input type="number" min="10" value={sessionDuration} onChange={(event) => setSessionDuration(event.target.value)} required /></label><label><span>capacity</span><input type="number" min="1" max={selectedStudio?.maxCapacity} value={sessionCapacity} onChange={(event) => setSessionCapacity(event.target.value)} required /></label></div>
              {selectedStudio && <p className="rpm-admin-form-note">{selectedStudio.name} maximum capacity: {selectedStudio.maxCapacity}.</p>}
              <button className="rpm-admin-primary" type="submit" disabled={activeInstructors.length === 0}><span>publish session</span><span>{TEXT_ARROW}</span></button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
