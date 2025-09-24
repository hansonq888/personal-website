import { useState, useEffect } from "react";

export default function Cloud({
  src,
  speed,          // horizontal speed multiplier
  initialX,       // starting horizontal position
  initialY,       // vertical fixed position
  width = 100,
  height = "auto",
  shadow = "drop-shadow-2xl",
  fadeDistance = 400, // distance over which cloud fades
  direction = 1
}) {
  const [offsetX, setOffsetX] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY; // amount scrolled in y direction

      // horizontal movement: scrollY affects X position
      setOffsetX(scrollY * speed * direction);

      // fade out as scroll increases
      const newOpacity = Math.max(0, 1 - scrollY / fadeDistance);
      setOpacity(newOpacity); // fade out when scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed, fadeDistance]);

  return (
    <img
      src={src}
      alt="cloud"
      className={`absolute pointer-events-none select-none ${shadow}`}
      style={{
        left: initialX + offsetX, // horizontal movement
        top: initialY,            // fixed vertical position
        width: width,
        height: height,
        opacity: opacity,
        transition: "opacity 0.2s linear",
      }}
    />
  );
}
