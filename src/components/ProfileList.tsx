import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { Sparkles } from "lucide-react";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  searchQuery: string;
  onProfileClick: (username: string) => void;
}

export function ProfileList({
  profiles,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="glass-card p-12 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center max-w-md mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500 mb-4 animate-bounce">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">No Creators Found</h3>
        <p className="text-sm text-slate-400">
          We couldn't find any creators matching "{searchQuery}" on {platform}. Try a different search term or check spelling.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.user_id}
          profile={profile}
          platform={platform}
          searchQuery={searchQuery}
          onProfileClick={onProfileClick}
        />
      ))}
    </div>
  );
}
