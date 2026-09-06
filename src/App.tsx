import { useCallback, useEffect, useState } from "react";
import { AdminDashboard } from "./components/AdminDashboard";
import { InstructorDashboard } from "./components/InstructorDashboard";
import { MemberDashboard } from "./components/MemberDashboard";
import { PremiumLandingPage } from "./components/PremiumLandingPage";
import { ThemeMenu } from "./components/ThemeMenu";
import { createInitialStudioConfiguration } from "./domain/studioSeed";
import { observeAccount, signOutAccount } from "./services/authService";
import {
  bookPublishedSession,
  ensureStudioConfigurationSeed,
  listenToStudioConfiguration,
  persistStudioConfigurationDiff,
  updateBookingAttendance,
} from "./services/studioRepository";
import type { StudioConfiguration } from "./domain/studio";
import type { AuthRequest, ManagementState, UserType } from "./types";

const managementState: ManagementState = {
  contactInfo: {
    phone: "+356 9974 9805",
    email: "info@reformerpilatesmalta.com",
    address: "Pendergardens, Triq Gort, St Julian's, Malta",
  },
  socialLinks: {
    instagram: "",
    facebook: "",
  },
};

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState<UserType | null>(null);
  const [authRequest, setAuthRequest] = useState<AuthRequest>(null);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [studioConfiguration, setStudioConfiguration] = useState<StudioConfiguration>(() =>
    createInitialStudioConfiguration()
  );

  useEffect(() => observeAccount(setLoggedInUser), []);

  useEffect(() => {
    if (!loggedInUser) {
      setStudioConfiguration(createInitialStudioConfiguration());
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let disposed = false;

    const connect = async () => {
      try {
        if (loggedInUser.role === "admin") await ensureStudioConfigurationSeed();
        if (disposed) return;
        unsubscribe = listenToStudioConfiguration(
          loggedInUser,
          setStudioConfiguration,
          (error) => console.error("Live studio data unavailable:", error)
        );
      } catch (error) {
        console.error("Studio data could not be initialized:", error);
      }
    };

    void connect();
    return () => {
      disposed = true;
      unsubscribe?.();
    };
  }, [loggedInUser]);

  const updateStudioConfiguration = useCallback(
    (updater: (current: StudioConfiguration) => StudioConfiguration) => {
      setStudioConfiguration((current) => {
        const next = updater(current);
        if (loggedInUser?.role === "admin") {
          void persistStudioConfigurationDiff(current, next).catch((error) => {
            console.error("Admin configuration change could not be saved:", error);
          });
        }
        return next;
      });
    },
    [loggedInUser]
  );

  const openDashboard = () => {
    if (!loggedInUser) {
      setAuthRequest("login");
      return;
    }
    setDashboardOpen(true);
  };

  const logout = () => {
    void signOutAccount().catch((error) => console.error("Sign out failed:", error));
    setLoggedInUser(null);
    setDashboardOpen(false);
    setAuthRequest(null);
  };

  if (dashboardOpen && loggedInUser) {
    if (loggedInUser.role === "admin") {
      return (
        <AdminDashboard
          user={loggedInUser}
          configuration={studioConfiguration}
          setConfiguration={updateStudioConfiguration}
          onBackToSite={() => setDashboardOpen(false)}
          onLogout={logout}
        />
      );
    }

    if (loggedInUser.role === "instructor") {
      return (
        <InstructorDashboard
          user={loggedInUser}
          configuration={studioConfiguration}
          onUpdateAttendance={updateBookingAttendance}
          onBackToSite={() => setDashboardOpen(false)}
          onLogout={logout}
        />
      );
    }

    return (
      <MemberDashboard
        user={loggedInUser}
        configuration={studioConfiguration}
        onBookSession={bookPublishedSession}
        onBackToSite={() => setDashboardOpen(false)}
        onLogout={logout}
      />
    );
  }

  return (
    <>
      <PremiumLandingPage
        managementState={managementState}
        loggedInUser={loggedInUser}
        authRequest={authRequest}
        setAuthRequest={setAuthRequest}
        onOpenDashboard={openDashboard}
      />
      <ThemeMenu
        authRequest={authRequest}
        setAuthRequest={setAuthRequest}
        loggedInUser={loggedInUser}
        onLogin={setLoggedInUser}
        onLogout={logout}
        onOpenDashboard={openDashboard}
      />
    </>
  );
}
