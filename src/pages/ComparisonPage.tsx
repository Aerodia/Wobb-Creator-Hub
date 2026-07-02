import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useListStore, type SelectedProfile } from "@/store/useListStore";
import { Avatar } from "@/components/Avatar";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";
import { ComparisonBarChart } from "@/components/charts/ComparisonBarChart";
import {
  GitCompareArrows,
  Users,
  Activity,
  Heart,
  MessageSquare,
  Eye,
  Layers,
  BadgeCheck,
  TrendingUp,
  CheckSquare,
  Square,
  Bookmark,
  ArrowLeft,
  ExternalLink,
  BarChart2,
  TableIcon,
} from "lucide-react";

// ─── Factor definitions ────────────────────────────────────────────────────

type FactorKey =
  | "followers"
  | "engagement_rate"
  | "avg_likes"
  | "avg_comments"
  | "avg_views"
  | "posts_count"
  | "is_verified"
  | "platform";

interface Factor {
  key: FactorKey;
  label: string;
  icon: React.ElementType;
  type: "numeric" | "boolean" | "text";
  getValue: (p: SelectedProfile) => number | boolean | string | undefined;
  format: (v: number | boolean | string | undefined) => string;
}

const FACTORS: Factor[] = [
  {
    key: "followers",
    label: "Followers",
    icon: Users,
    type: "numeric",
    getValue: (p) => p.followers,
    format: (v) => formatFollowers(v as number),
  },
  {
    key: "engagement_rate",
    label: "Engagement Rate",
    icon: Activity,
    type: "numeric",
    getValue: (p) => p.engagement_rate,
    format: (v) => formatEngagementRate(v as number),
  },
  {
    key: "avg_likes",
    label: "Avg Likes",
    icon: Heart,
    type: "numeric",
    getValue: (p) => p.engagements ? Math.floor((p.engagements as number) * 0.95) : undefined,
    format: (v) => v !== undefined ? formatFollowers(v as number) : "N/A",
  },
  {
    key: "avg_comments",
    label: "Avg Comments",
    icon: MessageSquare,
    type: "numeric",
    getValue: (p) => p.engagements ? Math.floor((p.engagements as number) * 0.05) : undefined,
    format: (v) => v !== undefined ? formatFollowers(v as number) : "N/A",
  },
  {
    key: "avg_views",
    label: "Avg Views",
    icon: Eye,
    type: "numeric",
    getValue: (p) => p.avg_views && p.avg_views > 0 ? p.avg_views : undefined,
    format: (v) => v !== undefined ? formatFollowers(v as number) : "N/A",
  },
  {
    key: "posts_count",
    label: "Est. Posts",
    icon: Layers,
    type: "numeric",
    getValue: (p) => p.engagements ? Math.floor(p.followers / ((p.engagements as number) + 10)) : undefined,
    format: (v) => v !== undefined ? (v as number).toLocaleString() : "N/A",
  },
  {
    key: "is_verified",
    label: "Verified",
    icon: BadgeCheck,
    type: "boolean",
    getValue: (p) => p.is_verified,
    format: (v) => v ? "Yes" : "No",
  },
  {
    key: "platform",
    label: "Platform",
    icon: TrendingUp,
    type: "text",
    getValue: (p) => p.platform,
    format: (v) => {
      if (v === "instagram") return "Instagram";
      if (v === "youtube")   return "YouTube";
      if (v === "tiktok")    return "TikTok";
      return String(v ?? "—");
    },
  },
];

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "text-pink-400",
  youtube:   "text-red-400",
  tiktok:    "text-cyan-400",
};

// ─── Sub-components ────────────────────────────────────────────────────────

function FactorChip({
  factor,
  active,
  onToggle,
}: {
  factor: Factor;
  active: boolean;
  onToggle: () => void;
}) {
  const Icon = factor.icon;
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 cursor-pointer press-active"
      style={
        active
          ? {
              color: "var(--accent)",
              background: "var(--accent-bg)",
              borderColor: "var(--accent-border)",
            }
          : {
              color: "var(--text-muted)",
              background: "var(--bg-surface)",
              borderColor: "var(--border-subtle)",
            }
      }
    >
      {active ? (
        <CheckSquare className="w-3.5 h-3.5 flex-shrink-0" />
      ) : (
        <Square className="w-3.5 h-3.5 flex-shrink-0" />
      )}
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{factor.label}</span>
    </button>
  );
}

