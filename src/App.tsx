/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { PremiumLandingPage } from "./components/PremiumLandingPage";
import { ThemeMenu } from "./components/ThemeMenu";
import type { ManagementState, UserType } from "./types";

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState<UserType | null>(null);
  const [authModal, setAuthModal] = useState<string | null>(null);

  const managementState: ManagementState = {
    holidayMode: false,
    springMode: false,
    loveRainMode: false,
    contactInfo: {
      phone: "+356 9974 9805",
      email: "info@reformerpilatesmalta.com",
      address: "Pendergardens, Triq Gort, St Julian's, Malta"
    },
    // The current production site does not expose verified Instagram/Facebook
    // URLs. Keep these empty rather than shipping deceptive placeholder links.
    socialLinks: {
      instagram: "",
      facebook: ""
    }
  };

  return (
    <>
      <PremiumLandingPage
        managementState={managementState}
        loggedInUser={loggedInUser}
        authModal={authModal}
        setAuthModal={setAuthModal}
        onLogin={setLoggedInUser}
        onOpenDashboard={() => alert("Dashboard mock!")}
        onLogout={() => setLoggedInUser(null)}
      />
      <ThemeMenu
        loggedInUser={loggedInUser}
        onLogin={setLoggedInUser}
        onLogout={() => setLoggedInUser(null)}
        onOpenDashboard={() => alert("Dashboard mock!")}
      />
    </>
  );
}
