import type { AuthRequest, UserType } from "../types";

type LandingHeaderProps = {
  loggedInUser: UserType | null;
  authRequest: AuthRequest;
  setAuthRequest: (value: AuthRequest) => void;
  onOpenDashboard: () => void;
};

export function LandingHeader({
  loggedInUser,
  authRequest,
  setAuthRequest,
  onOpenDashboard,
}: LandingHeaderProps) {
  const openMenu = () => {
    if (loggedInUser) {
      onOpenDashboard();
      return;
    }

    setAuthRequest(authRequest === "login" ? null : "login");
  };

  return (
    <header className="rpm-site-header fixed inset-x-0 top-0 z-[80] pointer-events-none">
      <div className="mx-auto flex w-full items-start justify-between">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Reformer Pilates Malta home"
          className="pointer-events-auto transition hover:opacity-70"
        >
          <span
            data-header-logo
            className="rpm-site-logo text-xs font-semibold uppercase tracking-[0.2em] text-[#25271F]"
          >
            Reformer Pilates Malta
          </span>
        </button>

        <div className="flex items-center pointer-events-auto">
          <button
            type="button"
            data-header-btn
            onClick={openMenu}
            className="rpm-menu-trigger group relative overflow-hidden rounded-[999px] border border-[#25271F] transition-colors"
          >
            <div className="menu-bg absolute inset-0 z-0 translate-y-full bg-[#25271F] transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-y-0" />
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center overflow-hidden">
              <span className="rpm-header-control-label menu-default absolute inset-0 flex items-center justify-center text-[#25271F] transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-full">
                menu
              </span>
              <span className="rpm-header-control-label menu-hover absolute inset-0 flex translate-y-full items-center justify-center text-[#F6F3EC] transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-y-0">
                menu
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
