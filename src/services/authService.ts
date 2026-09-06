import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import type { UserRole, UserType } from "../types";

type LegacyUser = {
  email?: string;
  role?: "admin" | "user" | "instructor" | "member";
  firstName?: string;
  lastName?: string;
  phone?: string;
  registered?: string;
  registeredAt?: string;
  displayName?: string;
};

type RegistrationInput = {
  email: string;
  password: string;
  displayName: string;
};

function normalizeRole(role: LegacyUser["role"]): UserRole {
  if (role === "admin") return "admin";
  if (role === "instructor") return "instructor";
  return "member";
}

function normalizeProfile(firebaseUser: FirebaseUser, source?: LegacyUser): UserType {
  const legacyName = [source?.firstName, source?.lastName].filter(Boolean).join(" ").trim();
  return {
    uid: firebaseUser.uid,
    email: (firebaseUser.email ?? source?.email ?? "").trim().toLowerCase(),
    role: normalizeRole(source?.role),
    displayName: source?.displayName?.trim() || legacyName || firebaseUser.displayName || undefined,
    phone: source?.phone?.trim() || undefined,
    registeredAt: source?.registeredAt || source?.registered || undefined,
  };
}

async function tryUidProfile(firebaseUser: FirebaseUser) {
  try {
    const snapshot = await getDoc(doc(db, "users", firebaseUser.uid));
    return snapshot.exists() ? (snapshot.data() as LegacyUser) : null;
  } catch (error) {
    // The production project can still be running legacy email-keyed rules during migration.
    console.warn("UID profile is not readable yet; trying the legacy profile:", error);
    return null;
  }
}

async function loadProfile(firebaseUser: FirebaseUser): Promise<UserType> {
  const uidRef = doc(db, "users", firebaseUser.uid);
  const uidProfile = await tryUidProfile(firebaseUser);
  if (uidProfile) return normalizeProfile(firebaseUser, uidProfile);

  const email = firebaseUser.email?.trim().toLowerCase();
  if (email) {
    try {
      const legacySnapshot = await getDoc(doc(db, "users", email));
      if (legacySnapshot.exists()) {
        const profile = normalizeProfile(firebaseUser, legacySnapshot.data() as LegacyUser);
        try {
          await setDoc(uidRef, profile, { merge: true });
        } catch (error) {
          console.warn("Legacy profile loaded but UID migration is not writable yet:", error);
        }
        return profile;
      }
    } catch (error) {
      console.warn("Legacy account profile could not be read:", error);
    }
  }

  const profile: UserType = {
    ...normalizeProfile(firebaseUser),
    role: "member",
    registeredAt: new Date().toISOString(),
  };
  await setDoc(uidRef, profile, { merge: true });
  return profile;
}

export async function registerMemberAccount(input: RegistrationInput): Promise<UserType> {
  const email = input.email.trim().toLowerCase();
  const displayName = input.displayName.trim();
  const credential = await createUserWithEmailAndPassword(auth, email, input.password);
  if (displayName) await updateProfile(credential.user, { displayName });

  const registeredAt = new Date().toISOString();
  const profile: UserType = {
    uid: credential.user.uid,
    email,
    role: "member",
    displayName: displayName || undefined,
    registeredAt,
  };

  try {
    await setDoc(doc(db, "users", credential.user.uid), profile);
  } catch (uidWriteError) {
    // Temporary bridge for the existing production rules, which key users by email and require role=user.
    const [firstName = displayName || "Member", ...lastParts] = displayName.split(/\s+/).filter(Boolean);
    await setDoc(doc(db, "users", email), {
      email,
      role: "user",
      firstName,
      lastName: lastParts.join(" "),
      registered: registeredAt.slice(0, 10),
    });
    console.warn("Account created with legacy profile shape until new Firestore rules are deployed:", uidWriteError);
  }

  return profile;
}

export async function signInAccount(email: string, password: string): Promise<UserType> {
  const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  return loadProfile(credential.user);
}

export async function signOutAccount() {
  await signOut(auth);
}

export function observeAccount(callback: (user: UserType | null) => void) {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }
    void loadProfile(firebaseUser)
      .then(callback)
      .catch((error) => {
        console.error("Failed to load account profile:", error);
        callback(null);
      });
  });
}
