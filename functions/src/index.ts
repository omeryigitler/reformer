import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { defineSecret, defineString } from "firebase-functions/params";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { Resend } from "resend";

initializeApp();

const db = getFirestore();
const REGION = "europe-west1";
const RESEND_API_KEY = defineSecret("RESEND_API_KEY");
const RESEND_FROM = defineString("RESEND_FROM");

type SessionDocument = {
  status: "draft" | "published" | "cancelled" | "completed";
  instructorId: string;
  startAt: string;
  endAt: string;
  capacity: number;
  bookedCount: number;
  classNameSnapshot: string;
  studioNameSnapshot: string;
  instructorNameSnapshot: string;
};

type BookingDocument = {
  id: string;
  sessionId: string;
  memberId: string;
  status: "confirmed" | "cancelled" | "attended" | "no_show";
  source: "member" | "admin";
  bookedAt: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  emailStatus: "queued" | "sent" | "failed";
  cancellationEmailStatus?: "queued" | "sent" | "failed";
  memberNameSnapshot?: string;
  memberEmailSnapshot?: string;
  classNameSnapshot: string;
  studioNameSnapshot: string;
  instructorNameSnapshot: string;
  startAt: string;
  endAt: string;
};

type InstructorDocument = {
  id: string;
  name: string;
  email: string;
  accountAccess: boolean;
  status: "active" | "archived";
  userId?: string;
};

type UserDocument = {
  uid?: string;
  email?: string;
  role?: "admin" | "user" | "member" | "instructor";
  displayName?: string;
  firstName?: string;
  lastName?: string;
  instructorId?: string;
};

function requireString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpsError("invalid-argument", `${field} is required.`);
  }
  return value.trim();
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatBookingStart(startAt: string) {
  const start = new Date(startAt);
  return {
    dateLabel: new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Malta",
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(start),
    timeLabel: new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Malta",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(start),
  };
}

async function getCallerProfile(uid: string, email?: string) {
  const uidProfile = await db.collection("users").doc(uid).get();
  if (uidProfile.exists) return uidProfile.data() as UserDocument;
  if (!email) return undefined;
  const legacyProfile = await db.collection("users").doc(email.toLowerCase()).get();
  return legacyProfile.exists ? (legacyProfile.data() as UserDocument) : undefined;
}

async function requestIsAdmin(uid: string, email?: string) {
  const profile = await getCallerProfile(uid, email);
  return profile?.role === "admin";
}

async function requireAdmin(uid: string, email?: string) {
  if (!(await requestIsAdmin(uid, email))) {
    throw new HttpsError("permission-denied", "Administrator access is required.");
  }
}

async function getMemberIdentity(uid: string) {
  const authUser = await getAuth().getUser(uid);
  const email = authUser.email?.trim().toLowerCase() ?? "";
  const uidProfile = await db.collection("users").doc(uid).get();
  let profile = uidProfile.exists ? (uidProfile.data() as UserDocument) : undefined;
  if (!profile && email) {
    const legacy = await db.collection("users").doc(email).get();
    if (legacy.exists) profile = legacy.data() as UserDocument;
  }
  const legacyName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ").trim();
  return {
    email: String(profile?.email || authUser.email || "").trim().toLowerCase(),
    name: String(profile?.displayName || legacyName || authUser.displayName || "Member").trim(),
  };
}

