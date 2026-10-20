/* Lightweight SVG charts tuned to the premium light palette.
   Emerald series · hairline ash grid · tabular numerals. */

function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}

/** Tiny trend line for metric cards. */
export function Sparkline({
  data,
  width = 96,
  height = 32,
  stroke = '#059669',
}: {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * (width - 4) + 2,
    y: height - 3 - ((v - min) / range) * (height - 8),
  }));
  const line = smoothPath(points);
  const last = points[points.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible" aria-hidden>
      <path d={`${line} L ${last.x},${height} L ${points[0].x},${height} Z`} fill={stroke} opacity={0.08} />
      <path d={line} fill="none" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" />
      <circle cx={last.x} cy={last.y} r={2.6} fill="#fff" stroke={stroke} strokeWidth={1.8} />
    </svg>
  );
}

/** Large area chart with grid, axis labels and hover titles. */
export function AreaChart({
  data,
  labels,
  unit = '',
  height = 240,
}: {
  data: number[];
  labels: string[];
  unit?: string;
  height?: number;
}) {
  const W = 720;
  const H = height;
  const PAD = { top: 14, right: 12, bottom: 26, left: 40 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const max = Math.ceil(Math.max(...data) * 1.15);
  const points = data.map((v, i) => ({
    x: PAD.left + (i / (data.length - 1)) * innerW,
    y: PAD.top + innerH - (v / max) * innerH,
    v,
  }));
  const line = smoothPath(points);
  const gridYs = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    y: PAD.top + innerH - f * innerH,
    label: Math.round(max * f),
  }));
  const labelEvery = Math.ceil(labels.length / 10);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Trend chart">
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {gridYs.map((g, i) => (
        <g key={i}>
          <line x1={PAD.left} x2={W - PAD.right} y1={g.y} y2={g.y} stroke="#F3F4F6" strokeWidth={1} />
          <text x={PAD.left - 8} y={g.y + 3.5} textAnchor="end" fontSize={10.5} fill="#9CA3AF">
            {g.label}
          </text>
        </g>
      ))}

      <path
        d={`${line} L ${points[points.length - 1].x},${PAD.top + innerH} L ${points[0].x},${PAD.top + innerH} Z`}
        fill="url(#areaFill)"
      />
      <path d={line} fill="none" stroke="#059669" strokeWidth={2.4} strokeLinecap="round" />

      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={10} fill="transparent">
            <title>{`${labels[i]} — ${p.v}${unit}`}</title>
          </circle>
          <circle cx={p.x} cy={p.y} r={3} fill="#fff" stroke="#059669" strokeWidth={2} className="pointer-events-none" />
          {i % labelEvery === 0 && (
            <text x={p.x} y={H - 8} textAnchor="middle" fontSize={10.5} fill="#9CA3AF">
              {labels[i]}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

/** Rounded bar chart for weekly revenue. */
export function BarChart({ data, labels, height = 200 }: { data: number[]; labels: string[]; height?: number }) {
  const W = 560;
  const H = height;
  const PAD = { top: 18, bottom: 24 };
  const max = Math.max(...data) * 1.15;
  const bw = W / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Bar chart">
      {data.map((v, i) => {
        const h = ((H - PAD.top - PAD.bottom) * v) / max;
        const x = i * bw + bw * 0.24;
        const y = H - PAD.bottom - h;
        const isMax = v === Math.max(...data);
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw * 0.52} height={h} rx={6} fill={isMax ? '#059669' : '#A7F3D0'}>
              <title>{`${labels[i]} — LKR ${v}M`}</title>
            </rect>
            <text x={x + bw * 0.26} y={y - 6} textAnchor="middle" fontSize={10.5} fontWeight={600} fill="#374151">
              {v}
            </text>
            <text x={x + bw * 0.26} y={H - 8} textAnchor="middle" fontSize={10.5} fill="#9CA3AF">
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Donut for fleet status mix. */
export function DonutChart({
  segments,
  size = 168,
  thickness = 22,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Fleet status distribution">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F3F4F6" strokeWidth={thickness} />
      {segments.map((s) => {
        const frac = s.value / total;
        const dash = frac * c;
        const el = (
          <circle
            key={s.label}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={`${Math.max(dash - 2, 0)} ${c - dash + 2}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            strokeLinecap="butt"
          >
            <title>{`${s.label} — ${s.value.toLocaleString()}`}</title>
          </circle>
        );
        offset += dash;
        return el;
      })}
      <text x="50%" y="47%" textAnchor="middle" fontSize={21} fontWeight={800} fill="#111827">
        {total.toLocaleString()}
      </text>
      <text x="50%" y="47%" dy={20} textAnchor="middle" fontSize={10.5} fill="#6B7280">
        registered buses
      </text>
    </svg>
  );
}
