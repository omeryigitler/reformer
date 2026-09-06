import type { StudioConfiguration } from "./studio";

const CREATED_AT = "2026-09-06T00:00:00.000Z";

export function createInitialStudioConfiguration(): StudioConfiguration {
  return {
    locations: [
      {
        id: "location-st-julians",
        name: "St Julian's",
        address: "Pendergardens, Triq Gort, St Julian's, Malta",
        timezone: "Europe/Malta",
        status: "active",
      },
    ],
    studios: [
      {
        id: "studio-reformer",
        locationId: "location-st-julians",
        name: "Reformer Studio",
        description: "Dedicated Reformer room.",
        maxCapacity: 4,
        status: "active",
        sortOrder: 1,
        createdAt: CREATED_AT,
      },
      {
        id: "studio-mat",
        locationId: "location-st-julians",
        name: "Mat Studio",
        description: "Open floor studio for mat-based practice.",
        maxCapacity: 10,
        status: "active",
        sortOrder: 2,
        createdAt: CREATED_AT,
      },
      {
        id: "studio-three",
        locationId: "location-st-julians",
        name: "Studio Three",
        description: "Flexible room for private, yoga or specialty sessions.",
        maxCapacity: 8,
        status: "active",
        sortOrder: 3,
        createdAt: CREATED_AT,
      },
    ],
    classes: [
      {
        id: "class-reformer-flow",
        name: "Reformer Flow",
        category: "reformer",
        description: "Progressive full-body Reformer practice.",
        defaultDurationMinutes: 50,
        defaultCapacity: 4,
        allowedStudioIds: ["studio-reformer"],
        status: "active",
        createdAt: CREATED_AT,
      },
      {
        id: "class-mat-pilates",
        name: "Mat Pilates",
        category: "mat",
        description: "Controlled mat-based strength and mobility.",
        defaultDurationMinutes: 50,
        defaultCapacity: 10,
        allowedStudioIds: ["studio-mat", "studio-three"],
        status: "active",
        createdAt: CREATED_AT,
      },
      {
        id: "class-yoga-flow",
        name: "Yoga Flow",
        category: "yoga",
        description: "Breath-led mobility and flow practice.",
        defaultDurationMinutes: 60,
        defaultCapacity: 8,
        allowedStudioIds: ["studio-mat", "studio-three"],
        status: "active",
        createdAt: CREATED_AT,
      },
      {
        id: "class-private-pilates",
        name: "Private Pilates",
        category: "private",
        description: "One-to-one tailored studio session.",
        defaultDurationMinutes: 50,
        defaultCapacity: 1,
        allowedStudioIds: ["studio-reformer", "studio-three"],
        status: "active",
        createdAt: CREATED_AT,
      },
    ],
    instructors: [],
    sessions: [],
    bookings: [],
  };
}