export const bookSession = onCall({ region: REGION }, async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in before booking a session.");

  const sessionId = requireString(request.data?.sessionId, "sessionId");
  const memberId = request.auth.uid;
  const memberIdentity = await getMemberIdentity(memberId);
  const bookingId = `${sessionId}__${memberId}`;
  const sessionRef = db.collection("sessions").doc(sessionId);
  const bookingRef = db.collection("bookings").doc(bookingId);

  await db.runTransaction(async (transaction) => {
    const [sessionSnapshot, bookingSnapshot] = await Promise.all([
      transaction.get(sessionRef),
      transaction.get(bookingRef),
    ]);

    if (!sessionSnapshot.exists) {
      throw new HttpsError("not-found", "The selected session no longer exists.");
    }

    const session = sessionSnapshot.data() as SessionDocument;
    if (session.status !== "published") {
      throw new HttpsError("failed-precondition", "This session is not open for booking.");
    }
    if (new Date(session.startAt).getTime() <= Date.now()) {
      throw new HttpsError("failed-precondition", "This session has already started.");
    }

    const bookedCount = Number(session.bookedCount || 0);
    const capacity = Number(session.capacity || 0);
    if (!Number.isInteger(capacity) || capacity < 1 || bookedCount >= capacity) {
      throw new HttpsError("resource-exhausted", "This session is full.");
    }

    if (bookingSnapshot.exists) {
      const existing = bookingSnapshot.data() as BookingDocument;
      if (existing.status === "confirmed" || existing.status === "attended") {
        throw new HttpsError("already-exists", "You already have this session booked.");
      }
    }

    const booking: BookingDocument = {
      id: bookingId,
      sessionId,
      memberId,
      status: "confirmed",
      source: "member",
      bookedAt: new Date().toISOString(),
      emailStatus: "queued",
      memberNameSnapshot: memberIdentity.name,
      memberEmailSnapshot: memberIdentity.email,
      classNameSnapshot: session.classNameSnapshot,
      studioNameSnapshot: session.studioNameSnapshot,
      instructorNameSnapshot: session.instructorNameSnapshot,
      startAt: session.startAt,
      endAt: session.endAt,
    };

    transaction.update(sessionRef, { bookedCount: bookedCount + 1 });
    transaction.set(bookingRef, booking);
  });

  return { bookingId, status: "confirmed" as const };
});

export const cancelSession = onCall({ region: REGION }, async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in as an administrator.");
  const callerEmail = typeof request.auth.token.email === "string" ? request.auth.token.email : undefined;
  await requireAdmin(request.auth.uid, callerEmail);

  const sessionId = requireString(request.data?.sessionId, "sessionId");
  const reason = typeof request.data?.reason === "string" && request.data.reason.trim()
    ? request.data.reason.trim().slice(0, 300)
    : "Class cancelled by the studio";
  const sessionRef = db.collection("sessions").doc(sessionId);
  const bookingsQuery = db.collection("bookings").where("sessionId", "==", sessionId);
  const cancelledAt = new Date().toISOString();
  let cancelledBookings = 0;

  await db.runTransaction(async (transaction) => {
    const sessionSnapshot = await transaction.get(sessionRef);
    if (!sessionSnapshot.exists) throw new HttpsError("not-found", "Session not found.");
    const session = sessionSnapshot.data() as SessionDocument;
    if (session.status === "cancelled") return;
    if (session.status === "completed") {
      throw new HttpsError("failed-precondition", "Completed sessions cannot be cancelled.");
    }

    const bookingSnapshots = await transaction.get(bookingsQuery);
    const activeBookings = bookingSnapshots.docs.filter((item) => {
      const booking = item.data() as BookingDocument;
      return booking.status === "confirmed";
    });
    cancelledBookings = activeBookings.length;

    transaction.update(sessionRef, {
      status: "cancelled",
      bookedCount: 0,
      cancelledAt,
      cancelledBy: request.auth.uid,
      cancellationReason: reason,
    });

    activeBookings.forEach((item) => {
      transaction.update(item.ref, {
        status: "cancelled",
        cancelledAt,
        cancelledBy: request.auth!.uid,
        cancellationReason: reason,
        cancellationEmailStatus: "queued",
      });
    });
  });

  return { sessionId, cancelledBookings };
});

