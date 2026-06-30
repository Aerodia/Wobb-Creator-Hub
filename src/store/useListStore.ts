import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfileSummary, Platform } from "@/types";

export interface SelectedProfile extends UserProfileSummary {
  platform: Platform;
}

interface ListState {
  selectedProfiles: SelectedProfile[];
  addProfile: (profile: UserProfileSummary, platform: Platform) => void;
  removeProfile: (userId: string) => void;
  clearList: () => void;
  isInList: (userId: string) => boolean;
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      selectedProfiles: [],

      addProfile: (profile, platform) => {
        const { selectedProfiles } = get();
        // Check for duplicates
        if (selectedProfiles.some((p) => p.user_id === profile.user_id)) {
          return;
        }
        set({
          selectedProfiles: [...selectedProfiles, { ...profile, platform }],
        });
      },

      removeProfile: (userId) => {
        const { selectedProfiles } = get();
        set({
          selectedProfiles: selectedProfiles.filter((p) => p.user_id !== userId),
        });
      },

      clearList: () => {
        set({ selectedProfiles: [] });
      },

      isInList: (userId) => {
        return get().selectedProfiles.some((p) => p.user_id === userId);
      },
    }),
    {
      name: "influencer-saved-list",
    }
  )
);
