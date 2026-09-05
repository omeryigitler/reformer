const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=35.9221937,14.4885259&z=16&output=embed";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Pendergardens%2C%20Triq%20Gort%2C%20St%20Julian%27s%2C%20Malta";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function SiteFooter({ socialLinks, contactInfo }: any) {
  const year = new Date().getFullYear();
  const phoneDigits = String(contactInfo?.phone || "").replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(
    "Hello, I would like to get information about Reformer Pilates Malta classes."
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
            href={MAPS_URL}
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
                {socialLinks?.instagram && socialLinks.instagram !== "#" && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-12 py-3 transition-opacity hover:opacity-55"
                  >
                    instagram ↗
                  </a>
                )}
                {socialLinks?.facebook && socialLinks.facebook !== "#" && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-12 py-3 transition-opacity hover:opacity-55"
                  >
                    facebook ↗
                  </a>
                )}
                {contactInfo?.email && (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="col-span-2 min-h-12 py-3 transition-opacity hover:opacity-55 md:col-span-1"
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
