import { memo } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { FullUserProfile } from "@/types";

interface CreatorRadarChartProps {
  user: FullUserProfile;
  platform: string;
  accentColor: string;
}

// Platform-realistic reference maxima used to normalize each metric to 0–100
const REF_MAX = {
  followers:       500_000_000,
  engagement_rate: 0.25,
  avg_likes:       10_000_000,
  avg_comments:    500_000,
  avg_views:       50_000_000,
  avg_reels_plays: 50_000_000,
};

function normalize(value: number | undefined, max: number): number {
  if (!value || value <= 0) return 0;
  return Math.min(100, Math.round((value / max) * 100));
}

// Custom tooltip rendered inside the chart
function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: { subject: string; score: number; raw: string } }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="px-3 py-2 rounded-xl text-xs font-semibold shadow-lg"
      style={{
        background: "rgba(14,14,18,0.95)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "var(--text-primary)",
      }}
    >
      <div className="text-[var(--text-muted)] mb-0.5">{d.subject}</div>
      <div>{d.raw}</div>
      <div style={{ color: "var(--text-muted)" }} className="mt-0.5">Score: {d.score}/100</div>
    </div>
  );
}

function CreatorRadarChartComponent({ user, accentColor }: CreatorRadarChartProps) {
  const data = [
    {
      subject: "Followers",
      score: normalize(user.followers, REF_MAX.followers),
      raw: user.followers?.toLocaleString() ?? "N/A",
    },
    {
      subject: "Engagement",
      score: normalize(user.engagement_rate, REF_MAX.engagement_rate),
      raw: user.engagement_rate !== undefined ? (user.engagement_rate * 100).toFixed(2) + "%" : "N/A",
    },
    {
      subject: "Avg Likes",
      score: normalize(user.avg_likes, REF_MAX.avg_likes),
      raw: user.avg_likes?.toLocaleString() ?? "N/A",
    },
    {
      subject: "Avg Comments",
      score: normalize(user.avg_comments, REF_MAX.avg_comments),
      raw: user.avg_comments?.toLocaleString() ?? "N/A",
    },
    {
      subject: "Avg Views",
      score: normalize(
        user.avg_views && user.avg_views > 0 ? user.avg_views
          : user.avg_reels_plays && user.avg_reels_plays > 0 ? user.avg_reels_plays
          : undefined,
        REF_MAX.avg_views
      ),
      raw: (user.avg_views ?? user.avg_reels_plays)?.toLocaleString() ?? "N/A",
    },
  ].filter((d) => d.score > 0);

  if (data.length < 3) return null;

  const fillColor = `${accentColor}28`;

  return (
    <div
      className="surface-card p-5 flex flex-col gap-3"
      style={{ minHeight: "300px" }}
    >
      <div>
        <div
          className="text-[10px] font-bold uppercase tracking-[0.15em] mb-0.5"
          style={{ color: "var(--text-muted)" }}
        >
          Performance Radar
        </div>
        <p className="text-[11px] text-[var(--text-muted)]">
          Normalized score vs platform benchmarks
        </p>
      </div>

      <ResponsiveContainer width="100%" height={230}>
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid
            gridType="polygon"
            stroke="rgba(255,255,255,0.06)"
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fontSize: 10,
              fontWeight: 600,
              fill: "var(--text-secondary)",
              fontFamily: "inherit",
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 8, fill: "var(--text-muted)" }}
            tickCount={4}
            axisLine={false}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke={accentColor}
            fill={fillColor}
            strokeWidth={2}
            dot={{ r: 3, fill: accentColor, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: accentColor, stroke: "var(--bg-base)", strokeWidth: 2 }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export const CreatorRadarChart = memo(CreatorRadarChartComponent);
