import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
import type { AuthRequest, ManagementState, UserType } from "../types";

gsap.registerPlugin(ScrollTrigger);

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

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
            },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const book = () => {
    if (loggedInUser) {
      onOpenDashboard();
      return;
    }

    setAuthRequest("register");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
