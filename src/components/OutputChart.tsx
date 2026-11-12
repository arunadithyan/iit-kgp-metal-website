/**
 * Journal publications per year, counted from faculty profile publication
 * lists. Pure SVG; values are labelled so the chart reads without hover.
 */
export function OutputChart({
  data,
  dark = false,
  partialYear,
}: {
  data: { year: number; count: number }[];
  dark?: boolean;
  partialYear?: number;
}) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const nice = Math.ceil(max / 50) * 50;
  const W = 640;
  const H = 260;
  const padL = 36;
  const padB = 28;
  const padT = 22;
  const bw = (W - padL) / data.length;
  const ticks = [0, nice / 2, nice];
  const text = dark ? "#c9d4e4" : "#4d5767";
  const grid = dark ? "rgba(255,255,255,0.12)" : "#dde1e7";
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="chart-title chart-desc">
        <title id="chart-title">Journal publications per year</title>
        <desc id="chart-desc">
          {data.map((d) => `${d.year}: ${d.count}`).join(", ")}
        </desc>
        {ticks.map((t) => {
          const y = padT + (H - padT - padB) * (1 - t / nice);
          return (
            <g key={t}>
              <line x1={padL} x2={W} y1={y} y2={y} stroke={grid} strokeWidth={1} />
              <text x={padL - 8} y={y + 4} textAnchor="end" fontSize={11} fill={text} className="tabular">
                {t}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const h = ((H - padT - padB) * d.count) / nice;
          const x = padL + i * bw + bw * 0.18;
          const y = H - padB - h;
          const partial = d.year === partialYear;
          const fill = partial ? (dark ? "rgba(255,255,255,0.35)" : "#c4cad3") : i === data.length - 1 || (partialYear && i === data.length - 2) ? "#a4263a" : dark ? "#9fb3cf" : "#1b3d6b";
          return (
            <g key={d.year}>
              <rect x={x} y={y} width={bw * 0.64} height={h} fill={fill} rx={1.5} />
              <text x={x + bw * 0.32} y={y - 6} textAnchor="middle" fontSize={11} fontWeight={600} fill={text} className="tabular">
                {d.count}
              </text>
              <text x={x + bw * 0.32} y={H - 9} textAnchor="middle" fontSize={11} fill={text} className="tabular">
                {i % 2 === 0 || data.length <= 10 ? `’${String(d.year).slice(2)}` : ""}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
