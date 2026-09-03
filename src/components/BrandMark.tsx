export function BrandMark({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <div className={`bg-stone-800 rounded-full flex items-center justify-center text-white font-bold text-xs ${className}`}>
      RPM
    </div>
  );
}
