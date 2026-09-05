import { useRef } from "react";
import { ClassesSection } from "./ClassesSection";
import { DesktopHero } from "./DesktopHero";
import { LandingHeader } from "./LandingHeader";
import {
  BookingCtaSection,
  FirstSessionSection,
  FloatingWhatsApp,
  InstructorSection,
  ProofSection,
  StudioSection,
} from "./LandingSections";
import { MobileHero } from "./MobileHero";
import { SiteFooter } from "./SiteFooter";
import { useLandingRevealMotion } from "../motion/useLandingRevealMotion";
import type { AuthRequest, ManagementState, UserType } from "../types";

type PremiumLandingPageProps = {
  managementState: ManagementState;
  loggedInUser: UserType | null;
  authRequest: AuthRequest;
  setAuthRequest: (value: AuthRequest) => void;
  onOpenDashboard: () => void;
};

export function PremiumLandingPage({
  managementState,
  loggedInUser,
  authRequest,
  setAuthRequest,
  onOpenDashboard,
}: PremiumLandingPageProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLandingRevealMotion(rootRef);

  const book = () => {
    if (loggedInUser) {
      onOpenDashboard();
      return;
    }

    setAuthRequest("register");
  };

  const phoneDigits = managementState.contactInfo.phone.replace(/[^0-9]/g, "");
  const whatsapp = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(
    "Hello, I would like to get information about Reformer Pilates Malta classes."
  )}`;

  return (
    <>
      <MobileHero />

      <div ref={rootRef} className="rpm-premium bg-[#F6F3EC] text-[#25271F]">
        <LandingHeader
          loggedInUser={loggedInUser}
          authRequest={authRequest}
          setAuthRequest={setAuthRequest}
          onOpenDashboard={onOpenDashboard}
        />

        <main>
          <DesktopHero />
          <StudioSection />
          <ProofSection />
          <ClassesSection />
          <InstructorSection />
          <FirstSessionSection onBook={book} />
          <BookingCtaSection onBook={book} />
        </main>

        <div className="bg-[#F6F3EC] px-4 py-8 md:px-8 md:py-12">
          <SiteFooter
            socialLinks={managementState.socialLinks}
            contactInfo={managementState.contactInfo}
          />
        </div>

        <FloatingWhatsApp href={whatsapp} />
      </div>
    </>
  );
}