function CreatorHeader({ profile }: { profile: SelectedProfile }) {
  const username = profile.username || profile.handle || "creator";
  const platColor = PLATFORM_COLORS[profile.platform] ?? "text-[var(--text-muted)]";

  return (
    <div className="flex flex-col items-center gap-2 p-4 min-w-[140px]">
      <div className="relative">
        <Avatar
          src={profile.picture}
          alt={profile.fullname}
          className="w-12 h-12 rounded-full object-cover"
          fallbackText={username}
        />
        {profile.is_verified && (
          <span className="absolute -bottom-0.5 -right-0.5">
            <VerifiedBadge verified />
          </span>
        )}
      </div>
      <div className="text-center min-w-0 w-full">
        <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
          @{username}
        </div>
        <div className={`text-[10px] font-medium capitalize mt-0.5 ${platColor}`}>
          {profile.platform}
        </div>
        {profile.fullname && profile.fullname !== username && (
          <div className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">
            {profile.fullname}
          </div>
        )}
      </div>
      {profile.url && (
        <a
          href={profile.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-[var(--text-muted)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-2.5 h-2.5" />
          View
        </a>
      )}
    </div>
  );
}

// Compute ranking colour for a row cell
function getCellHighlight(
  factor: Factor,
  value: number | boolean | string | undefined,
  allValues: (number | boolean | string | undefined)[]
): "best" | "worst" | "neutral" {
  if (factor.type !== "numeric") return "neutral";
  const numValues = allValues
    .filter((v) => v !== undefined && typeof v === "number")
    .map((v) => v as number);
  if (numValues.length < 2) return "neutral";
  const n = value as number | undefined;
  if (n === undefined) return "neutral";
  const max = Math.max(...numValues);
  const min = Math.min(...numValues);
  if (max === min) return "neutral";
  if (n === max) return "best";
  if (n === min) return "worst";
  return "neutral";
}

function pctDiffFromBest(value: number, allValues: (number | boolean | string | undefined)[]): string | null {
  const numValues = allValues
    .filter((v) => typeof v === "number")
    .map((v) => v as number);
  if (numValues.length < 2) return null;
  const max = Math.max(...numValues);
  if (max === 0 || value === max) return null;
  const diff = ((value - max) / max) * 100;
  return `${diff.toFixed(0)}%`;
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export function ComparisonPage() {
  const { selectedProfiles } = useListStore();

  // Default: all factors active
  const [activeFactors, setActiveFactors] = useState<Set<FactorKey>>(
    new Set(FACTORS.map((f) => f.key))
  );
  // Toggle between chart and table view
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");

  const toggleFactor = (key: FactorKey) => {
    setActiveFactors((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        // Always keep at least 1 factor
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const selectAll  = () => setActiveFactors(new Set(FACTORS.map((f) => f.key)));
  const clearAll   = () => setActiveFactors(new Set([FACTORS[0].key]));

  const visibleFactors = useMemo(
    () => FACTORS.filter((f) => activeFactors.has(f.key)),
    [activeFactors]
  );

  const hasEnough = selectedProfiles.length >= 2;

  return (
    <Layout
      title="Comparison Matrix"
      subtitle="Compare creators side-by-side across key metrics"
    >
      <div className="max-w-7xl mx-auto space-y-5">

        {/* ── Back link ── */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors no-underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Discover</span>
          <span>/</span>
          <span className="text-[var(--text-secondary)]">Compare</span>
        </Link>

        {/* ── Factor Picker ── */}
        <div
          className="surface-card p-4 anim-fade-in-up"
          style={{ position: "sticky", top: "0px", zIndex: 10, animationDelay: "0ms" }}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <GitCompareArrows className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  Comparison Factors
                </span>
                <span
                  className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full border"
                  style={{
                    color: "var(--accent)",
                    background: "var(--accent-bg)",
                    borderColor: "var(--accent-border)",
                  }}
                >
                  {activeFactors.size} active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center gap-0.5 p-1 rounded-lg"
                  style={{ background: "var(--bg-base)", border: "1px solid var(--border-subtle)" }}
                >
                  <button
                    onClick={() => setViewMode("chart")}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold cursor-pointer transition-all"
                    style={
                      viewMode === "chart"
                        ? { color: "var(--accent)", background: "var(--accent-bg)", border: "1px solid var(--accent-border)" }
                        : { color: "var(--text-muted)", background: "transparent", border: "1px solid transparent" }
                    }
                  >
                    <BarChart2 className="w-3 h-3" />
                    Chart
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold cursor-pointer transition-all"
                    style={
                      viewMode === "table"
                        ? { color: "var(--accent)", background: "var(--accent-bg)", border: "1px solid var(--accent-border)" }
                        : { color: "var(--text-muted)", background: "transparent", border: "1px solid transparent" }
                    }
                  >
                    <TableIcon className="w-3 h-3" />
                    Table
                  </button>
                </div>
                <button
                  onClick={selectAll}
                  className="text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-[var(--border-strong)]">·</span>
                <button
                  onClick={clearAll}
                  className="text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {FACTORS.map((f) => (
                <FactorChip
                  key={f.key}
                  factor={f}
                  active={activeFactors.has(f.key)}
                  onToggle={() => toggleFactor(f.key)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Empty state ── */}
        {!hasEnough && (
          <div
            className="flex flex-col items-center justify-center py-20 text-center gap-4 anim-fade-in-up surface-card"
            style={{ animationDelay: "80ms" }}
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-border)" }}
            >
              <GitCompareArrows className="w-6 h-6 text-[var(--accent)]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                {selectedProfiles.length === 0
                  ? "No creators saved yet"
                  : "Save one more creator to compare"}
              </h3>
              <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">
                {selectedProfiles.length === 0
                  ? "Go to Discover and save at least 2 creators to start comparing."
                  : `You have ${selectedProfiles.length} creator saved. Save one more to unlock the matrix.`}
              </p>
            </div>
            <Link to="/" className="btn-primary press-active">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Go to Discover</span>
            </Link>
          </div>
        )}

        {/* ── Chart or Table ── */}
        {hasEnough && (
          <div>
            {/* Chart view */}
            {viewMode === "chart" && (
              <ComparisonBarChart
                profiles={selectedProfiles}
                activeFactorKeys={Array.from(activeFactors)}
              />
            )}

            {/* Table view */}
            {viewMode === "table" && (
              <div className="anim-fade-in-up" style={{ animationDelay: "80ms" }}>
            <div
              className="overflow-x-auto rounded-xl border"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <table
                className="w-full border-collapse text-left"
                style={{ background: "var(--bg-surface)", minWidth: `${180 + selectedProfiles.length * 160}px` }}
              >
                {/* ── Table head: creator columns ── */}
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    {/* Factor label column */}
                    <th
                      className="text-left text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] px-4 py-3"
                      style={{
                        position: "sticky",
                        left: 0,
                        background: "var(--bg-overlay)",
                        borderRight: "1px solid var(--border-subtle)",
                        minWidth: "160px",
                        zIndex: 2,
                      }}
                    >
                      Metric
                    </th>

                    {selectedProfiles.map((profile, idx) => (
                      <th
                        key={profile.user_id}
                        className="text-center p-0"
                        style={{
                          background: idx % 2 === 0 ? "var(--bg-surface)" : "var(--bg-elevated)",
                          minWidth: "160px",
                        }}
                      >
                        <CreatorHeader profile={profile} />
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* ── Table body: metric rows ── */}
                <tbody>
                  {visibleFactors.map((factor, rowIdx) => {
                    const Icon = factor.icon;
                    const allValues = selectedProfiles.map((p) => factor.getValue(p));

                    return (
                      <tr
                        key={factor.key}
                        className="transition-colors"
                        style={{
                          borderTop: "1px solid var(--border-subtle)",
                          background: rowIdx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                        }}
                      >
                        {/* Factor label */}
                        <td
                          className="px-4 py-3 text-xs font-medium text-[var(--text-secondary)]"
                          style={{
                            position: "sticky",
                            left: 0,
                            background: rowIdx % 2 === 0 ? "var(--bg-surface)" : "var(--bg-elevated)",
                            borderRight: "1px solid var(--border-subtle)",
                            zIndex: 1,
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
                            <span>{factor.label}</span>
                          </div>
                        </td>

                        {/* Value cells */}
                        {selectedProfiles.map((profile, colIdx) => {
                          const raw = factor.getValue(profile);
                          const highlight = getCellHighlight(factor, raw, allValues);
                          const formatted = factor.format(raw);
                          const diff =
                            factor.type === "numeric" && typeof raw === "number"
                              ? pctDiffFromBest(raw, allValues)
                              : null;

                          const cellBg =
                            highlight === "best"
                              ? "rgba(52,211,153,0.06)"
                              : highlight === "worst"
                              ? "rgba(239,68,68,0.05)"
                              : colIdx % 2 === 0
                              ? "var(--bg-surface)"
                              : "var(--bg-elevated)";

                          const valueColor =
                            highlight === "best"
                              ? "#34d399"
                              : highlight === "worst"
                              ? "#f87171"
                              : "var(--text-primary)";

                          return (
                            <td
                              key={profile.user_id}
                              className="px-4 py-3 text-center transition-colors"
                              style={{ background: cellBg }}
                            >
                              <div className="flex flex-col items-center gap-0.5">
                                <span
                                  className="text-sm font-bold tabular-nums"
                                  style={{ color: valueColor }}
                                >
                                  {factor.type === "boolean" ? (
                                    raw ? (
                                      <span className="text-emerald-400">✓ Yes</span>
                                    ) : (
                                      <span className="text-[var(--text-muted)]">— No</span>
                                    )
                                  ) : (
                                    formatted
                                  )}
                                </span>

                                {/* % diff sub-label */}
                                {highlight === "best" && (
                                  <span className="text-[9px] font-semibold text-emerald-500 uppercase tracking-wide">
                                    Best
                                  </span>
                                )}
                                {highlight === "worst" && diff && (
                                  <span className="text-[9px] font-medium text-red-400">
                                    {diff} vs best
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: "rgba(52,211,153,0.3)", border: "1px solid rgba(52,211,153,0.4)" }} />
                <span className="text-[10px] text-[var(--text-muted)]">Best in category</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)" }} />
                <span className="text-[10px] text-[var(--text-muted)]">Lowest in category</span>
              </div>
              <div className="ml-auto text-[10px] text-[var(--text-muted)]">
                {selectedProfiles.length} creators · {visibleFactors.length} factors
              </div>
            </div>
          </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
