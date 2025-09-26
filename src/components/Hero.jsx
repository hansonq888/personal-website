import { useState, useEffect } from "react";
import Cloud from "../components/Cloud";

export default function Hero() {
  const fullText = "hanson qin";
  const [text, setText] = useState(""); // to change text
  const [typingForward, setTypingForward] = useState(true); // to change typing forward or not
  const [isPaused, setIsPaused] = useState(false); // to change whether paused or not

  useEffect(() => {
    if (isPaused) return; // don't do anything if paused

    const speed = 90; // typing speed
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


  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center bg-cover bg-contain bg-no-repeat"
    style={{ backgroundImage: "url('/HeroBackground.png')"}}>
        <Cloud src="/Cloud1.png" speed={0.2} initialX={"-14%"} initialY={"35%"} width={450}/>
        <Cloud src="/Cloud2.png" speed={0.5} initialX={"67%"} initialY={"15%"} width={450} direction={-1} />
        <Cloud src="/Cloud3.png" speed={0.8} initialX={"77%"} initialY={"60%"} width={500} direction={-1} />
    <div className="overflow-hidden"> {/* over flow hidden to hide that white trail thingy */}
      <h1 className="text-9xl font-bold text-white">
        {text}
        <span className="animate-blink">|</span>
      </h1>
    </div>
      <p className="text-lg text-white-600 mt-1">Welcome to my website!</p>
    </section>
    
  );
}
