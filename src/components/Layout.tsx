import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useListStore } from "@/store/useListStore";
import { 
  Users, 
  X, 
  Trash2, 
  Sparkles,
  ClipboardCopy
} from "lucide-react";
import { formatFollowers } from "@/utils/formatters";
import { Avatar } from "./Avatar";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const { selectedProfiles, removeProfile, clearList } = useListStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExport = () => {
    if (selectedProfiles.length === 0) return;
    const exportText = selectedProfiles
      .map((p) => `@${p.username || p.handle || "creator"} (${p.platform})`)
      .join("\n");
    navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14]">
      {/* Sticky frosted navbar */}
      <header className="sticky top-0 z-40 w-full glass border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-tr from-violet-600 to-pink-500 p-2 rounded-xl text-white shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Wobb Creator Hub
          </span>
        </Link>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="relative flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 active:bg-white/15 text-sm font-medium text-white border border-white/10 rounded-xl transition-all shadow-md cursor-pointer"
        >
          <Users className="w-4 h-4 text-violet-400" />
          <span>My List</span>
          {selectedProfiles.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-violet-600 to-pink-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#080c14] animate-pulse">
              {selectedProfiles.length}
            </span>
          )}
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8">
        {title && (
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>
        )}
        {children}
      </main>

      {/* Slide-out List Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md glass border-l border-white/10 flex flex-col shadow-2xl">
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-violet-400" />
                  <h2 className="text-xl font-bold text-white">Saved Creators</h2>
                  <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs font-semibold text-slate-300">
                    {selectedProfiles.length}
                  </span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedProfiles.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-300">Your list is empty</p>
                      <p className="text-xs text-slate-500 mt-1">Add creators to easily compare and export their profiles.</p>
                    </div>
                  </div>
                ) : (
                  selectedProfiles.map((profile) => (
                    <div
                      key={profile.user_id}
                      className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 hover:bg-white/10 transition-all group"
                    >
                      <Avatar
                        src={profile.picture}
                        alt={profile.fullname}
                        className="w-12 h-12 rounded-full object-cover border border-white/10"
                        fallbackText={profile.username || profile.handle || "creator"}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-white truncate block">
                            @{profile.username || profile.handle || "creator"}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold capitalize ${
                            profile.platform === "instagram" ? "bg-pink-500/10 text-pink-400 border border-pink-500/20" :
                            profile.platform === "youtube" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                            "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          }`}>
                            {profile.platform}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 truncate block">
                          {profile.fullname}
                        </span>
                        <span className="text-[11px] text-slate-500 block font-medium mt-0.5">
                          {formatFollowers(profile.followers)} followers
                        </span>
                      </div>
                      <button
                        onClick={() => removeProfile(profile.user_id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors opacity-80 hover:opacity-100 cursor-pointer"
                        title="Remove from list"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {selectedProfiles.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-[#0f172a]/50 backdrop-blur space-y-3">
                  <button
                    onClick={handleExport}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-500 hover:to-pink-400 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/25 transition-all cursor-pointer"
                  >
                    <ClipboardCopy className="w-4 h-4" />
                    <span>{copied ? "Copied!" : "Export List (Copy)"}</span>
                  </button>
                  <button
                    onClick={clearList}
                    className="w-full py-2.5 bg-white/5 hover:bg-red-500/10 text-slate-300 hover:text-red-400 rounded-xl font-medium border border-white/5 hover:border-red-500/20 transition-all cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
