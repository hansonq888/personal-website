import { useState, useEffect } from "react";

export default function Cloud({
  src,
  speed,          // horizontal speed multiplier
  initialX,       // starting horizontal position
  initialY,       // vertical fixed position
  shadow = "drop-shadow-2xl",
  fadeDistance = 400, // distance over which cloud fades
  direction = 1
}) {
  const [offsetX, setOffsetX] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // horizontal movement: scrollY affects X position
      setOffsetX(scrollY * speed * direction);

      // fade out as scroll increases
      const newOpacity = Math.max(0, 1 - scrollY / fadeDistance);
      setOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed, fadeDistance, direction]);

  return (
    <img
      src={src}
      alt="cloud"
      className={`absolute pointer-events-none select-none ${shadow}
        w-38 sm:w-42 md:w-72 lg:w-[450px]`} 
      style={{
        right: initialX,                 // always hugs the right edge
        top: initialY,
        transform: `translateX(${offsetX}px)`, // let scroll still move it
        opacity: opacity,
        transition: "opacity 0.2s linear",
        height: "auto",
      }}
    />

  );
}
