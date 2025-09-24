import { useState, useRef, useEffect } from "react";

export default function FloatingObject({
  src,
  initialX = 0,
  initialY = 0,
  size = 100,
}) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  // Start dragging
  const handleMouseDown = (e) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  // Move object with mouse
  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    }
  };

  // Stop dragging
  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <img
      src={src}
      alt="floating object"
      onMouseDown={handleMouseDown}
      className="absolute cursor-grab select-none"
      style={{
        left: position.x,
        top: position.y,
        width: size,
        height: "auto",
      }}
    />
  );
}
