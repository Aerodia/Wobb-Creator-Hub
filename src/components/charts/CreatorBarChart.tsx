import { memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { FullUserProfile } from "@/types";
import { formatFollowers } from "@/utils/formatters";

interface CreatorBarChartProps {
  user: FullUserProfile;
  accentColor: string;
}

function formatAxisTick(value: number): string {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
  if (value >= 1_000_000)     return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000)         return (value / 1_000).toFixed(0) + "K";
  return String(value);
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-xl text-xs font-semibold shadow-lg"
      style={{
        background: "rgba(14,14,18,0.95)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "var(--text-primary)",
      }}
    >
      <div className="text-[var(--text-muted)] mb-1">{label}</div>
      <div>{formatFollowers(payload[0].value)}</div>
    </div>
  );
}

// Different shades for bars to add visual variety
const BAR_COLORS = [
  "#818cf8", // indigo
  "#f472b6", // pink
  "#34d399", // emerald
  "#fbbf24", // amber
  "#22d3ee", // cyan
];

function CreatorBarChartComponent({ user }: CreatorBarChartProps) {
  const metrics: { name: string; value: number }[] = [
    { name: "Followers",    value: user.followers         ?? 0 },
    { name: "Avg Likes",    value: user.avg_likes         ?? 0 },
    { name: "Avg Comments", value: user.avg_comments      ?? 0 },
    { name: "Avg Views",    value: (user.avg_views && user.avg_views > 0 ? user.avg_views : user.avg_reels_plays) ?? 0 },
  ].filter((m) => m.value > 0);

  if (metrics.length < 2) return null;

  return (
    <div className="surface-card p-5 flex flex-col gap-3" style={{ minHeight: "300px" }}>
      <div>
        <div
          className="text-[10px] font-bold uppercase tracking-[0.15em] mb-0.5"
          style={{ color: "var(--text-muted)" }}
        >
          Metric Breakdown
        </div>
        <p className="text-[11px] text-[var(--text-muted)]">Absolute metric values</p>
      </div>

      <ResponsiveContainer width="100%" height={230}>
        <BarChart
          data={metrics}
          layout="vertical"
          margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
          barSize={18}
        >
          <CartesianGrid
            horizontal={false}
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
          />
          <XAxis
            type="number"
            tickFormatter={formatAxisTick}
            tick={{ fontSize: 9, fill: "var(--text-muted)", fontFamily: "inherit" }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10, fill: "var(--text-secondary)", fontFamily: "inherit", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            width={90}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
            {metrics.map((_, i) => (
              <Cell
                key={i}
                fill={BAR_COLORS[i % BAR_COLORS.length]}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export const CreatorBarChart = memo(CreatorBarChartComponent);
