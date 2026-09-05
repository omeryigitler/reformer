import { useState } from "react";
import { PremiumLandingPage } from "./components/PremiumLandingPage";
import { ThemeMenu } from "./components/ThemeMenu";
import type { AuthRequest, ManagementState, UserType } from "./types";

const managementState: ManagementState = {
  contactInfo: {
    phone: "+356 9974 9805",
    email: "info@reformerpilatesmalta.com",
    address: "Pendergardens, Triq Gort, St Julian's, Malta",
  },
  // Keep unverified social destinations empty instead of shipping placeholder links.
  socialLinks: {
    instagram: "",
    facebook: "",
  },
};

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState<UserType | null>(null);
  const [authRequest, setAuthRequest] = useState<AuthRequest>(null);

  const openDashboard = () => {
    // Prototype-only until the production booking/account application is connected.
    alert("Dashboard mock!");
  };

  const handleLegacyAuthRequest = (value: string | null) => {
    setAuthRequest(value === "register" ? "register" : value === "login" ? "login" : null);
  };

  return (
    <>
      <PremiumLandingPage
        managementState={managementState}
        loggedInUser={loggedInUser}
        authModal={authRequest}
        setAuthModal={handleLegacyAuthRequest}
        onLogin={setLoggedInUser}
        onOpenDashboard={openDashboard}
        onLogout={() => setLoggedInUser(null)}
      />
      <ThemeMenu
        authRequest={authRequest}
        setAuthRequest={setAuthRequest}
        loggedInUser={loggedInUser}
        onLogin={setLoggedInUser}
        onLogout={() => setLoggedInUser(null)}
        onOpenDashboard={openDashboard}
      />
    </>
  );
}
