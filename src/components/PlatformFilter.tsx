import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { SearchBar } from "./SearchBar";
import { SlidersHorizontal } from "lucide-react";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  totalCount: number;
  filteredCount: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

interface PlatformColor { active: string; bg: string; border: string; }

const PLATFORM_COLORS: Record<Platform, PlatformColor> = {
  instagram: { active: "#f472b6", bg: "rgba(244,114,182,0.08)", border: "rgba(244,114,182,0.25)" },
  youtube:   { active: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)" },
  tiktok:    { active: "#22d3ee", bg: "rgba(34,211,238,0.08)",  border: "rgba(34,211,238,0.25)"  },
};

const SORT_OPTIONS = [
  { value: "followers_desc", label: "Most Followers" },
  { value: "engagement_desc", label: "Best Engagement" },
  { value: "followers_asc", label: "Fewest Followers" },
];

export function PlatformFilter({
  selected, onChange, searchQuery, onSearchChange,
  totalCount, filteredCount, sortBy, onSortChange,
}: PlatformFilterProps) {
  return (
    <div className="flex flex-col gap-3 mb-5">
      {/* Row 1: Platform tabs + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Platform tabs */}
        <div
          className="flex items-center gap-1 p-1 rounded-lg flex-shrink-0"
          style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-subtle)" }}
        >
          {PLATFORMS.map((p) => {
            const isActive = selected === p;
            const colors = PLATFORM_COLORS[p];
            return (
              <button
                key={p}
                onClick={() => onChange(p)}
                className="px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer press-active relative"
                style={{
                  transition: "color 0.15s ease, background 0.15s ease, border-color 0.15s ease, transform 0.08s ease",
                  ...(isActive ? {
                    color: colors.active,
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                  } : {
                    color: "var(--text-muted)",
                    background: "transparent",
                    border: "1px solid transparent",
                  }),
                }}
              >
                {getPlatformLabel(p)}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={`Search creators on ${getPlatformLabel(selected)}…`}
          className="flex-1"
        />

        {/* Sort */}
        <div className="relative flex-shrink-0">
          <SlidersHorizontal
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
          />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="input-base appearance-none cursor-pointer"
            style={{ paddingLeft: "30px", paddingRight: "28px", fontSize: "12px", width: "auto", minWidth: "150px" }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Result count */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--text-muted)]">
          {searchQuery
            ? `${filteredCount} of ${totalCount} creators match "${searchQuery}"`
            : `${totalCount} creators on ${getPlatformLabel(selected)}`}
        </span>
      </div>
    </div>
  );
}
