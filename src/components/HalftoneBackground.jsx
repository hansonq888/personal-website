/**
 * SVG halftone dot pattern: gradient from light (center) to dark (edges)
 * via dot size. Optional bgColor (use "transparent" over a gradient) and dotColor.
 */
export default function HalftoneBackground({ className = "", width = 400, height = 400, dotSpacing = 12, baseRadius = 0.4, maxRadius = 4.5, bgColor = "#ebe0d8", dotColor = "#6b5344", dotOpacity = 1 }) {
  const cols = Math.ceil(width / dotSpacing) + 2;
  const rows = Math.ceil(height / dotSpacing) + 2;
  const cx = (cols * dotSpacing) / 2;
  const cy = (rows * dotSpacing) / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);
  const dots = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * dotSpacing;
      const y = j * dotSpacing;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      const t = Math.min(1, dist / maxDist);
      const r = baseRadius + (maxRadius - baseRadius) * t;
      dots.push({ x, y, r });
    }
  }
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ display: "block" }}
    >
      {bgColor !== "transparent" && <rect width={width} height={height} fill={bgColor} />}
      <g fill={dotColor} opacity={dotOpacity}>
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} />
        ))}
      </g>
    </svg>
  );
}
