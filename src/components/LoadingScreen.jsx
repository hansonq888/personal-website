import { useEffect } from "react";

export const LoadingScreen = ({ onComplete, progress = 0 }) => {
    useEffect(() => {
        if (progress >= 100) {
            const t = setTimeout(onComplete, 300);
            return () => clearTimeout(t);
        }
    }, [progress, onComplete]);

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
            <div className="w-[200px] h-[2px] bg-white/20 relative overflow-hidden">
                <div
                    className="h-full bg-white transition-all duration-300 ease-out"
                    style={{ width: `${Math.max(progress, 20)}%` }}
                />
            </div>
        </div>
    );
};