import { useState, useEffect } from "react";
import Cloud from "../components/Cloud";

export default function Hero() {
  const fullText = "hanson qin";
  const [text, setText] = useState(""); // to change text
  const [typingForward, setTypingForward] = useState(true); // to change typing forward or not
  const [isPaused, setIsPaused] = useState(false); // to change whether paused or not

  useEffect(() => {
    if (isPaused) return; // don't do anything if paused

    const speed = 150; // typing speed - increased for better performance
    const interval = setInterval(() => {
      if (typingForward) {
        // typing forward
        setText((prev) => {
          if (prev.length < fullText.length) return fullText.substring(0, prev.length + 1);
          else {
            // full text, pause 5 seconds
            setIsPaused(true);
            setTimeout(() => {
              setTypingForward(false); // now typing backwards
              setIsPaused(false); // un pause
            }, 10000);
            return prev;
          }
        });
      } else {
        // deleting
        setText((prev) => {
          if (prev.length > 0) return fullText.substring(0, prev.length - 1);
          else {
            setIsPaused(true);
            setTimeout(() => {
              setTypingForward(true); // now typing backwards
              setIsPaused(false); // un pause
            }, 2000);
            return prev;
          }
        });
      }
    }, speed);

    return () => clearInterval(interval); // cleansup the interval
  }, [typingForward, isPaused]); // dependencies


  // Helper function to extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center">
        <Cloud src="/Cloud1.png" speed={0.2} initialX={"-14%"} initialY={"35%"} width={450}/>
        <Cloud src="/Cloud2.png" speed={0.5} initialX={"67%"} initialY={"15%"} width={450} direction={-1} />
        <Cloud src="/Cloud3.png" speed={0.8} initialX={"77%"} initialY={"60%"} width={500} direction={-1} />
    <div className="overflow-hidden"> {/* over flow hidden to hide that white trail thingy */}
      <h1 className="text-9xl font-bold text-white">
        {text}
        <span className="animate-blink">|</span>
      </h1>
    </div>
    
    {/* New! Section */}
    <div className="mt-24 mb-4">
      <div className="flex items-center justify-center mb-4">
        <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold animate-pulse">
          NEW!
        </span>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-2xl mx-auto px-4">
        {/* Priority Email Labeler */}
        <div className="flex-1 max-w-xs">
          <div 
            className="relative aspect-video rounded-lg overflow-hidden bg-gray-800 border border-white/20 cursor-pointer group"
            onClick={() => window.location.href = '/projects/priority-email-labeler'}
          >
            <img
              src="/priorityEmailSS.png"
              alt="Priority Email Labeler"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/60 transition-all duration-300"></div>
            <div className="absolute bottom-2 left-2 right-2">
              <h3 className="text-white text-sm font-semibold">Priority Email Labeler</h3>
              <p className="text-white/70 text-xs">ML Gmail integration</p>
            </div>
            <div className="absolute top-2 right-2">
              <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                View Project
              </div>
            </div>
          </div>
        </div>

        {/* Chord Detector */}
        <div className="flex-1 max-w-xs">
          <div 
            className="relative aspect-video rounded-lg overflow-hidden bg-gray-800 border border-white/20 cursor-pointer group"
            onClick={() => window.location.href = '/projects/live-chord-detector'}
          >
            <img
              src="/chordDetectorSS.png"
              alt="Live Chord Detector"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/60 transition-all duration-300"></div>
            <div className="absolute bottom-2 left-2 right-2">
              <h3 className="text-white text-sm font-semibold">Live Chord Detector</h3>
              <p className="text-white/70 text-xs">Real-time ML music</p>
            </div>
            <div 
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                window.open("https://drive.google.com/uc?export=download&id=1N83rAu9avdOqpdn7tuwPQVj3uWGsBDAy", '_blank');
              }}
            >
              <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold cursor-pointer hover:bg-green-700 transition-colors">
                📥 Download
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
    
  );
}
