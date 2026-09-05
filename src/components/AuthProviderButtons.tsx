type AuthProviderButtonsProps = {
  theme: "light" | "dark";
};

function GoogleMark() {
  return (
    <svg
      className="rpm-provider-google-mark"
      viewBox="0 0 18 18"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#EA4335"
        d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.797 2.716v2.258h2.909c1.702-1.567 2.684-3.874 2.684-6.614Z"
      />
      <path
        fill="#4285F4"
        d="M9 18c2.43 0 4.468-.806 5.956-2.181l-2.909-2.258c-.806.54-1.835.859-3.047.859-2.344 0-4.328-1.585-5.037-3.714H.956v2.333A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.963 10.706A5.414 5.414 0 0 1 3.682 9c0-.592.102-1.167.281-1.706V4.961H.956A9 9 0 0 0 0 9c0 1.452.347 2.826.956 4.039l3.007-2.333Z"
      />
      <path
        fill="#34A853"
        d="M9 3.58c1.322 0 2.508.454 3.441 1.346l2.581-2.581C13.464.892 11.426 0 9 0A9 9 0 0 0 .956 4.961l3.007 2.333C4.672 5.165 6.656 3.58 9 3.58Z"
      />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg
      className="rpm-provider-apple-mark"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
      />
    </svg>
  );
}

export function AuthProviderButtons({ theme }: AuthProviderButtonsProps) {
  return (
    <div
      className="rpm-provider-wrap"
      data-provider-theme={theme}
      aria-label="Alternative sign in options"
    >
      <div className="rpm-provider-stack">
        <button
          type="button"
          className="rpm-provider-button rpm-provider-google"
          aria-label="Sign in with Google"
          data-auth-placeholder="google"
        >
          <GoogleMark />
          <span>Sign in with Google</span>
        </button>

        <button
          type="button"
          className="rpm-provider-button rpm-provider-apple"
          aria-label="Sign in with Apple"
          data-auth-placeholder="apple"
        >
          <AppleMark />
          <span>Sign in with Apple</span>
        </button>
      </div>

      <div className="rpm-provider-divider" aria-hidden="true">
        <span>or</span>
      </div>
    </div>
  );
}
