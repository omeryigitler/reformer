export function UserPanel({ onLogin, activePanel, setActivePanel }: any) {
  return (
    <button 
      onClick={() => onLogin({ uid: "1", email: "test@test.com", role: "user" })}
      className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#25271F] transition hover:bg-white"
    >
      Log in
    </button>
  );
}
