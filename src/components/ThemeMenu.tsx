import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { AuthRequest, UserType } from "../types";

type Theme = "light" | "dark";
type AccountView = "choices" | "signin" | "signup";

type ThemeMenuProps = {
  authRequest: AuthRequest;
  setAuthRequest: (value: AuthRequest) => void;
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
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch {
      // localStorage can be unavailable in restrictive privacy contexts.
    }
  }

  return "light";
}

export function ThemeMenu({
  authRequest,
  setAuthRequest,
  loggedInUser,
  onLogin,
  onLogout,
  onOpenDashboard,
}: ThemeMenuProps) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);
  const [accountView, setAccountView] = useState<AccountView>("choices");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const open = authRequest !== null;

  useEffect(() => {
    document.documentElement.dataset.rpmTheme = theme;
    document.documentElement.style.colorScheme = theme;
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // The visual theme still works even if persistence is blocked.
    }
  }, [theme]);

  useEffect(() => {
    if (!authRequest) return;
    setAccountView(authRequest === "register" ? "signup" : "choices");
  }, [authRequest]);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      previousFocusRef.current?.focus({ preventScroll: true });
      previousFocusRef.current = null;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const pageLayers = Array.from(
      document.querySelectorAll<HTMLElement>(".rpm-premium, .rpm-mobile-hero")
    );
    const previousInert = pageLayers.map((layer) => layer.inert);

    document.body.style.overflow = "hidden";
    pageLayers.forEach((layer) => {
      layer.inert = true;
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      pageLayers.forEach((layer, index) => {
        layer.inert = previousInert[index] ?? false;
      });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (accountView !== "choices") setAccountView("choices");
      else setAuthRequest(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, accountView, setAuthRequest]);

  const closeMenu = () => {
    setAuthRequest(null);
    setAccountView("choices");
  };

  const submitAuth = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || password.length < 6) return;

    // Prototype adapter only. Replace with the production authentication API.
    onLogin({ uid: `prototype-${Date.now()}`, email: email.trim(), role: "user" });
    setPassword("");
    setName("");
    setAccountView("choices");
  };

  const accountLabel = accountView === "signup" ? "create account" : "sign in";

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      data-open={open ? "true" : "false"}
      className="rpm-theme-menu fixed inset-0 z-[90]"
    >
      <div className="rpm-menu-grid" aria-hidden="true" />

      <div className="rpm-menu-shell">
        <header className="rpm-menu-header">
          <button type="button" onClick={closeMenu} className="rpm-menu-brand">
            Reformer Pilates Malta
          </button>

          <div className="rpm-menu-appearance" aria-label="Appearance">
            <span className="rpm-menu-appearance-label">appearance</span>
            {(["light", "dark"] as Theme[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                aria-pressed={theme === value}
                className={`rpm-theme-choice ${theme === value ? "is-active" : ""}`}
              >
                {value}
              </button>
            ))}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeMenu}
            className="rpm-menu-close"
          >
            close
          </button>
        </header>

        {accountView === "choices" ? (
          <div className="rpm-menu-main">
            <section className="rpm-menu-intro">
              <p className="rpm-menu-kicker">member access</p>
              <h2 className="rpm-menu-title">
                your
                <br />
                practice.
              </h2>
              <p className="rpm-menu-copy">
                Keep bookings, preferences and your studio practice together in one quiet place.
              </p>
            </section>

            {loggedInUser ? (
              <section className="rpm-member-panel">
                <p className="rpm-menu-kicker">welcome back</p>
                <h3 className="rpm-member-title">your account.</h3>
                <p className="rpm-member-email">{loggedInUser.email}</p>
                <div className="rpm-member-actions">
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      onOpenDashboard();
                    }}
                    className="rpm-account-pill rpm-account-pill--filled"
                  >
                    <span>open dashboard</span>
                    <span aria-hidden="true">↗</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      closeMenu();
                    }}
                    className="rpm-account-pill"
                  >
                    <span>sign out</span>
                    <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </section>
            ) : (
              <section className="rpm-auth-split">
                <article className="rpm-auth-side">
                  <div>
                    <span className="rpm-auth-index">01</span>
                    <p className="rpm-auth-eyebrow">new here?</p>
                  </div>
                  <div className="rpm-auth-side-bottom">
                    <h3 className="rpm-auth-heading">create account.</h3>
                    <p className="rpm-auth-description">
                      Save bookings and keep your studio preferences ready for every session.
                    </p>
                    <button
                      type="button"
                      onClick={() => setAccountView("signup")}
                      className="rpm-account-pill rpm-account-pill--filled"
                    >
                      <span>create account</span>
                      <span aria-hidden="true">↗</span>
                    </button>
                  </div>
                </article>

                <article className="rpm-auth-side">
                  <div>
                    <span className="rpm-auth-index">02</span>
                    <p className="rpm-auth-eyebrow">already a member?</p>
                  </div>
                  <div className="rpm-auth-side-bottom">
                    <h3 className="rpm-auth-heading">sign in.</h3>
                    <p className="rpm-auth-description">
                      Return to your sessions and continue from exactly where you left off.
                    </p>
                    <button
                      type="button"
                      onClick={() => setAccountView("signin")}
                      className="rpm-account-pill"
                    >
                      <span>sign in</span>
                      <span aria-hidden="true">↗</span>
                    </button>
                  </div>
                </article>
              </section>
            )}
          </div>
        ) : (
          <div className="rpm-menu-main rpm-menu-main--form">
            <section className="rpm-menu-intro rpm-menu-intro--form">
              <button
                type="button"
                onClick={() => setAccountView("choices")}
                className="rpm-menu-back"
              >
                ← back
              </button>
              <p className="rpm-menu-kicker">
                {accountView === "signup" ? "new here" : "welcome back"}
              </p>
              <h2 className="rpm-menu-title">
                {accountView === "signup" ? (
                  <>
                    create
                    <br />
                    account.
                  </>
                ) : (
                  <>
                    sign
                    <br />
                    in.
                  </>
                )}
              </h2>
            </section>

            <section className="rpm-auth-form-wrap">
              <div className="rpm-auth-form-heading">
                <span className="rpm-auth-index">{accountView === "signup" ? "01" : "02"}</span>
                <p>{accountView === "signup" ? "Start your practice." : "Good to see you again."}</p>
              </div>

              <form onSubmit={submitAuth} className="rpm-auth-form">
                {accountView === "signup" && (
                  <label className="rpm-auth-field">
                    <span>name</span>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      autoComplete="name"
                      required
                      placeholder="Your name"
                    />
                  </label>
                )}

                <label className="rpm-auth-field">
                  <span>email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                    placeholder="you@email.com"
                  />
                </label>

                <label className="rpm-auth-field">
                  <span>password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete={accountView === "signup" ? "new-password" : "current-password"}
                    minLength={6}
                    required
                    placeholder="At least 6 characters"
                  />
                </label>

                <button type="submit" className="rpm-account-pill rpm-account-pill--filled rpm-auth-submit">
                  <span>{accountLabel}</span>
                  <span aria-hidden="true">↗</span>
                </button>
              </form>

              <button
                type="button"
                onClick={() => setAccountView(accountView === "signup" ? "signin" : "signup")}
                className="rpm-auth-switch"
              >
                {accountView === "signup"
                  ? "Already registered? Sign in."
                  : "New here? Create an account."}
              </button>
            </section>
          </div>
        )}

        <footer className="rpm-menu-footer">
          <span>Reformer Pilates Malta</span>
          <span>St Julian&apos;s · Malta</span>
        </footer>
      </div>
    </aside>
  );
}
