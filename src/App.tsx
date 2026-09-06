import { useState } from "react";
import { MemberDashboard } from "./components/MemberDashboard";
import { PremiumLandingPage } from "./components/PremiumLandingPage";
import { ThemeMenu } from "./components/ThemeMenu";
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

  const openDashboard = () => {
    if (!loggedInUser) {
      setAuthRequest("login");
      return;
    }
    setDashboardOpen(true);
  };

  const logout = () => {
    setLoggedInUser(null);
    setDashboardOpen(false);
    setAuthRequest(null);
  };

  if (dashboardOpen && loggedInUser) {
    return (
      <MemberDashboard
        user={loggedInUser}
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
