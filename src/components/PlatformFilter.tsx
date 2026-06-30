import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { Search, X } from "lucide-react";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

// Custom SVGs for platforms for premium look
function PlatformIcon({ platform }: { platform: Platform }) {
  if (platform === "instagram") {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    );
  }
  if (platform === "youtube") {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.03 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.2 2.27 2.05 3.73 2.45v3.83c-1.39-.08-2.77-.51-3.97-1.23-.74-.45-1.4-1.01-1.95-1.68V14.5c.01 1.77-.45 3.53-1.35 5.04-1.12 1.83-2.92 3.19-5.02 3.75-2.09.58-4.35.34-6.28-.68-1.94-1.01-3.39-2.79-4.01-4.9-.66-2.22-.38-4.63.78-6.6 1.13-1.92 3.02-3.32 5.23-3.85 1.4-.35 2.87-.27 4.22.21v3.9c-.84-.42-1.79-.58-2.72-.45-1.02.13-1.98.67-2.65 1.48-.68.82-.99 1.9-.84 2.96.14 1.05.74 2.01 1.61 2.62.88.63 1.97.82 2.98.54.98-.26 1.83-.93 2.34-1.84.34-.61.5-1.3.48-2v-12.9z" />
    </svg>
  );
}

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  const getButtonClass = (p: Platform) => {
    const isSelected = selected === p;
    
    if (p === "instagram") {
      return isSelected
        ? "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white shadow-md shadow-pink-500/10"
        : "text-slate-400 hover:text-pink-400 hover:bg-white/5";
    }
    if (p === "youtube") {
      return isSelected
        ? "bg-red-600 text-white shadow-md shadow-red-600/10"
        : "text-slate-400 hover:text-red-400 hover:bg-white/5";
    }
    return isSelected
      ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/10"
      : "text-slate-400 hover:text-cyan-400 hover:bg-white/5";
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5 shadow-xl mb-8 flex flex-col md:flex-row gap-6 items-center justify-between">
      {/* Platform Tab Selectors */}
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 self-center hidden md:inline">
          Filter Platform
        </span>
        <div className="flex bg-[#030712] p-1 rounded-xl border border-white/5 self-stretch justify-between sm:justify-start">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 transform active:scale-95 cursor-pointer ${getButtonClass(p)}`}
            >
              <PlatformIcon platform={p} />
              <span>{getPlatformLabel(p)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Modern Search Input */}
      <div className="relative w-full md:max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`Search ${getPlatformLabel(selected)} creators...`}
          className="w-full pl-10 pr-10 py-2.5 bg-[#030712] text-sm text-white placeholder-slate-500 border border-white/5 hover:border-white/10 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl transition-all outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
