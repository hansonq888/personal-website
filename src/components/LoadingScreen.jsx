import { useEffect } from "react";

export const LoadingScreen = ({ onComplete, progress = 0 }) => {
  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(onComplete, 300);
      return () => clearTimeout(t);
    }
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center text-black">
      <p className="text-xs text-black/60 mb-4 tracking-wide" style={{ backgroundColor: "#fef08a", padding: "3px 6px" }}>
        Loading...
      </p>
      <div className="w-48 h-[2px] bg-black/10 relative overflow-hidden rounded-full">
        <div
          className="h-full bg-black transition-all duration-300 ease-out rounded-full"
          style={{ width: `${Math.max(progress, 8)}%` }}
        />
      </div>
    </div>
  );
};