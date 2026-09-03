import { FormEvent, useEffect, useState } from "react";
import type { UserType } from "../types";

type Theme = "light" | "dark";
type AccountView = "choices" | "signin" | "signup";

type ThemeMenuProps = {
  loggedInUser: UserType | null;
  onLogin: (user: UserType) => void;
  onLogout: () => void;
  onOpenDashboard: () => void;
};

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

export function ThemeMenu({ loggedInUser, onLogin, onLogout, onOpenDashboard }: ThemeMenuProps) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);
  const [open, setOpen] = useState(false);
  const [accountView, setAccountView] = useState<AccountView>("choices");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    document.documentElement.dataset.rpmTheme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
    // Production: persist `theme` to the authenticated user's backend profile,
    // while keeping localStorage as the instant client-side fallback.
  }, [theme]);

  useEffect(() => {
    const menuButton = document.querySelector<HTMLElement>("[data-header-btn]");
    if (!menuButton) return;

    const handleMenuClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      setOpen((value) => !value);
      setAccountView("choices");
    };

    menuButton.addEventListener("click", handleMenuClick, true);
    return () => menuButton.removeEventListener("click", handleMenuClick, true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (accountView !== "choices") setAccountView("choices");
        else setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, accountView]);

  const closeMenu = () => {
    setOpen(false);
    setAccountView("choices");
  };

  const submitAuth = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || password.length < 6) return;

    // Prototype adapter only. Replace this with Firebase/Auth API in production.
    onLogin({ uid: `prototype-${Date.now()}`, email: email.trim(), role: "user" });
    setPassword("");
    setName("");
    setAccountView("choices");
  };

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={closeMenu}
        className={`rpm-menu-backdrop fixed inset-0 z-[85] transition-opacity duration-500 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-hidden={!open}
        className={`rpm-theme-menu fixed right-0 top-0 z-[90] flex h-[100svh] w-full max-w-[820px] flex-col px-6 pb-6 pt-6 transition-transform duration-[650ms] ease-[cubic-bezier(0.25,1,0.5,1)] md:px-9 md:pb-9 md:pt-8 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b pb-5">
          <div className="flex items-center gap-7">
            <span className="text-[11px] uppercase tracking-[0.22em]">menu</span>
            {accountView !== "choices" && (
              <button
                type="button"
                onClick={() => setAccountView("choices")}
                className="text-[11px] lowercase opacity-55 transition-opacity hover:opacity-100"
              >
                ← back
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={closeMenu}
            className="text-sm lowercase transition-opacity hover:opacity-55"
          >
            close
          </button>
        </div>

        {accountView === "choices" ? (
          <div className="flex min-h-0 flex-1 flex-col py-7 md:py-9">
            <div className="mb-7 flex items-end justify-between gap-6 border-b pb-6">
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.24em] opacity-45">appearance</p>
                <div className="flex items-center gap-7">
                  {(["light", "dark"] as Theme[]).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTheme(value)}
                      aria-pressed={theme === value}
                      className={`rpm-theme-choice relative pb-1.5 text-lg lowercase tracking-[-0.025em] transition-opacity ${
                        theme === value ? "opacity-100" : "opacity-35 hover:opacity-70"
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
              <p className="hidden max-w-[250px] text-right text-xs leading-relaxed opacity-45 md:block">
                Your practice, bookings and preferences in one quiet place.
              </p>
            </div>

            {loggedInUser ? (
              <div className="grid min-h-0 flex-1 place-items-center">
                <div className="w-full max-w-[560px] text-center">
                  <p className="mb-4 text-[10px] uppercase tracking-[0.24em] opacity-45">your account</p>
                  <h2 className="mb-3 text-[clamp(3rem,7vw,5.8rem)] leading-[0.82] tracking-[-0.06em]">welcome back.</h2>
                  <p className="mb-10 text-sm opacity-55">{loggedInUser.email}</p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button type="button" onClick={() => { closeMenu(); onOpenDashboard(); }} className="rpm-auth-action-pill">open dashboard <span>↗</span></button>
                    <button type="button" onClick={() => { onLogout(); closeMenu(); }} className="rpm-auth-action-pill rpm-auth-action-pill--quiet">sign out</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                <button type="button" onClick={() => setAccountView("signup")} className="rpm-auth-choice group">
                  <span className="rpm-auth-choice-index">01</span>
                  <span className="rpm-auth-choice-copy">
                    <span className="rpm-auth-choice-kicker">new here?</span>
                    <span className="rpm-auth-choice-title">create<br />account</span>
                    <span className="rpm-auth-choice-description">Save your practice, bookings and studio preferences.</span>
                  </span>
                  <span className="rpm-auth-choice-arrow" aria-hidden="true">↗</span>
                </button>

                <button type="button" onClick={() => setAccountView("signin")} className="rpm-auth-choice group">
                  <span className="rpm-auth-choice-index">02</span>
                  <span className="rpm-auth-choice-copy">
                    <span className="rpm-auth-choice-kicker">already a member?</span>
                    <span className="rpm-auth-choice-title">sign<br />in</span>
                    <span className="rpm-auth-choice-description">Return to your sessions and continue where you left off.</span>
                  </span>
                  <span className="rpm-auth-choice-arrow" aria-hidden="true">↗</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-7 py-7 md:grid-cols-[0.78fr_1.22fr] md:gap-10 md:py-9">
            <div className="rpm-auth-form-pill hidden md:flex">
              <span className="text-[10px] uppercase tracking-[0.24em] opacity-50">{accountView === "signup" ? "01 · join" : "02 · return"}</span>
              <div>
                <p className="mb-4 text-sm opacity-50">{accountView === "signup" ? "Start your practice." : "Welcome back."}</p>
                <h2 className="text-[clamp(3.7rem,6vw,6rem)] leading-[0.78] tracking-[-0.065em]">
                  {accountView === "signup" ? <>create<br />account.</> : <>sign<br />in.</>}
                </h2>
              </div>
              <span className="text-xs leading-relaxed opacity-45">Reformer Pilates Malta<br />St Julian&apos;s</span>
            </div>

            <form onSubmit={submitAuth} className="flex min-h-0 flex-col justify-center">
              <div className="mb-8 md:hidden">
                <p className="mb-2 text-[10px] uppercase tracking-[0.24em] opacity-45">{accountView === "signup" ? "new here" : "welcome back"}</p>
                <h2 className="text-5xl leading-[0.9] tracking-[-0.055em]">{accountView === "signup" ? "create account." : "sign in."}</h2>
              </div>

              <div className="space-y-6">
                {accountView === "signup" && (
                  <label className="rpm-auth-field">
                    <span>name</span>
                    <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required placeholder="Your name" />
                  </label>
                )}

                <label className="rpm-auth-field">
                  <span>email</span>
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required placeholder="you@email.com" />
                </label>

                <label className="rpm-auth-field">
                  <span>password</span>
                  <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={accountView === "signup" ? "new-password" : "current-password"} minLength={6} required placeholder="At least 6 characters" />
                </label>
              </div>

              <button type="submit" className="rpm-auth-submit mt-9">
                <span>{accountView === "signup" ? "create account" : "sign in"}</span>
                <span aria-hidden="true">↗</span>
              </button>

              <button
                type="button"
                onClick={() => setAccountView(accountView === "signup" ? "signin" : "signup")}
                className="mt-5 text-left text-xs opacity-50 transition-opacity hover:opacity-100"
              >
                {accountView === "signup" ? "Already registered? Sign in." : "New here? Create an account."}
              </button>
            </form>
          </div>
        )}

        <div className="flex items-center justify-between border-t pt-5 text-[10px] uppercase tracking-[0.2em] opacity-45">
          <span>Reformer Pilates Malta</span>
          <span>St Julian&apos;s</span>
        </div>
      </aside>
    </>
  );
}