export const markBookingAttendance = onCall({ region: REGION }, async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in before updating attendance.");

  const bookingId = requireString(request.data?.bookingId, "bookingId");
  const status = requireString(request.data?.status, "status");
  if (status !== "attended" && status !== "no_show") {
    throw new HttpsError("invalid-argument", "Attendance status must be attended or no_show.");
  }

  const bookingRef = db.collection("bookings").doc(bookingId);
  const bookingSnapshot = await bookingRef.get();
  if (!bookingSnapshot.exists) throw new HttpsError("not-found", "Booking not found.");
  const booking = bookingSnapshot.data() as BookingDocument;
  if (booking.status === "cancelled") throw new HttpsError("failed-precondition", "Cancelled bookings cannot receive attendance.");

  const sessionSnapshot = await db.collection("sessions").doc(booking.sessionId).get();
  if (!sessionSnapshot.exists) throw new HttpsError("not-found", "Session not found.");
  const session = sessionSnapshot.data() as SessionDocument;

  const callerEmail = typeof request.auth.token.email === "string" ? request.auth.token.email : undefined;
  const isAdmin = await requestIsAdmin(request.auth.uid, callerEmail);
  if (!isAdmin) {
    const profile = await getCallerProfile(request.auth.uid, callerEmail);
    if (profile?.role !== "instructor" || profile.instructorId !== session.instructorId) {
      throw new HttpsError("permission-denied", "Only the assigned instructor or an administrator can update attendance.");
    }
  }

  if (Date.now() < new Date(session.startAt).getTime() - 15 * 60_000) {
    throw new HttpsError("failed-precondition", "Attendance opens 15 minutes before the session starts.");
  }

  await bookingRef.update({
    status,
    attendanceUpdatedAt: new Date().toISOString(),
    attendanceUpdatedBy: request.auth.uid,
  });

  return { bookingId, status };
});

export const provisionInstructorAccess = onCall(
  { region: REGION, secrets: [RESEND_API_KEY] },
  async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "Sign in as an administrator.");
    const adminEmail = typeof request.auth.token.email === "string" ? request.auth.token.email : undefined;
    await requireAdmin(request.auth.uid, adminEmail);

    const instructorId = requireString(request.data?.instructorId, "instructorId");
    const instructorRef = db.collection("instructors").doc(instructorId);
    const instructorSnapshot = await instructorRef.get();
    if (!instructorSnapshot.exists) throw new HttpsError("not-found", "Instructor profile not found.");

    const instructor = instructorSnapshot.data() as InstructorDocument;
    if (instructor.status !== "active" || !instructor.accountAccess) {
      throw new HttpsError("failed-precondition", "Enable account access for this active instructor first.");
    }

    const email = instructor.email.trim().toLowerCase();
    if (!email) throw new HttpsError("failed-precondition", "Instructor email is missing.");

    const adminAuth = getAuth();
    let authUser;
    try {
      authUser = await adminAuth.getUserByEmail(email);
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
      if (!code.includes("user-not-found")) throw error;
      authUser = await adminAuth.createUser({ email, displayName: instructor.name, disabled: false });
    }

    const registeredAt = new Date().toISOString();
    await db.collection("users").doc(authUser.uid).set(
      {
        uid: authUser.uid,
        email,
        role: "instructor",
        displayName: instructor.name,
        instructorId,
        registeredAt,
      },
      { merge: true }
    );
    await instructorRef.update({ userId: authUser.uid });

    const resetLink = await adminAuth.generatePasswordResetLink(email);
    const resend = new Resend(RESEND_API_KEY.value());
    await resend.emails.send({
      from: RESEND_FROM.value(),
      to: email,
      replyTo: "info@reformerpilatesmalta.com",
      subject: "Your Reformer Pilates Malta instructor account",
      html: `
        <div style="font-family:Arial,sans-serif;color:#25271F;line-height:1.6;max-width:620px;margin:auto;padding:32px;">
          <p style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;">Reformer Pilates Malta</p>
          <h1 style="font-family:Georgia,serif;font-size:44px;font-weight:400;line-height:1;margin:32px 0;">Your instructor account is ready.</h1>
          <p>Hello ${escapeHtml(instructor.name)},</p>
          <p>Your studio instructor access has been created. Use the secure link below to set your password.</p>
          <p style="margin:32px 0;"><a href="${escapeHtml(resetLink)}" style="color:#25271F;">Set your password →</a></p>
          <p>St Julian's · Malta</p>
        </div>
      `,
    });

    return { userId: authUser.uid, invitationSent: true };
  }
);

