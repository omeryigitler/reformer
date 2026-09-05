import { WhatsAppIcon } from "./WhatsAppIcon";
import type { ManagementState } from "../types";

const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=35.9221937,14.4885259&z=16&output=embed";

type SiteFooterProps = Pick<ManagementState, "socialLinks" | "contactInfo">;

const socialItemClass = "rpm-footer-social-item min-h-12 py-3";

export function SiteFooter({ socialLinks, contactInfo }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const phoneDigits = contactInfo.phone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(
    "Hello, I would like to get information about Reformer Pilates Malta classes."
  )}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    contactInfo.address
  )}`;

  return (
    <footer className="rpm-site-footer border-t border-[#25271F]/10 text-[#25271F]">
      <div className="rpm-footer-main">
        <div className="rpm-footer-map-stage">
          <div className="rpm-footer-map-visual" aria-hidden="true">
            <iframe
              title="Background map of St Julian's, Malta"
              src={MAP_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              tabIndex={-1}
              className="rpm-footer-map-frame"
            />
            <div className="rpm-footer-map-wash" />
            <div className="rpm-footer-map-vignette" />
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rpm-footer-map-link"
            aria-label="Open Reformer Pilates Malta in Google Maps"
          />
        </div>

        <div className="rpm-footer-copy py-5 md:py-7">
          <div className="grid gap-14 md:grid-cols-[1.2fr_.8fr] md:gap-10">
            <div className="rpm-footer-brand-block">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                Reformer Pilates Malta
              </p>
              <div className="rpm-footer-title-row">
                <p className="rpm-footer-title mt-8 max-w-[10ch] font-sans text-[clamp(3.4rem,15vw,6rem)] font-normal leading-[0.82] tracking-[-0.06em] lowercase md:mt-12 md:text-[5.5rem]">
                  move with intention.
                </p>
                {phoneDigits && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rpm-footer-whatsapp-mobile"
                    aria-label="Chat on WhatsApp"
                  >
                    <WhatsAppIcon />
                  </a>
                )}
              </div>
            </div>

            <div className="rpm-footer-social-block flex flex-col justify-end">
              <div className="rpm-footer-social-links grid grid-cols-2 gap-x-6 gap-y-3 pt-5 text-sm lowercase md:grid-cols-1 md:justify-items-end md:text-right">
                {socialLinks.instagram ? (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={socialItemClass}
                  >
                    instagram ↗
                  </a>
                ) : (
                  <span className={socialItemClass} aria-disabled="true">
                    instagram ↗
                  </span>
                )}

                {socialLinks.facebook ? (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={socialItemClass}
                  >
                    facebook ↗
                  </a>
                ) : (
                  <span className={socialItemClass} aria-disabled="true">
                    facebook ↗
                  </span>
                )}

                {contactInfo.email && (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="rpm-footer-social-item col-span-2 min-h-12 py-3 md:col-span-1"
                  >
                    {contactInfo.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rpm-footer-meta flex items-end justify-between gap-6 border-t border-[#25271F]/10 pt-5 pb-5 text-[9px] uppercase tracking-[0.18em] text-[#25271F]/45 md:pb-7">
        <span>St Julian&apos;s · Malta</span>
        <span>© {year}</span>
      </div>
    </footer>
  );
}
