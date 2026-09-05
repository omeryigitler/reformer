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
  socialLinks: {
    instagram: "",
    facebook: "",
  },
};

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState<UserType | null>(null);
  const [authRequest, setAuthRequest] = useState<AuthRequest>(null);

  const openDashboard = () => {
    alert("Dashboard mock!");
  };

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
        onLogout={() => setLoggedInUser(null)}
        onOpenDashboard={openDashboard}
      />
    </>
  );
}
