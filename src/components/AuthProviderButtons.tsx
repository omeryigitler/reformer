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

export function AuthProviderButtons({ theme }: AuthProviderButtonsProps) {
  const appleColor = theme === "dark" ? "black" : "white";
  const appleBorder = "true";
  const appleButtonUrl =
    `https://appleid.cdn-apple.com/appleid/button?height=52&width=360&color=${appleColor}` +
    `&border=${appleBorder}&type=sign-in&border_radius=26&scale=2&locale=en_US`;

  return (
    <div className="rpm-provider-wrap" aria-label="Alternative sign in options">
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
          <img src={appleButtonUrl} alt="" width="360" height="52" draggable={false} />
        </button>
      </div>

      <div className="rpm-provider-divider" aria-hidden="true">
        <span>or use email</span>
      </div>
    </div>
  );
}
