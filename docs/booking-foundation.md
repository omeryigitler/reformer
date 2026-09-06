# Booking Foundation

This document is the domain contract for the new Reformer Pilates Malta booking system. UI code and backend adapters should follow these rules rather than reintroducing the legacy `date_time` slot model.

## Core hierarchy

`Location -> Studio -> Session`

A session references one class definition and one instructor. Bookings reference sessions and members.

- **Location** answers where the physical venue is.
- **Studio** answers which room/space is used.
- **Class** answers what is being taught.
- **Instructor** answers who teaches it.
- **Session** answers when that class happens in that studio with that instructor.
- **Booking** answers which member owns a place in that session.

Studios and classes are deliberately independent. `Studio Three` can host Private Pilates today and Yoga Flow tomorrow without renaming or migrating historical data.

## Identity rules

Never use `date_time` as a session document ID. Sessions use generated IDs so multiple studios can host sessions at the same time.

Bookings use generated IDs and reference `sessionId` + `memberId`.

Users should be keyed by immutable authentication UID in the production adapter, not by email address.

## Roles

Production roles are:

- `admin`
- `instructor`
- `member`

Admin manages studios, classes, instructors and the schedule. Instructor access will be limited to assigned schedule/roster/attendance operations. Members only access public sessions and their own bookings/profile.

## Studio rules

A studio has a required name, location and maximum capacity.

Studios are archived rather than deleted. A studio cannot be archived while it owns active future sessions.

A studio name may change without rewriting old session history. Sessions store a `studioNameSnapshot`.

## Class rules

A class has a required name, category, default duration and default capacity.

A class can restrict which studios it may use through `allowedStudioIds`. An empty set in the production model means all active studios unless product rules later change this convention.

Classes are archived rather than deleted. Sessions store a `classNameSnapshot`.

## Instructor rules

An instructor has a required name and email. Class/studio assignments can be restricted. Empty assignment sets mean unrestricted access to active classes/studios.

`accountAccess` is independent from instructor existence. An instructor can exist for scheduling without receiving a login account.

Instructors are archived rather than deleted. An instructor cannot be archived while assigned to active future sessions. Sessions store an `instructorNameSnapshot`.

## Session rules

A session contains:

- `classId`
- `studioId`
- `instructorId`
- `startAt`
- `endAt`
- `capacity`
- `bookedCount`
- `status`
- immutable display snapshots for class/studio/instructor names

Statuses are:

- `draft`
- `published`
- `cancelled`
- `completed`

Availability is calculated; it is not a session status.

A session is bookable when it is published, in the future, and `bookedCount < capacity`.

### Capacity invariant

`session.capacity <= studio.maxCapacity`

The production booking transaction must reject a booking if capacity has been reached even if the client UI still displays availability.

### Studio conflict invariant

Two non-cancelled sessions may not overlap when they use the same studio.

This is interval overlap, not just identical start times.

### Instructor conflict invariant

Two non-cancelled sessions may not overlap when assigned to the same instructor, even when they use different studios.

### Simultaneous studios

Different studios may publish sessions at the same time. Example:

- 18:00 Reformer Flow -> Reformer Studio
- 18:00 Mat Pilates -> Mat Studio
- 18:00 Yoga Flow -> Studio Three

This is a required capability and must never be blocked by a global date/time uniqueness rule.

## Booking rules

Statuses are:

- `confirmed`
- `cancelled`
- `attended`
- `no_show`

New member bookings are automatically confirmed. There is no approval/pending stage in the new system.

The production booking operation must be atomic:

1. authenticate member
2. read session
3. assert session is published and in the future
4. assert member does not already own an active booking for the session
5. assert `bookedCount < capacity`
6. create confirmed booking
7. increment `bookedCount`
8. commit

If two members compete for the final place, only one transaction may commit.

Email delivery happens after the booking transaction. Email failure must not roll back a confirmed booking. Track email delivery separately (`queued`, `sent`, `failed`) so failed sends can be retried.

## Attendance and My Path

My Path progression must count attended bookings only. Booking a class is not progression; attendance is.

`confirmed -> attended` advances session history/progression.

`confirmed -> no_show` does not.

## Cancellation

Cancelling a member booking must atomically:

1. change booking status to cancelled
2. decrement `bookedCount`
3. never allow the count below zero

Cancelling an entire session does not delete bookings. It marks the session cancelled and triggers member notifications in the backend notification phase.

## Production storage target

The current React implementation is a typed in-memory foundation only. Production persistence should use the existing Firebase direction unless that decision is explicitly changed.

Recommended Firestore collections:

- `users/{uid}`
- `locations/{locationId}`
- `studios/{studioId}`
- `classes/{classId}`
- `instructors/{instructorId}`
- `sessions/{sessionId}`
- `bookings/{bookingId}`

Server-side code must own privileged writes, automatic booking transactions, email queueing and role-sensitive operations.

## Legacy migration mapping

Legacy `slots` are not copied one-to-one into the new model.

- Available legacy slot -> session only
- Confirmed/Booked legacy slot -> session + confirmed booking
- Completed legacy slot -> completed session + attended booking
- Legacy user -> member keyed by auth UID
- Legacy admin notes -> member profile/admin notes data

Legacy records do not contain studio/class/instructor IDs. Migration must assign explicit defaults and preserve the original date/time/user information for auditability.

## Current implementation boundary

Phase 1 currently provides:

- typed domain model
- three independent studio seeds
- class definitions
- instructor creation and assignment constraints
- session creation UI
- studio/instructor overlap validation
- studio capacity validation
- role-aware admin dashboard routing

Not yet production-connected:

- Firebase authentication adapter
- Firestore persistence
- atomic member booking transaction
- email delivery
- instructor login dashboard
- attendance
- My Path attendance adapter
- legacy data migration
