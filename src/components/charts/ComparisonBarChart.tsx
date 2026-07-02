import { memo, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { SelectedProfile } from "@/store/useListStore";
import { formatFollowers } from "@/utils/formatters";

interface ComparisonBarChartProps {
  profiles: SelectedProfile[];
  /** Only numeric factor keys */
  activeFactorKeys: string[];
}

// Factor label + raw value extractor for each key
const FACTOR_META: Record<string, { label: string; getValue: (p: SelectedProfile) => number | undefined }> = {
  followers: {
    label: "Followers",
    getValue: (p) => p.followers,
  },
  engagement_rate: {
    label: "Engagement %",
    getValue: (p) => p.engagement_rate !== undefined ? parseFloat((p.engagement_rate * 100).toFixed(2)) : undefined,
  },
  avg_likes: {
    label: "Avg Likes",
    getValue: (p) => p.engagements ? Math.floor((p.engagements as number) * 0.95) : undefined,
  },
  avg_comments: {
    label: "Avg Comments",
    getValue: (p) => p.engagements ? Math.floor((p.engagements as number) * 0.05) : undefined,
  },
  avg_views: {
    label: "Avg Views",
    getValue: (p) => p.avg_views && p.avg_views > 0 ? p.avg_views : undefined,
  },
  posts_count: {
    label: "Est. Posts",
    getValue: (p) => p.engagements ? Math.floor(p.followers / ((p.engagements as number) + 10)) : undefined,
  },
};

// A distinct, vivid color per creator slot
const CREATOR_COLORS = [
  "#818cf8", // indigo
  "#f472b6", // pink
  "#34d399", // emerald
  "#fbbf24", // amber
  "#22d3ee", // cyan
  "#f87171", // red
];

function formatAxisTick(value: number): string {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
  if (value >= 1_000_000)     return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000)         return (value / 1_000).toFixed(0) + "K";
  return String(value);
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3.5 py-2.5 rounded-xl text-xs shadow-xl"
      style={{
        background: "rgba(14,14,18,0.96)",
        border: "1px solid rgba(255,255,255,0.1)",
        minWidth: "140px",
      }}
    >
      <div className="font-bold text-[var(--text-primary)] mb-2">{label}</div>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
          <span className="text-[var(--text-muted)] truncate max-w-[80px]">{entry.name}</span>
          <span className="font-bold text-[var(--text-primary)] ml-auto pl-3">
            {formatFollowers(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function ComparisonBarChartComponent({ profiles, activeFactorKeys }: ComparisonBarChartProps) {
  // Build chart data: one object per factor row
  const chartData = useMemo(() => {
    const numericKeys = activeFactorKeys.filter((k) => k in FACTOR_META && k !== "is_verified" && k !== "platform");

    return numericKeys
      .map((key) => {
        const meta = FACTOR_META[key];
        if (!meta) return null;
        const row: Record<string, string | number> = { factor: meta.label };
        let hasData = false;
        profiles.forEach((p) => {
          const val = meta.getValue(p);
          const name = `@${p.username || p.handle || "creator"}`;
          row[name] = val ?? 0;
          if (val !== undefined && val > 0) hasData = true;
        });
        return hasData ? row : null;
      })
      .filter(Boolean) as Record<string, string | number>[];
  }, [profiles, activeFactorKeys]);

  const creatorNames = profiles.map((p) => `@${p.username || p.handle || "creator"}`);

  if (chartData.length === 0) return null;

  return (
    <div className="surface-card p-5 flex flex-col gap-4 anim-fade-in-up" style={{ animationDelay: "60ms" }}>
      <div className="flex items-center justify-between">
        <div>
          <div
            className="text-[10px] font-bold uppercase tracking-[0.15em] mb-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            Visual Comparison
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            Grouped bar chart — {chartData.length} metrics × {profiles.length} creators
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={Math.max(280, chartData.length * 72)}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
          barGap={3}
          barCategoryGap="30%"
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
            dataKey="factor"
            tick={{ fontSize: 10, fill: "var(--text-secondary)", fontFamily: "inherit", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            width={110}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.025)" }} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "11px", color: "var(--text-secondary)", paddingTop: "12px" }}
          />
          {creatorNames.map((name, i) => (
            <Bar
              key={name}
              dataKey={name}
              name={name}
              fill={CREATOR_COLORS[i % CREATOR_COLORS.length]}
              fillOpacity={0.82}
              radius={[0, 5, 5, 0]}
              maxBarSize={16}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export const ComparisonBarChart = memo(ComparisonBarChartComponent);
