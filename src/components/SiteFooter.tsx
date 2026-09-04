export function SiteFooter({ socialLinks, contactInfo }: any) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#25271F]/10 py-5 text-[#25271F] md:py-7">
      <div className="grid gap-14 md:grid-cols-[1.2fr_.8fr] md:gap-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">
            Reformer Pilates Malta
          </p>
          <p className="mt-8 max-w-[10ch] font-sans text-[clamp(3.4rem,15vw,6rem)] font-normal leading-[0.82] tracking-[-0.06em] lowercase md:mt-12 md:text-[5.5rem]">
            move with intention.
          </p>
        </div>

        <div className="flex flex-col justify-end">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-[#25271F]/10 pt-5 text-sm lowercase md:grid-cols-1 md:justify-items-end md:text-right">
            {socialLinks?.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="min-h-12 py-3 transition-opacity hover:opacity-55">
                instagram ↗
              </a>
            )}
            {socialLinks?.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="min-h-12 py-3 transition-opacity hover:opacity-55">
                facebook ↗
              </a>
            )}
            {contactInfo?.email && (
              <a href={`mailto:${contactInfo.email}`} className="col-span-2 min-h-12 py-3 transition-opacity hover:opacity-55 md:col-span-1">
                {contactInfo.email}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mt-14 flex items-end justify-between gap-6 border-t border-[#25271F]/10 pt-5 text-[9px] uppercase tracking-[0.18em] text-[#25271F]/45 md:mt-20">
        <span>St Julian&apos;s · Malta</span>
        <span>© {year}</span>
      </div>
    </footer>
  );
}
