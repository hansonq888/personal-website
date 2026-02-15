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
            <div className="w-[200px] h-[2px] bg-gray-800 relative overflow-hidden">
                <div
                    className="h-full bg-white shadow-[0_0_15px_#3b82f6] transition-all duration-300 ease-out"
                    style={{ width: `${Math.max(progress, 20)}%` }}
                />
            </div>
        </div>
    );
};