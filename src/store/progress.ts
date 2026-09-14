import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const PROGRESS_STORAGE_KEY = "tucana-daily-progress";
const isServer = Platform.OS === "web" && typeof window === "undefined";

const progressStorage = createJSONStorage(() => ({
  getItem: async (name: string) => {
    if (isServer) {
      return null;
    }

    try {
      return await AsyncStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    if (isServer) {
      return;
    }

    try {
      await AsyncStorage.setItem(name, value);
    } catch {
      // Storage is optional; the in-memory progress still works.
    }
  },
  removeItem: async (name: string) => {
    if (isServer) {
      return;
    }

    try {
      await AsyncStorage.removeItem(name);
    } catch {
      // Storage is optional; the in-memory reset still works.
    }
  },
}));

type ProgressStore = {
  streak: number;
  completedItemIds: string[];
  toggleItemComplete: (itemId: string) => void;
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      streak: 1,
      completedItemIds: [],
      toggleItemComplete: (itemId) =>
        set((state) => ({
          completedItemIds: state.completedItemIds.includes(itemId)
            ? state.completedItemIds.filter((id) => id !== itemId)
            : [...state.completedItemIds, itemId],
        })),
    }),
    {
      name: PROGRESS_STORAGE_KEY,
      storage: progressStorage,
      partialize: (state) => ({
        streak: state.streak,
        completedItemIds: state.completedItemIds,
      }),
    },
  ),
);
