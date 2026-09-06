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

async function loadProfile(firebaseUser: FirebaseUser): Promise<UserType> {
  const uidRef = doc(db, "users", firebaseUser.uid);
  const uidSnapshot = await getDoc(uidRef);
  if (uidSnapshot.exists()) {
    return normalizeProfile(firebaseUser, uidSnapshot.data() as LegacyUser);
  }

  const email = firebaseUser.email?.trim().toLowerCase();
  if (email) {
    const legacySnapshot = await getDoc(doc(db, "users", email));
    if (legacySnapshot.exists()) {
      const profile = normalizeProfile(firebaseUser, legacySnapshot.data() as LegacyUser);
      try {
        await setDoc(uidRef, profile, { merge: true });
      } catch (error) {
        // Legacy rules can block UID migration until the new Firestore rules are deployed.
        console.warn("Legacy profile loaded but UID migration is not writable yet:", error);
      }
      return profile;
    }
  }

  const fallback = normalizeProfile(firebaseUser);
  const profile: UserType = {
    ...fallback,
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

  const profile: UserType = {
    uid: credential.user.uid,
    email,
    role: "member",
    displayName: displayName || undefined,
    registeredAt: new Date().toISOString(),
  };
  await setDoc(doc(db, "users", credential.user.uid), profile);
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
