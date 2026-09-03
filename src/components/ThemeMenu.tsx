import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "rpm-theme";

function readInitialTheme(): Theme {
  if (typeof document !== "undefined") {
    const bootTheme = document.documentElement.dataset.rpmTheme;
    if (bootTheme === "light" || bootTheme === "dark") return bootTheme;
  }

  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return "light";
}

export function ThemeMenu() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.rpmTheme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);

    // TODO: when account preferences are backed by the production API,
    // persist this same `theme` value to the authenticated user's profile.
  }, [theme]);

  useEffect(() => {
    const menuButton = document.querySelector<HTMLElement>("[data-header-btn]");
    if (!menuButton) return;

    const handleMenuClick = (event: MouseEvent) => {
      if (menuButton.dataset.rpmBypass === "1") return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      setOpen((value) => !value);
    };

    menuButton.addEventListener("click", handleMenuClick, true);
    return () => menuButton.removeEventListener("click", handleMenuClick, true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const openAccount = () => {
    const menuButton = document.querySelector<HTMLElement>("[data-header-btn]");
    if (!menuButton) return;

    setOpen(false);
    menuButton.dataset.rpmBypass = "1";
    menuButton.click();
    queueMicrotask(() => delete menuButton.dataset.rpmBypass);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
        className={`rpm-menu-backdrop fixed inset-0 z-[85] transition-opacity duration-500 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-hidden={!open}
        className={`rpm-theme-menu fixed right-0 top-0 z-[90] flex h-[100svh] w-full max-w-[430px] flex-col px-7 pb-8 pt-7 transition-transform duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] md:px-9 md:pb-10 md:pt-9 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b pb-5">
          <span className="text-[11px] uppercase tracking-[0.22em]">menu</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-sm lowercase transition-opacity hover:opacity-55"
          >
            close
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-12">
          <div>
            <p className="mb-5 text-[10px] uppercase tracking-[0.24em] opacity-50">appearance</p>
            <div className="flex items-center gap-8">
              {(["light", "dark"] as Theme[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTheme(value)}
                  aria-pressed={theme === value}
                  className={`rpm-theme-choice relative pb-2 text-2xl lowercase tracking-[-0.035em] transition-opacity ${
                    theme === value ? "opacity-100" : "opacity-40 hover:opacity-70"
                  }`}
                >
                  {value}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-px origin-left transition-transform duration-300 ${
                      theme === value ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={openAccount}
            className="flex items-center justify-between border-y py-5 text-left text-sm lowercase transition-opacity hover:opacity-60"
          >
            <span>account</span>
            <span aria-hidden="true">↗</span>
          </button>
        </div>

        <div className="border-t pt-5 text-[10px] uppercase tracking-[0.2em] opacity-45">
          Reformer Pilates Malta · St Julian&apos;s
        </div>
      </aside>
    </>
  );
}
