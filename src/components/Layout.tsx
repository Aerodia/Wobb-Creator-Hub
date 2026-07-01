import { useState, useCallback, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useListStore } from "@/store/useListStore";
import {
  Search, Bookmark, Trash2, X, ClipboardCopy, Check, Menu, Zap, ChevronRight, GitCompareArrows,
} from "lucide-react";
import { Avatar } from "./Avatar";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerActions?: ReactNode;
}

function PlatformDot({ platform }: { platform: string }) {
  const cls =
    platform === "instagram" ? "bg-pink-500" :
    platform === "youtube"   ? "bg-red-500"  : "bg-cyan-500";
  return <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${cls}`} />;
}

export function Layout({ children, title, subtitle, headerActions }: LayoutProps) {
  const location = useLocation();
  const { selectedProfiles, removeProfile, clearList } = useListStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listExpanded, setListExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleExport = useCallback(() => {
    if (selectedProfiles.length === 0) return;
    const text = selectedProfiles
      .map((p) => `@${p.username || p.handle || "creator"} (${p.platform})`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [selectedProfiles]);

  // ── Sidebar JSX (rendered inline, not as inner component) ──
  const sidebarJSX = (onClose?: () => void) => (
    <div className="flex flex-col h-full py-4">
      {/* Brand */}
      <div className="px-4 mb-6">
        <Link to="/" className="flex items-center gap-2.5 no-underline" onClick={onClose}>
          <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-[var(--text-primary)] leading-none">Wobb</div>
            <div className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5">Creator Hub</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <div className="px-3 space-y-0.5 mb-5">
        <Link
          to="/"
          className={`nav-item ${isActive("/") ? "active" : ""}`}
          onClick={onClose}
        >
          <Search className="w-4 h-4 flex-shrink-0" />
          <span>Discover</span>
        </Link>
        <Link
          to="/compare"
          className={`nav-item ${isActive("/compare") ? "active" : ""}`}
          onClick={onClose}
        >
          <GitCompareArrows className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">Compare</span>
          {selectedProfiles.length >= 2 && (
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full border"
              style={{
                color: isActive("/compare") ? "var(--accent)" : "var(--text-muted)",
                background: isActive("/compare") ? "var(--accent-bg)" : "var(--bg-elevated)",
                borderColor: isActive("/compare") ? "var(--accent-border)" : "var(--border-subtle)",
              }}
            >
              {selectedProfiles.length}
            </span>
          )}
        </Link>
      </div>

      {/* Saved section label */}
      <div className="px-4 mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          Saved List
        </span>
      </div>

      {/* Saved list */}
      <div className="px-3 flex-1 overflow-hidden flex flex-col min-h-0">
        {selectedProfiles.length === 0 ? (
          <div className="px-2 py-5 text-center">
            <Bookmark className="w-5 h-5 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
            <p className="text-xs text-[var(--text-muted)]">No creators saved yet</p>
          </div>
        ) : (
          <>
            <button
              onClick={() => setListExpanded((v) => !v)}
              className="nav-item w-full text-left mb-1"
            >
              <Bookmark className="w-4 h-4 flex-shrink-0 text-indigo-400" />
              <span className="flex-1 text-left">My List</span>
              <span
                key={selectedProfiles.length}
                className="text-[11px] font-semibold bg-indigo-500/15 text-indigo-400 px-1.5 py-0.5 rounded-full border border-indigo-500/25 anim-badge-bump"
              >
                {selectedProfiles.length}
              </span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${listExpanded ? "rotate-90" : ""}`} />
            </button>

            {listExpanded && (
              <div className="flex-1 overflow-y-auto space-y-0.5 mt-1 min-h-0">
                {selectedProfiles.map((profile, idx) => (
                  <div
                    key={profile.user_id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--bg-elevated)] group transition-colors anim-slide-left"
                  style={{ animationDelay: `${Math.min(idx, 6) * 30}ms` }}
                  >
                    <Avatar
                      src={profile.picture}
                      alt={profile.fullname}
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0 text-[10px]"
                      fallbackText={profile.username || profile.handle || "?"}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium text-[var(--text-primary)] truncate leading-none">
                        @{profile.username || profile.handle || "creator"}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <PlatformDot platform={profile.platform} />
                        <span className="text-[10px] text-[var(--text-muted)] capitalize">{profile.platform}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeProfile(profile.user_id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded text-[var(--text-muted)] hover:text-red-400 transition-all cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-2 pt-2 space-y-1 border-t border-[var(--border-subtle)]">
              {selectedProfiles.length >= 2 && (
                <Link
                  to="/compare"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer no-underline"
                  style={{
                    color: "var(--accent)",
                    background: "var(--accent-bg)",
                    borderColor: "var(--accent-border)",
                  }}
                >
                  <GitCompareArrows className="w-3.5 h-3.5" />
                  <span>Compare {selectedProfiles.length} Creators</span>
                </Link>
              )}
              <button
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/15 text-indigo-400 text-xs font-medium border border-indigo-500/20 transition-colors cursor-pointer"
              >
                {copied
                  ? <><Check className="w-3.5 h-3.5" /><span>Copied!</span></>
                  : <><ClipboardCopy className="w-3.5 h-3.5" /><span>Export List</span></>}
              </button>
              <button
                onClick={clearList}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-500/8 text-[var(--text-muted)] hover:text-red-400 text-xs font-medium transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /><span>Clear All</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer status */}
      <div className="px-4 pt-3 border-t border-[var(--border-subtle)] mt-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" />
          <span className="text-[11px] text-[var(--text-muted)]">Live data</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      {/* Desktop sidebar */}
      <aside className="sidebar-surface hidden md:flex flex-col flex-shrink-0" style={{ width: "220px" }}>
        {sidebarJSX()}
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="sidebar-surface relative flex flex-col z-10" style={{ width: "220px" }}>
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebarJSX(() => setSidebarOpen(false))}
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top header */}
        <header
          className="flex items-center justify-between px-5 flex-shrink-0"
          style={{
            background: "var(--bg-overlay)",
            borderBottom: "1px solid var(--border-subtle)",
            minHeight: "52px",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>

            {title && (
              <div>
                <h1 className="text-sm font-semibold text-[var(--text-primary)] leading-none">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {headerActions}
            {selectedProfiles.length > 0 && !headerActions && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-400">
                  {selectedProfiles.length} saved
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
