import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
  writeBatch,
  type DocumentData,
  type Query,
  type QuerySnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../firebase";
import { createInitialStudioConfiguration } from "../domain/studioSeed";
import type {
  Booking,
  ClassDefinition,
  Instructor,
  Studio,
  StudioConfiguration,
  StudioLocation,
  StudioSession,
} from "../domain/studio";
import type { UserType } from "../types";

const COLLECTIONS = {
  locations: "locations",
  studios: "studios",
  classes: "classes",
  instructors: "instructors",
  sessions: "sessions",
  bookings: "bookings",
} as const;

type ConfigurationKey = keyof StudioConfiguration;
type PersistableKey = Exclude<ConfigurationKey, "bookings">;

type BookSessionResponse = {
  bookingId: string;
  status: "confirmed";
};

function snapshotToArray<T extends { id: string }>(snapshot: QuerySnapshot<DocumentData>): T[] {
  return snapshot.docs.map((item) => ({ ...(item.data() as Omit<T, "id">), id: item.id } as T));
}

function createEmptyConfiguration(): StudioConfiguration {
  return {
    locations: [],
    studios: [],
    classes: [],
    instructors: [],
    sessions: [],
    bookings: [],
  };
}

function stableEntity(value: unknown) {
  return JSON.stringify(value);
}

function changedEntities<T extends { id: string }>(previous: T[], next: T[]) {
  const previousMap = new Map(previous.map((item) => [item.id, item]));
  return next.filter((item) => stableEntity(previousMap.get(item.id)) !== stableEntity(item));
}

async function writeChangedCollection<T extends { id: string }>(
  collectionName: string,
  previous: T[],
  next: T[]
) {
  const changed = changedEntities(previous, next);
  if (changed.length === 0) return;
  const batch = writeBatch(db);
  changed.forEach((item) => {
    batch.set(doc(db, collectionName, item.id), item, { merge: true });
  });
  await batch.commit();
}

export async function persistStudioConfigurationDiff(
  previous: StudioConfiguration,
  next: StudioConfiguration
) {
  const keys: PersistableKey[] = ["locations", "studios", "classes", "instructors", "sessions"];
  await Promise.all(
    keys.map((key) => writeChangedCollection(COLLECTIONS[key], previous[key], next[key]))
  );
}

export async function ensureStudioConfigurationSeed() {
  const studiosSnapshot = await getDocs(collection(db, COLLECTIONS.studios));
  if (!studiosSnapshot.empty) return;

  const seed = createInitialStudioConfiguration();
  const batch = writeBatch(db);
  seed.locations.forEach((item) => batch.set(doc(db, COLLECTIONS.locations, item.id), item));
  seed.studios.forEach((item) => batch.set(doc(db, COLLECTIONS.studios, item.id), item));
  seed.classes.forEach((item) => batch.set(doc(db, COLLECTIONS.classes, item.id), item));
  await batch.commit();
}

export function listenToStudioConfiguration(
  user: UserType,
  callback: (configuration: StudioConfiguration) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const current = createEmptyConfiguration();
  const loaded = new Set<ConfigurationKey>();
  const subscriptions: Unsubscribe[] = [];

  const emit = () => {
    const required: ConfigurationKey[] =
      user.role === "admin"
        ? ["locations", "studios", "classes", "instructors", "sessions", "bookings"]
        : ["sessions", "bookings"];
    if (required.every((key) => loaded.has(key))) callback({ ...current });
  };

  const handleError = (error: Error) => {
    console.error("Studio configuration listener failed:", error);
    onError?.(error);
  };

  const subscribe = <T extends { id: string }>(
    key: ConfigurationKey,
    source: Query<DocumentData>,
    assign: (items: T[]) => void
  ) => {
    subscriptions.push(
      onSnapshot(
        source,
        (snapshot) => {
          assign(snapshotToArray<T>(snapshot));
          loaded.add(key);
          emit();
        },
        handleError
      )
    );
  };

  if (user.role === "admin") {
    subscribe<StudioLocation>("locations", query(collection(db, COLLECTIONS.locations)), (items) => {
      current.locations = items;
    });
    subscribe<Studio>("studios", query(collection(db, COLLECTIONS.studios)), (items) => {
      current.studios = items;
    });
    subscribe<ClassDefinition>("classes", query(collection(db, COLLECTIONS.classes)), (items) => {
      current.classes = items;
    });
    subscribe<Instructor>("instructors", query(collection(db, COLLECTIONS.instructors)), (items) => {
      current.instructors = items;
    });
    subscribe<StudioSession>("sessions", query(collection(db, COLLECTIONS.sessions)), (items) => {
      current.sessions = items;
    });
    subscribe<Booking>("bookings", query(collection(db, COLLECTIONS.bookings)), (items) => {
      current.bookings = items;
    });
  } else {
    subscribe<StudioSession>(
      "sessions",
      query(collection(db, COLLECTIONS.sessions), where("status", "==", "published")),
      (items) => {
        current.sessions = items;
      }
    );
    subscribe<Booking>(
      "bookings",
      query(collection(db, COLLECTIONS.bookings), where("memberId", "==", user.uid)),
      (items) => {
        current.bookings = items;
      }
    );
  }

  return () => subscriptions.forEach((unsubscribe) => unsubscribe());
}

export async function bookPublishedSession(sessionId: string) {
  const callable = httpsCallable<{ sessionId: string }, BookSessionResponse>(functions, "bookSession");
  const result = await callable({ sessionId });
  return result.data;
}

export async function upsertEntityDirectly(collectionName: string, id: string, value: object) {
  await setDoc(doc(db, collectionName, id), value, { merge: true });
}
