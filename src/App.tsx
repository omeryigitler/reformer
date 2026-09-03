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
      phone: "+1234567890",
      email: "hello@example.com",
      address: "St Julian's, Malta"
    },
    socialLinks: {
      instagram: "#",
      facebook: "#"
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