export const sendBookingMessages = onDocumentWritten(
  {
    document: "bookings/{bookingId}",
    region: REGION,
    secrets: [RESEND_API_KEY],
  },
  async (event) => {
    const after = event.data?.after;
    if (!after?.exists) return;

    const booking = after.data() as BookingDocument;
    const before = event.data?.before.exists ? (event.data.before.data() as BookingDocument) : null;
    const bookingRef = after.ref;
    const newlyQueuedConfirmation =
      booking.status === "confirmed" &&
      booking.emailStatus === "queued" &&
      before?.emailStatus !== "queued";
    const newlyQueuedCancellation =
      booking.status === "cancelled" &&
      booking.cancellationEmailStatus === "queued" &&
      before?.cancellationEmailStatus !== "queued";

    if (!newlyQueuedConfirmation && !newlyQueuedCancellation) return;

    try {
      const authUser = await getAuth().getUser(booking.memberId);
      const email = String(booking.memberEmailSnapshot || authUser.email || "").trim();
      if (!email) throw new Error("Member email is missing.");
      const displayName = String(booking.memberNameSnapshot || authUser.displayName || "Member").trim();
      const { dateLabel, timeLabel } = formatBookingStart(booking.startAt);
      const resend = new Resend(RESEND_API_KEY.value());

      if (newlyQueuedConfirmation) {
        await resend.emails.send({
          from: RESEND_FROM.value(),
          to: email,
          replyTo: "info@reformerpilatesmalta.com",
          subject: `Booking confirmed — ${booking.classNameSnapshot}`,
          html: `
            <div style="font-family:Arial,sans-serif;color:#25271F;line-height:1.6;max-width:620px;margin:auto;padding:32px;">
              <p style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;">Reformer Pilates Malta</p>
              <h1 style="font-family:Georgia,serif;font-size:44px;font-weight:400;line-height:1;margin:32px 0;">Your session is confirmed.</h1>
              <p>Hello ${escapeHtml(displayName)},</p>
              <p>Your booking has been confirmed automatically.</p>
              <div style="border-top:1px solid #D8D3C9;border-bottom:1px solid #D8D3C9;padding:24px 0;margin:28px 0;">
                <strong>${escapeHtml(booking.classNameSnapshot)}</strong><br/>
                ${escapeHtml(dateLabel)} · ${escapeHtml(timeLabel)}<br/>
                ${escapeHtml(booking.studioNameSnapshot)}<br/>
                with ${escapeHtml(booking.instructorNameSnapshot)}
              </div>
              <p>St Julian's · Malta</p>
            </div>
          `,
        });
        await bookingRef.update({ emailStatus: "sent", emailSentAt: new Date().toISOString() });
      }

      if (newlyQueuedCancellation) {
        await resend.emails.send({
          from: RESEND_FROM.value(),
          to: email,
          replyTo: "info@reformerpilatesmalta.com",
          subject: `Session cancelled — ${booking.classNameSnapshot}`,
          html: `
            <div style="font-family:Arial,sans-serif;color:#25271F;line-height:1.6;max-width:620px;margin:auto;padding:32px;">
              <p style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;">Reformer Pilates Malta</p>
              <h1 style="font-family:Georgia,serif;font-size:44px;font-weight:400;line-height:1;margin:32px 0;">Your session has been cancelled.</h1>
              <p>Hello ${escapeHtml(displayName)},</p>
              <p>We’re sorry, the studio has cancelled the session below.</p>
              <div style="border-top:1px solid #D8D3C9;border-bottom:1px solid #D8D3C9;padding:24px 0;margin:28px 0;">
                <strong>${escapeHtml(booking.classNameSnapshot)}</strong><br/>
                ${escapeHtml(dateLabel)} · ${escapeHtml(timeLabel)}<br/>
                ${escapeHtml(booking.studioNameSnapshot)}<br/>
                with ${escapeHtml(booking.instructorNameSnapshot)}
              </div>
              <p>${escapeHtml(booking.cancellationReason || "Class cancelled by the studio")}</p>
              <p>Your place has been removed automatically. You can choose another available session from your account.</p>
            </div>
          `,
        });
        await bookingRef.update({
          cancellationEmailStatus: "sent",
          cancellationEmailSentAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Booking email delivery failed:", error);
      if (newlyQueuedConfirmation) {
        await bookingRef.update({ emailStatus: "failed", emailFailedAt: new Date().toISOString() });
      }
      if (newlyQueuedCancellation) {
        await bookingRef.update({
          cancellationEmailStatus: "failed",
          cancellationEmailFailedAt: new Date().toISOString(),
        });
      }
    }
  }
);
