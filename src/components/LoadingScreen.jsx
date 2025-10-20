import { useState, useEffect } from "react";


export const LoadingScreen = ({ onComplete, progress = 0 }) =>{
    const [text, setText] = useState("")
    const fullText = "<Hello World! />";
    const [typingComplete, setTypingComplete] = useState(false);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setText(fullText.substring(0, index))
            index ++;

            if (index > fullText.length) {
                clearInterval(interval);
                setTypingComplete(true);
            }
        }, 50);
        

        return () => clearInterval(interval);
    }, []);

    // Complete loading when both typing is done and resources are loaded
    useEffect(() => {
        if (typingComplete && progress >= 100) {
            setTimeout(() => {
                onComplete();
            }, 300);
        }
    }, [typingComplete, progress, onComplete]);
    return (
        <div className="fixed inset-0 z-50 bg-black text-gray-100 flex flex-col items-center justify-center">
            <div className="mb-4 text-4xl jersey-10-regular font-bold">
                {text} <span className="animate-blink ml-1"> | </span>
            </div>
            <div className="w-[200px] h-[2px] bg-gray-800 relative overflow-hidden">
                <div 
                    className="h-full bg-white shadow-[0_015px_#3b82f6] transition-all duration-300 ease-out"
                    style={{ width: `${Math.max(progress, 20)}%` }}
                >
                    {""}
                </div>
            </div>
            <div className="mt-2 text-sm text-gray-400">
                {progress < 100 ? `Loading... ${progress}%` : 'Ready!'}
            </div>
        </div>
    );
}